/**
 * Valid icon names for the lofi DSL.
 * SYNC: Must match icons defined in @lofi/html packages/html/src/icons.ts
 */

const ICON_NAMES = [
  // Status (for alerts)
  "info",
  "check-circle",
  "warning",
  "x-circle",

  // Navigation
  "arrow-left",
  "arrow-right",
  "home",
  "menu",

  // Actions
  "plus",
  "minus",
  "edit",
  "trash",
  "copy",
  "download",
  "upload",
  "share",

  // UI
  "search",
  "settings",
  "user",
  "bell",
  "mail",
  "calendar",

  // Social/Feedback
  "heart",
  "star",
  "bookmark",

  // Media
  "play",
  "pause",
  "image",

  // From test cases
  "inbox",
  "rocket",
  "shield",
  "circle",
] as const;

export type IconName = (typeof ICON_NAMES)[number];
export const VALID_ICON_NAMES: ReadonlySet<string> = new Set(ICON_NAMES);
