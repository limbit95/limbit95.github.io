// Transitional facade for cached pre-hash clients only.
// Modern community code imports domain APIs directly and the hashed production bundle does not include this module.
export * from "./api/profiles.js";
export * from "./api/activities.js";
export * from "./api/boards.js";
export * from "./api/admin.js";
export * from "./api/polls.js";
export * from "./api/notifications.js";
export * from "./api/legacy-compat.js";
