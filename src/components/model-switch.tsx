"use client";

import { Cpu, Cloud } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface ModelSwitchProps {
  preferCloud: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export function ModelSwitch({
  preferCloud,
  onChange,
  disabled,
}: ModelSwitchProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-2">
        <Badge
          variant={preferCloud ? "outline" : "secondary"}
          className="gap-1"
        >
          <Cpu className="h-3 w-3" />
          本地
        </Badge>
        <Tooltip>
          <TooltipTrigger asChild>
            <Switch
              checked={preferCloud}
              onCheckedChange={onChange}
              disabled={disabled}
              aria-label="切换本地/云端模型"
            />
          </TooltipTrigger>
          <TooltipContent>
            {preferCloud
              ? "当前：云端 Claude"
              : "当前：本地 MLX（离线自动降级云端）"}
          </TooltipContent>
        </Tooltip>
        <Badge
          variant={preferCloud ? "secondary" : "outline"}
          className="gap-1"
        >
          <Cloud className="h-3 w-3" />
          云端
        </Badge>
      </div>
    </TooltipProvider>
  );
}
