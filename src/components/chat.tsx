"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { AlertCircle, MessageSquare } from "lucide-react";

import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import { ModelSwitch } from "@/components/model-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { AUTO, routeFromValue } from "@/lib/models";

export function Chat() {
  const [modelValue, setModelValue] = useState<string>(AUTO);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ body, messages }) => {
          const route = routeFromValue(modelValue);
          return {
            body: { ...body, messages, ...(route ? { route } : {}) },
          };
        },
      }),
    [modelValue],
  );

  const { messages, sendMessage, status, stop, error, regenerate } = useChat({
    transport,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <span className="text-lg font-semibold">Matrix AI Chat</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <ModelSwitch
            value={modelValue}
            onChange={setModelValue}
            disabled={isLoading}
          />
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 pt-24 text-muted-foreground">
              <MessageSquare className="h-10 w-10" />
              <p className="text-sm">
                开始与 Matrix AI 对话，支持工具调用与流式输出
              </p>
            </div>
          ) : (
            messages.map((m: UIMessage) => (
              <ChatMessage key={m.id} message={m} />
            ))
          )}
          {error && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error.message}
            </div>
          )}
        </div>
      </div>

      <footer className="border-t px-4 py-3">
        <div className="mx-auto max-w-3xl">
          <ChatInput
            onSend={(text) => sendMessage({ text })}
            onStop={stop}
            onRegenerate={() => regenerate()}
            isLoading={isLoading}
            canRegenerate={messages.length > 0 && !isLoading}
          />
        </div>
      </footer>
    </div>
  );
}
