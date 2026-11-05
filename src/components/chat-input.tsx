"use client";

import { type KeyboardEvent, useRef, useState } from "react";
import { RefreshCw, Send, Square } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (text: string) => void;
  onStop: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
  canRegenerate: boolean;
}

export function ChatInput({
  onSend,
  onStop,
  onRegenerate,
  isLoading,
  canRegenerate,
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

  return (
    <div className="flex items-end gap-2">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        onInput={onInput}
        rows={1}
        placeholder="输入消息，Enter 发送，Shift+Enter 换行"
        className="flex-1 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring max-h-[200px]"
      />
      {canRegenerate && (
        <Button
          variant="outline"
          size="icon"
          onClick={onRegenerate}
          title="重新生成"
        >
          <RefreshCw />
        </Button>
      )}
      {isLoading ? (
        <Button
          variant="destructive"
          size="icon"
          onClick={onStop}
          title="停止"
        >
          <Square />
        </Button>
      ) : (
        <Button
          size="icon"
          onClick={submit}
          disabled={!value.trim()}
          title="发送"
        >
          <Send />
        </Button>
      )}
    </div>
  );
}
