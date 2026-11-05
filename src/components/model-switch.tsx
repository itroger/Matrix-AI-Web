"use client";

import { Cpu, Cloud, Zap } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AUTO, MODEL_OPTIONS, routeFromValue } from "@/lib/models";

interface ModelSwitchProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ModelSwitch({ value, onChange, disabled }: ModelSwitchProps) {
  const route = routeFromValue(value);
  const isLocal = route === "local";
  const isAuto = route === undefined;

  const Icon = isAuto ? Zap : isLocal ? Cpu : Cloud;
  const hint =
    value === "auto"
      ? "自动：本地优先，离线降级云端"
      : value === "local"
        ? "本地 MLX：强制本地 gemma-4"
        : `云端模型：${value}`;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <Tooltip>
          <TooltipTrigger asChild>
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              aria-label="选择模型"
              className="h-8 max-w-[10rem] truncate rounded-md border border-input bg-background px-2 text-sm text-foreground outline-none transition-colors focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              {MODEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </TooltipTrigger>
          <TooltipContent>{hint}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
