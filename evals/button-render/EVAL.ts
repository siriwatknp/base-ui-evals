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
