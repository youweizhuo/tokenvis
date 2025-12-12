"use client";

import * as React from "react";

import { cn } from "@/lib/ui";

type SheetProps = {
  open: boolean;
  side?: "left" | "right";
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
};

export function Sheet({ open, side = "left", onClose, className, children }: SheetProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "relative h-full w-4/5 max-w-sm bg-white shadow-2xl transition-transform",
          side === "left"
            ? open
              ? "translate-x-0"
              : "-translate-x-full"
            : open
              ? "translate-x-0 ml-auto"
              : "translate-x-full ml-auto",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

