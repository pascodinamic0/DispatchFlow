"use client";

import { ChevronsLeft, ChevronsRight, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useUiStore } from "@/store/ui-store";

type Props = {
  className?: string;
};

export function SidebarLayoutControls({ className }: Props) {
  const { state, isMobile, toggleSidebar } = useSidebar();
  const { sidebarWidth, toggleSidebarWidth } = useUiStore();

  if (isMobile || state === "collapsed") return null;

  return (
    <div className={cn("flex shrink-0 items-center gap-0.5", className)}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              onClick={toggleSidebarWidth}
              aria-label={
                sidebarWidth === "wide"
                  ? "Use standard sidebar width"
                  : "Use wide sidebar"
              }
            >
              {sidebarWidth === "wide" ? (
                <ChevronsLeft className="size-4" />
              ) : (
                <ChevronsRight className="size-4" />
              )}
            </Button>
          }
        />
        <TooltipContent side="bottom">
          {sidebarWidth === "wide" ? "Standard width" : "Wide sidebar"}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="size-4" />
            </Button>
          }
        />
        <TooltipContent side="bottom">Collapse sidebar</TooltipContent>
      </Tooltip>
    </div>
  );
}
