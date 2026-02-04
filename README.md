# Base UI Evals

Agent evaluation framework for Base UI tasks using [agent-eval](https://www.npmjs.com/package/@vercel/agent-eval).

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

| Token                | Where to get it                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------- |
| `AI_GATEWAY_API_KEY` | [Vercel AI Gateway](https://vercel.com/dashboard) > AI Gateway                              |
| `VERCEL_TOKEN`       | [Vercel Account Tokens](https://vercel.com/account/tokens) — create a personal access token |

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
skills/
  using-base-ui/     # Skills copied into -with-skill eval variants
experiments/
  cc.ts              # Claude Code experiment config
  codex.ts           # Codex experiment config
scripts/
  duplicate-evals-with-skill.sh  # Generates -with-skill eval copies
```

## Commands

| Command                           | Description                                                                                               |
| --------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `npm run generate-with-skill`     | Duplicate each eval into `<eval-name>-with-skill` with skills from `skills/` injected as `.claude/skills` |
| `npm run cc`                      | Generate `-with-skill` variants then run all evals via Claude Code                                        |
| `npx @vercel/agent-eval cc --dry` | Dry run (no API calls, no cost)                                                                           |

## Creating a new eval

Each eval lives in `evals/<eval-name>/` and contains:

1. **`PROMPT.md`** — short task description (can be a single line)
2. **`EVAL.ts`** — vitest tests that read source files and assert expected changes; always include a build test
3. **`package.json`** — dependencies and a `"build"` script (usually `"tsc"`)
4. **`tsconfig.json`** — TypeScript config
5. **`src/`** — starter source code with TODO comments hinting at the task

> **Naming rule:** eval names must NOT end with `-with-skill` — those are auto-generated.

After creating or modifying an eval, run:

```bash
npm run generate-with-skill
```

This duplicates each eval into `evals/<eval-name>-with-skill/` and copies `skills/` into `.claude/skills` inside the copy, so evals can be compared with and without skills.

## Running evals

```bash
npm run cc
```

This generates `-with-skill` variants first, then runs all evals via Claude Code.

To preview which evals will run without making API calls:

```bash
npx @vercel/agent-eval cc --dry
```
