import type { ExperimentConfig } from 'agent-eval';

const config: ExperimentConfig = {
  agent: 'vercel-ai-gateway/codex',
  runs: 1,
  earlyExit: true,
  scripts: ['build'],
  timeout: 600,
};

export default config;
