"use client";

import { type KeyboardEvent, type ReactNode, useRef, useState } from "react";
import { ArrowUp, RefreshCw, Square } from "lucide-react";

import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (text: string) => void;
  onStop: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
  canRegenerate: boolean;
  addon?: ReactNode;
}

export function ChatInput({
  onSend,
  onStop,
  onRegenerate,
  isLoading,
  canRegenerate,
  addon,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const text = value.trim();
    if (!text || isLoading) return;
    onSend(text);
    setValue("");
    if (ref.current) ref.current.style.height = "auto";
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const onInput = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  const canSend = value.trim().length > 0;

  return (
    <div className="space-y-2">
      {canRegenerate && (
        <button
          onClick={onRegenerate}
          className="mx-auto flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
        >
          <RefreshCw className="h-3 w-3" />
          重新生成
        </button>
      )}
      <div className="flex items-end gap-2 rounded-3xl border bg-muted/50 px-4 py-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onInput={onInput}
          rows={1}
          placeholder="输入消息"
          className="flex-1 resize-none bg-transparent py-1.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none max-h-[200px]"
        />
        {addon}
        <button
          onClick={isLoading ? onStop : submit}
          disabled={!isLoading && !canSend}
          aria-label={isLoading ? "停止" : "发送"}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
            isLoading
              ? "bg-destructive text-destructive-foreground"
              : canSend
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
          )}
        >
          {isLoading ? (
            <Square className="h-4 w-4" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Matrix AI 可能会出错，请核实重要信息
      </p>
    </div>
  );
}
