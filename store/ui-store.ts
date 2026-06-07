import { create } from "zustand";
import {
  readSidebarOpenState,
  readSidebarWidthMode,
  SIDEBAR_WIDTH_STORAGE_KEY,
  type SidebarWidthMode,
} from "@/lib/sidebar";

type UiState = {
  sidebarOpen: boolean;
  sidebarWidth: SidebarWidthMode;
  hydrated: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarWidth: (width: SidebarWidthMode) => void;
  toggleSidebarWidth: () => void;
  hydrateSidebarPreferences: () => void;
};

export const useUiStore = create<UiState>((set, get) => ({
  sidebarOpen: true,
  sidebarWidth: "default",
  hydrated: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarWidth: (width) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, width);
    }
    set({ sidebarWidth: width });
  },
  toggleSidebarWidth: () => {
    const next = get().sidebarWidth === "wide" ? "default" : "wide";
    get().setSidebarWidth(next);
  },
  hydrateSidebarPreferences: () => {
    if (get().hydrated) return;
    set({
      sidebarOpen: readSidebarOpenState(),
      sidebarWidth: readSidebarWidthMode(),
      hydrated: true,
    });
  },
}));
