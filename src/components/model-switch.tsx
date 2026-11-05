"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { AUTO, MODEL_OPTIONS } from "@/lib/models";
import { cn } from "@/lib/utils";

interface ModelSwitchProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ModelSwitch({ value, onChange, disabled }: ModelSwitchProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const current = MODEL_OPTIONS.find((o) => o.value === value);
  const label = current?.label ?? value;
  const cloudStart = MODEL_OPTIONS.findIndex(
    (o) => o.value !== "auto" && o.value !== "local",
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 items-center gap-1 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="max-w-[8rem] truncate">{label}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="absolute bottom-full right-0 z-20 mb-2 w-56 overflow-hidden rounded-xl border bg-background shadow-lg">
          <div className="max-h-72 overflow-y-auto p-1">
            {MODEL_OPTIONS.map((opt, i) => {
              const showDivider = i === cloudStart;
              const isSelected = opt.value === value;
              return (
                <div key={opt.value}>
                  {showDivider && <div className="my-1 h-px bg-border" />}
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
