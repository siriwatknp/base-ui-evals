---
name: working-on-eval
description: invoke this skill when creating or modifying evals in this repo
---

## Rules

- The eval name must not end with `-with-skill` (the `-with-skill` copy is auto-generated)
- After creating or modifying an eval, run:

```bash
npm run generate-with-skill
```

## Eval structure

```
evals/
  <eval-name>/
    PROMPT.md           # Task for the agent (short, one-liner is fine)
    EVAL.ts             # Vitest tests to verify success
    package.json        # Dependencies + build script
    tsconfig.json       # TypeScript config
    src/                # Starter code the agent will modify
```

## Creating an eval

### PROMPT.md

Short task description. Can be a single line.

```markdown
Render a Base UI button in App.tsx
```

### EVAL.ts

Read source files and assert expected changes. Always include a build test.

```typescript
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { test, expect } from 'vitest';

const content = readFileSync('src/App.tsx', 'utf-8');

test('imports Button from @base-ui/react', () => {
  expect(content).toMatch(
    /import\s+.*Button.*from\s+['"]@base-ui\/react\/button['"]/,
  );
});

test('does not use @base-ui-components/react', () => {
  expect(content).not.toContain('@base-ui-components/react');
});

test('renders Button with Submit text', () => {
  expect(content).toContain('Submit');
});

test('app builds successfully', () => {
  execSync('npm run build', { stdio: 'pipe' });
});
```

### package.json

```json
{
  "name": "<eval-name>",
  "type": "module",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@base-ui/react": "^1.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0",
    "vitest": "^2.1.0"
  }
}
```

### tsconfig.json

```json
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
```

### src/App.tsx

Starter code with a TODO comment hinting at the task.

```tsx
export default function App() {
  return (
    <div>
      <h1>My App</h1>
      {/* TODO: Render a Base UI button here */}
    </div>
  );
}
```

## CLI commands

Dry run (no API calls, no cost):

```bash
npx @vercel/agent-eval cc --dry
```
