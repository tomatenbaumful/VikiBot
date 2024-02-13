import { Database } from "bun:sqlite";
import { getNewMembers } from "./func/viki";
import {
  ActivityType,
  Client,
  Events,
  GatewayIntentBits,
  GuildMemberRoleManager,
  Routes,
} from "discord.js";

const db = new Database("pages.sqlite");
const scheduledJobs: Timer[] = [];

const config = {
  interval: (Number(Bun.env.INTERVAL_HOURS) || 1) * 60 * 60 * 1000, // 1 hour
  token: Bun.env.TOKEN,
  channel: Bun.env.CHANNEL,
  role: Bun.env.ROLE_ID,
};

if (!config.token) {
  console.error("No token provided");
  process.exit(1);
}

if (!config.channel) {
  console.error("No channel provided");
  process.exit(1);
}

if (!config.role) {
  console.error("No role provided");
  process.exit(1);
}

console.log("Starting...");
console.log("Interval:", config.interval / 1000 / 60 / 60, "hours");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

db.run(`
CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY,
  title TEXT
)`);
db.run(`
CREATE TABLE IF NOT EXISTS managers (
  page_id TEXT,
  id TEXT,
  PRIMARY KEY (page_id, id),
  FOREIGN KEY (page_id)
    REFERENCES pages (id)
    ON DELETE CASCADE
)`);
db.run(`
CREATE TABLE IF NOT EXISTS moderators (
  page_id TEXT,
  id TEXT,
  PRIMARY KEY (page_id, id),
  FOREIGN KEY (page_id)
    REFERENCES pages (id) 
    ON DELETE CASCADE
)`);

const pageQuery = db.query<{ id: string; title: string }, []>(
  "SELECT * FROM pages",
);
// const paramPageQuery = db.query<{ id: string, title: string }, [string]>("SELECT * FROM pages WHERE id = ?1");
const managerQuery = db.query<{ page_id: string; id: string }, [string]>(
  "SELECT * FROM managers WHERE page_id = ?1",
);
const moderatorQuery = db.query<{ page_id: string; id: string }, [string]>(
  "SELECT * FROM moderators WHERE page_id = ?1",
);
let pageList = pageQuery.all();
pageQuery.finalize();

async function checkPage(page: { id: string; title: string }) {
  console.log("Checking", page.title);
  const managers = managerQuery.all(page.id);
  const subbers = moderatorQuery.all(page.id);
  const { newManagers, newSubbers } = await getNewMembers(
    page.id,
    managers.map((manager) => manager.id),
    subbers.map((subber) => subber.id),
  );
  if (newManagers.length === 0 && newSubbers.length === 0) {
    console.log("No new contributors for", page.title, "scheduled next check.");
    const timer = setTimeout(() => {
      checkPage(page);
    }, config.interval);
    scheduledJobs.push(timer);
    return;
  }

  for (const manager of newManagers) {
    db.run("INSERT INTO managers (page_id, id) VALUES (?, ?)", [
      page.id,
      manager.id,
    ]);
  }
  for (const subber of newSubbers) {
    db.run("INSERT INTO moderators (page_id, id) VALUES (?, ?)", [
      page.id,
      subber.id,
    ]);
  }
  // let message = `@<&${config.role}> `;
  let message = "";
  message += `New contributors for ${page.title}:\n`;
  if (newManagers.length > 0) {
    message += `Managers: ${newManagers
      .map((manager) => manager.username)
      .join(", ")}\n`;
  }
  if (newSubbers.length > 0) {
    message += `Moderators: ${newSubbers
      .map((subber) => subber.username)
      .join(", ")}\n`;
  }
  const channel = client.channels.resolveId(config.channel!);
  client.rest.post(Routes.channelMessages(channel), {
    body: { content: message },
  });
  console.log("Posted message for", page.title, "scheduled next check.");
  const timer = setTimeout(() => {
    checkPage(page);
  }, config.interval);
  scheduledJobs.push(timer);
}

function startAllJobs() {
  const step = config.interval / pageList.length;
  for (let i = 0; i < pageList.length; i++) {
    const page = pageList[i];
    console.log("Scheduling", page.title, "in", i * step, "ms");
    const timer = setTimeout(() => {
      checkPage(page);
    }, i * step);

    scheduledJobs.push(timer);
  }
}

function stopAllJobs() {
  for (const job of scheduledJobs) {
    try {
      clearTimeout(job);
    } catch (e) {
      console.error(e);
    }
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.log("Ready! Logged in as", readyClient.user?.tag);
  client.user?.setActivity(`${pageList.length} Shows`, {
    type: ActivityType.Watching,
  });
  startAllJobs();
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;
  if (!interaction.guildId) return;
  if (!interaction.member) return;
  const roles = interaction.member.roles as GuildMemberRoleManager;
  const hasRole = roles.cache.has(config.role!);
  if (!hasRole) {
    await interaction.reply("You do not have permission to use this command");
    return;
  }

  if (interaction.commandName === "add") {
    const pageId = interaction.options.get("show_id", true).value as string;
    try {
      const res = await fetch(
        `https://api.viki.io/v4/containers/${pageId}.json?&app=100000a`,
      );
      const data = await res.json();
      const title = data.titles.en || data.titles.de;
      if (!title) {
        console.error("No title found", data.titles);
        throw new Error("No title found");
      }
      db.run("INSERT INTO pages (id, title) VALUES (?, ?)", [pageId, title]);
      pageList.push({ id: pageId, title });
      client.user?.setActivity(`${pageList.length} Shows`, {
        type: ActivityType.Watching,
      });

      await interaction.reply(`Added ${title} to the watchlist`);
      const current = await getNewMembers(pageId, [], []);
      if (current.newManagers.length > 0) {
        for (const manager of current.newManagers) {
          db.run("INSERT INTO managers (page_id, id) VALUES (?, ?)", [
            pageId,
            manager.id,
          ]);
        }
      }
      if (current.newSubbers.length > 0) {
        for (const subber of current.newSubbers) {
          db.run("INSERT INTO moderators (page_id, id) VALUES (?, ?)", [
            pageId,
            subber.id,
          ]);
        }
      }

      stopAllJobs();
      startAllJobs();
    } catch (e) {
      console.error(e);
      interaction.reply(
        "Unable to add show. Please check the ID and try again.",
      );
    }
  } else if (interaction.commandName === "remove") {
    const pageId = interaction.options.get("show_id", true).value as string;
    const page = pageList.find((page) => page.id === pageId);
    if (!page) {
      interaction.reply("Show not found in the watchlist");
      return;
    }
    db.run("DELETE FROM pages WHERE id = ?", [pageId]);
    pageList = pageList.filter((page) => page.id !== pageId);
    client.user?.setActivity(`${pageList.length} Shows`, {
      type: ActivityType.Watching,
    });
    await interaction.reply("Removed show from the watchlist");
    stopAllJobs();
    startAllJobs();
  } else if (interaction.commandName === "list") {
    const list = pageList.map((page) => `${page.id}: ${page.title}`).join("\n");
    await interaction.reply("Currently watching:\n" + list);
  }
});

client.login(config.token);
