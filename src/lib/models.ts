export interface ModelOption {
  value: string;
  label: string;
  hint?: string;
}

export const AUTO = "auto" as const;

export const MODEL_OPTIONS: ModelOption[] = [
  { value: "auto", label: "自动", hint: "本地优先，离线降级云端" },
  { value: "local", label: "本地 MLX", hint: "强制本地 gemma-4" },
  { value: "anthropic/claude-sonnet-5.5", label: "Claude Sonnet 5.5" },
  { value: "anthropic/claude-opus-5.5", label: "Claude Opus 5.5" },
  { value: "anthropic/claude-haiku-5.5", label: "Claude Haiku 5.5" },
  { value: "openai/gpt-5.2", label: "GPT-5.2" },
  { value: "openai/gpt-5.2-fast", label: "GPT-5.2 Fast" },
  { value: "openai/gpt-4o", label: "GPT-4o" },
  { value: "openai/gpt-4o-mini", label: "GPT-4o mini" },
  { value: "google/gemini-3.5-flash", label: "Gemini 3.5 Flash" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { value: "deepseek/deepseek-v4-pro", label: "DeepSeek V4 Pro" },
  { value: "spacexai/grok-4.7", label: "Grok 4.7" },
  { value: "zai/glm-5.3", label: "GLM-5.3" },
];

export function routeFromValue(value: string): string | undefined {
  return value === "auto" ? undefined : value;
}
