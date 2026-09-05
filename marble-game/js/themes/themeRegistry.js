import { classicTheme } from "./classic/theme.js";
import { spaceTheme } from "./space/theme.js";
import { oceanTheme } from "./ocean/theme.js";
import { fantasyTheme } from "./fantasy/theme.js";

const THEMES = Object.freeze([
  classicTheme,
  spaceTheme,
  oceanTheme,
  fantasyTheme,
]);

const THEME_MAP = new Map(THEMES.map((theme) => [theme.id, theme]));

export function listThemes() {
  return THEMES;
}

export function getTheme(themeId) {
  return THEME_MAP.get(themeId) ?? null;
}

export function requireTheme(themeId) {
  const theme = getTheme(themeId);
  if (!theme) {
    throw new Error(`Unknown marble theme: ${themeId}`);
  }
  return theme;
}
