import type { ExperimentConfig } from "@vercel/agent-eval";

const config: ExperimentConfig = {
  agent: "vercel-ai-gateway/codex",
  runs: 3,
  earlyExit: true,
  scripts: ["build"],
  timeout: 600,
};

export default config;
