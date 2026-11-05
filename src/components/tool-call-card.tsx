"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ToolCallCardProps {
  toolName: string;
  state?: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
}

const STATE_META: Record<
  string,
  { label: string; variant: BadgeProps["variant"]; icon: LucideIcon }
> = {
  "input-streaming": { label: "调用中", variant: "secondary", icon: Loader2 },
  "input-available": { label: "执行中", variant: "secondary", icon: Loader2 },
  "output-available": { label: "已完成", variant: "default", icon: CheckCircle2 },
  "output-error": { label: "出错", variant: "destructive", icon: AlertCircle },
  "approval-requested": { label: "待审批", variant: "outline", icon: Wrench },
  "approval-responded": { label: "审批中", variant: "outline", icon: Wrench },
  "output-denied": { label: "已拒绝", variant: "destructive", icon: AlertCircle },
};

export function ToolCallCard({
  toolName,
  state,
  input,
  output,
  errorText,
}: ToolCallCardProps) {
  const [open, setOpen] = useState(false);
  const meta =
    (state && STATE_META[state]) || {
      label: state ?? "未知",
      variant: "outline" as const,
      icon: Wrench,
    };
  const Icon = meta.icon;
  const isRunning =
    state === "input-streaming" || state === "input-available";

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="rounded-lg border bg-muted/30"
    >
      <CollapsibleTrigger className="flex w-full items-center gap-2 px-3 py-2 text-sm">
        <ChevronRight
          className={cn("h-4 w-4 transition-transform", open && "rotate-90")}
        />
        <Icon className={cn("h-4 w-4", isRunning && "animate-spin")} />
        <span className="font-mono font-medium">{toolName}</span>
        <Badge variant={meta.variant} className="ml-auto">
          {meta.label}
        </Badge>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 border-t px-3 py-2 text-xs">
        {input != null && (
          <div>
            <div className="mb-1 text-muted-foreground">参数</div>
            <pre className="overflow-x-auto rounded bg-background p-2 font-mono">
              {JSON.stringify(input, null, 2)}
            </pre>
          </div>
        )}
        {output != null && (
          <div>
            <div className="mb-1 text-muted-foreground">结果</div>
            <pre className="overflow-x-auto rounded bg-background p-2 font-mono">
              {JSON.stringify(output, null, 2)}
            </pre>
          </div>
        )}
        {errorText && (
          <div>
            <div className="mb-1 text-destructive">错误</div>
            <pre className="overflow-x-auto rounded bg-background p-2 font-mono text-destructive">
              {errorText}
            </pre>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
