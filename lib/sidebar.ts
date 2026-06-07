export const SIDEBAR_WIDTH_DEFAULT = "16rem";
export const SIDEBAR_WIDTH_WIDE = "20rem";

export type SidebarWidthMode = "default" | "wide";

export const SIDEBAR_WIDTH_STORAGE_KEY = "dispatchflow_sidebar_width";
export const SIDEBAR_OPEN_STORAGE_KEY = "sidebar_state";

export function getSidebarWidthCSSValue(mode: SidebarWidthMode): string {
  return mode === "wide" ? SIDEBAR_WIDTH_WIDE : SIDEBAR_WIDTH_DEFAULT;
}

export function readSidebarWidthMode(): SidebarWidthMode {
  if (typeof window === "undefined") return "default";
  const stored = window.localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
  return stored === "wide" ? "wide" : "default";
}

export function readSidebarOpenState(): boolean {
  if (typeof document === "undefined") return true;
  const match = document.cookie.match(/sidebar_state=(true|false)/);
  if (match) return match[1] === "true";
  return true;
}
