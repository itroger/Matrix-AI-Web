"use client";

import { type UIMessage } from "ai";
import { Streamdown } from "streamdown";

import { ToolCallCard } from "@/components/tool-call-card";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: UIMessage;
}

type AnyPart = {
  type: string;
  text?: string;
  state?: string;
  toolName?: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

function isToolPart(part: AnyPart): boolean {
  return (
    part.type === "dynamic-tool" ||
    (typeof part.type === "string" && part.type.startsWith("tool-"))
  );
}

function getToolName(part: AnyPart): string {
  if (part.type === "dynamic-tool") return part.toolName ?? "dynamic-tool";
  if (typeof part.type === "string" && part.type.startsWith("tool-")) {
    return part.type.slice(5);
  }
  return part.type;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] space-y-2",
          isUser
            ? "rounded-2xl bg-primary px-4 py-2 text-primary-foreground"
            : "w-full space-y-3",
        )}
      >
        {message.parts.map((part, i) => {
          const p = part as unknown as AnyPart;

          if (p.type === "text") {
            const text = p.text ?? "";
            if (!text) return null;
            if (isUser) {
              return (
                <div key={i} className="whitespace-pre-wrap">
                  {text}
                </div>
              );
            }
            return (
              <div key={i} className="streamdown-body">
                <Streamdown
                  mode={p.state === "streaming" ? "streaming" : "static"}
                >
                  {text}
                </Streamdown>
              </div>
            );
          }

          if (isToolPart(p)) {
            return (
              <ToolCallCard
                key={i}
                toolName={getToolName(p)}
                state={p.state}
                input={p.input}
                output={p.output}
                errorText={p.errorText}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
