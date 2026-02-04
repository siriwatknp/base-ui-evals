# Base UI Evals

Agent evaluation framework for Base UI tasks using [agent-eval](https://www.npmjs.com/package/agent-eval).

## Setup

```bash
npm install
```

Create a `.env` file in the root:

```env
AI_GATEWAY_API_KEY=<your-ai-gateway-key>
VERCEL_TOKEN=<your-vercel-token>
```

### Tokens

| Token | Where to get it |
| --- | --- |
| `AI_GATEWAY_API_KEY` | [Vercel AI Gateway](https://vercel.com/dashboard) > AI Gateway |
| `VERCEL_TOKEN` | [Vercel Account Tokens](https://vercel.com/account/tokens) — create a personal access token |

> In CI, use `VERCEL_OIDC_TOKEN` instead of `VERCEL_TOKEN` (automatically provided by Vercel's CI integration).

## Project structure

```
evals/
  <eval-name>/
    PROMPT.md        # Task description given to the agent
    EVAL.ts          # Vitest tests that validate the agent's output
    package.json     # Eval-specific dependencies & scripts
    tsconfig.json    # TypeScript config
    src/             # Source code the agent will modify
experiments/
  cc.ts              # Claude Code experiment config
  codex.ts           # Codex experiment config
```

## Creating a new eval

Each eval lives in `evals/<eval-name>/` and contains:

1. **`PROMPT.md`** — the task description the agent receives
2. **`EVAL.ts`** — vitest tests that verify the agent completed the task correctly
3. **`package.json`** — dependencies and a `build` script
4. **`tsconfig.json`** — TypeScript config
5. **`src/`** — starter source code the agent will modify

### Use an AI coding agent to scaffold

Copy and paste the following prompt to your AI coding agent:

---

```
Create a new eval in `evals/<EVAL_NAME>/` by following the existing pattern in `evals/add-greeting/`.

The eval should test: <DESCRIBE WHAT THE EVAL SHOULD TEST>

Create these files:

1. `evals/<EVAL_NAME>/PROMPT.md` — Write a clear task description with specific requirements. This is what the agent under test will receive as instructions.

2. `evals/<EVAL_NAME>/EVAL.ts` — Write vitest tests that validate the agent completed the task. Tests should:
   - Read source files and assert expected changes exist
   - Run `npm run build` to verify the code still compiles
   - Be deterministic (no flaky checks)

3. `evals/<EVAL_NAME>/package.json` — Include:
   - A `"build"` script (usually `"tsc"`)
   - Required dependencies for the source code (e.g. react, @base-ui-components/react)
   - vitest and typescript as devDependencies

4. `evals/<EVAL_NAME>/tsconfig.json` — Use this template:
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "ESNext",
       "moduleResolution": "bundler",
       "jsx": "react-jsx",
       "strict": true,
       "outDir": "dist",
       "skipLibCheck": true
     },
     "include": ["src"]
   }

5. `evals/<EVAL_NAME>/src/` — Create starter source files that the agent will need to modify to complete the task.

Reference `evals/add-greeting/` for the exact patterns used.
```

---

Replace `<EVAL_NAME>` with the eval name (kebab-case) and `<DESCRIBE WHAT THE EVAL SHOULD TEST>` with your task description.
