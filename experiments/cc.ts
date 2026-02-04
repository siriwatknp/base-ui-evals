import type { ExperimentConfig } from 'agent-eval';

const config: ExperimentConfig = {
  agent: 'vercel-ai-gateway/claude-code',
  runs: 1,
  earlyExit: true,
  scripts: ['build'],
  timeout: 600,
};

export default config;
