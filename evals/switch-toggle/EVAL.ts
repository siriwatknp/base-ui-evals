import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { test, expect } from 'vitest';

const content = readFileSync('src/App.tsx', 'utf-8');

test('imports Switch from correct package', () => {
  expect(content).toMatch(
    /import\s+.*Switch.*from\s+['"]@base-ui\/react\/switch['"]/,
  );
});

test('uses Switch.Root', () => {
  expect(content).toMatch(/Switch\.Root/);
});

test('uses Switch.Thumb inside Root', () => {
  expect(content).toMatch(/Switch\.Thumb/);
});

test('has name prop set to notifications', () => {
  expect(content).toMatch(/name\s*=\s*["']notifications["']/);
});

test('has label text', () => {
  expect(content).toContain('Enable notifications');
});

test('app builds successfully', () => {
  execSync('npm run build', { stdio: 'pipe' });
});
