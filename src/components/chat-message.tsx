"use client";

import { type UIMessage } from "ai";
import { Sparkles } from "lucide-react";
import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";

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

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] space-y-2 rounded-2xl bg-muted px-4 py-2.5">
          {message.parts.map((part, i) => {
            const p = part as unknown as AnyPart;
            if (p.type === "text") {
              const text = p.text ?? "";
              if (!text) return null;
              return (
                <div key={i} className="whitespace-pre-wrap text-sm leading-relaxed">
                  {text}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 space-y-3 pt-1">
        {message.parts.map((part, i) => {
          const p = part as unknown as AnyPart;

          if (p.type === "text") {
            const text = p.text ?? "";
            if (!text) return null;
            const isStreaming = p.state === "streaming";
            return (
              <Streamdown
                key={i}
                mode={isStreaming ? "streaming" : "static"}
                plugins={{ code }}
                shikiTheme={["github-light", "github-dark"]}
                parseIncompleteMarkdown={isStreaming}
                normalizeHtmlIndentation
                dir="auto"
                animated={isStreaming}
                isAnimating={isStreaming}
                className="streamdown-body"
              >
                {text}
              </Streamdown>
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
