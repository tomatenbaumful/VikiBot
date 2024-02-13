import { REST, Routes, SlashCommandBuilder } from "discord.js";

const token = Bun.env.TOKEN;
const guildId = Bun.env.GUILD_ID;
const clientId = Bun.env.CLIENT_ID;

if (!token) {
  console.error("No token provided");
  process.exit(1);
}

if (!guildId) {
  console.error("No guild ID provided");
  process.exit(1);
}

if (!clientId) {
  console.error("No client ID provided");
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName("add")
    .setDescription("Adds an show to the watchlist.")
    .addStringOption((option) =>
      option
        .setName("show_id")
        .setDescription("ID of the show to add, e.g. 40444c")
        .setRequired(true),
    )
    .toJSON(),
  new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Removes an show from the watchlist.")
    .addStringOption((option) =>
      option
        .setName("show_id")
        .setDescription("ID of the show to add, e.g. 40444c")
        .setRequired(true),
    )
    .toJSON(),
  new SlashCommandBuilder()
    .setName("list")
    .setDescription("Lists all shows on the watchlist.")
    .toJSON(),
];
const rest = new REST().setToken(token);

try {
  console.log("Started refreshing application (/) commands.");

  const data = await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    {
      body: commands,
    },
  );

  console.log("Successfully reloaded application (/) commands.", data);
} catch (error) {
  console.error(error);
}
