import type { ContributorResponse, User } from "../types";

export async function getNewMembers(
  pageId: string,
  currentManagers: string[],
  currentSubbers: string[],
): Promise<{ newManagers: User[]; newSubbers: User[] }> {
  const res = await fetch(
    `https://www.viki.com/api/containers/${pageId}/contributors`,
  );
  try {
    const data = (await res.json()) as ContributorResponse | undefined;
    if (data == undefined) {
      return { newManagers: [], newSubbers: [] };
    }
    let newManagers: User[] = [];
    let newSubbers: User[] = [];

    if (data.managers) {
      newManagers = data.managers
        .filter((manager) => !currentManagers.includes(manager.user.id))
        .map((manager) => manager.user);
    }
    if (data.subtitlers) {
      newSubbers = data.moderators
        .filter(
          (subber) =>
            !currentSubbers.includes(subber.user.id) &&
            subber.language_code === "de",
        )
        .map((subber) => subber.user);
    }

    return { newManagers, newSubbers };
  } catch (e) {
    console.error(e);
    return { newManagers: [], newSubbers: [] };
  }
}
