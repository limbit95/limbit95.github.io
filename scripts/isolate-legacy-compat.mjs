import { readFile, writeFile } from "node:fs/promises";

async function replaceOnce(filePath, pattern, replacement, label) {
  const source = await readFile(filePath, "utf8");
  const matches = [...source.matchAll(new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`))];
  if (matches.length !== 1) {
    throw new Error(`${label}: expected exactly one match in ${filePath}, found ${matches.length}`);
  }
  await writeFile(filePath, source.replace(pattern, replacement), "utf8");
}

await replaceOnce(
  "js/api/activities.js",
  /const PARTICIPATION_WITH_EVENT_COLUMNS = `[\s\S]*?`;\n\n/,
  "",
  "remove legacy participation column projection",
);
await replaceOnce(
  "js/api/activities.js",
  /\n\/\/ Backward compatibility for cached pre-P2 mypage modules\.[\s\S]*$/,
  "\n",
  "remove listMyParticipations from modern activities API",
);
await replaceOnce(
  "js/api/boards.js",
  /\n\/\/ Backward compatibility for cached pre-P2 prayer detail modules\.[\s\S]*?(?=\nexport async function createComment)/,
  "",
  "remove listComments from modern boards API",
);
await replaceOnce(
  "js/api/notifications.js",
  /\/\/ Backward-compatible API kept intentionally[\s\S]*?(?=export async function listNotificationsPage)/,
  "",
  "remove listNotifications from modern notifications API",
);

console.log("Legacy compatibility exports isolated from modern domain APIs.");
