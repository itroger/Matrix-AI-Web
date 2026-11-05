"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { AlertCircle, Sparkles, Code2, Mail, Lightbulb, PenLine } from "lucide-react";

import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import { ModelSwitch } from "@/components/model-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { AUTO, routeFromValue } from "@/lib/models";

const SUGGESTIONS = [
  { icon: PenLine, title: "撰写文案", prompt: "帮我写一段产品发布的宣传文案" },
  { icon: Code2, title: "解释代码", prompt: "解释 React Server Components 的工作原理" },
  { icon: Mail, title: "起草邮件", prompt: "帮我起草一封请假邮件" },
  { icon: Lightbulb, title: "头脑风暴", prompt: "给一个周末副业项目的点子" },
];

function hasVisibleContent(message: UIMessage): boolean {
  return message.parts.some((p) => {
    const part = p as { type: string; text?: string };
    if (part.type === "text" && part.text) return true;
    if (
      part.type === "dynamic-tool" ||
      (typeof part.type === "string" && part.type.startsWith("tool-"))
    ) {
      return true;
    }
    return false;
  });
}

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
  const isEmpty = messages.length === 0;
  const showLoading =
    isLoading &&
    (messages.length === 0 ||
      messages[messages.length - 1].role === "user" ||
      !hasVisibleContent(messages[messages.length - 1]));

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => sendMessage({ text });

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-base font-medium">Matrix AI</span>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="mx-auto flex h-full max-w-3xl flex-col justify-center px-4">
            <div className="mb-8 space-y-2">
              <h1 className="text-3xl font-medium tracking-tight">
                你好，
              </h1>
              <p className="text-lg text-muted-foreground">
                今天能帮你做什么？
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SUGGESTIONS.map(({ icon: Icon, title, prompt }) => (
                <button
                  key={title}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="flex items-start gap-3 rounded-2xl border bg-card p-4 text-left transition-colors hover:bg-muted/50 disabled:opacity-50"
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm">{title}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
            {messages.map((m: UIMessage) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {showLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1.5 pt-3">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-[typing-bounce_1.4s_ease-in-out_infinite] [animation-delay:-0.32s]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-[typing-bounce_1.4s_ease-in-out_infinite] [animation-delay:-0.16s]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-[typing-bounce_1.4s_ease-in-out_infinite]" />
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error.message}
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="px-4 pb-3 pt-2">
        <div className="mx-auto max-w-3xl">
          <ChatInput
            onSend={handleSend}
            onStop={stop}
            onRegenerate={() => regenerate()}
            isLoading={isLoading}
            canRegenerate={messages.length > 0 && !isLoading}
            addon={
              <ModelSwitch
                value={modelValue}
                onChange={setModelValue}
                disabled={isLoading}
              />
            }
          />
        </div>
      </footer>

      <div className="fixed bottom-3 left-3 z-10">
        <ThemeToggle />
      </div>
    </div>
  );
}
