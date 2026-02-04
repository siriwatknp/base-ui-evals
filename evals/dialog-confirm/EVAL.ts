import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { test, expect } from 'vitest';

const content = readFileSync('src/App.tsx', 'utf-8');

test('imports Dialog from correct package', () => {
  expect(content).toMatch(
    /import\s+.*Dialog.*from\s+['"]@base-ui\/react\/dialog['"]/,
  );
});

test('uses Dialog.Root', () => {
  expect(content).toMatch(/Dialog\.Root/);
});

test('uses Dialog.Trigger', () => {
  expect(content).toMatch(/Dialog\.Trigger/);
  expect(content).toContain('Delete Account');
});

test('uses Dialog.Portal', () => {
  expect(content).toMatch(/Dialog\.Portal/);
});

test('uses Dialog.Backdrop', () => {
  expect(content).toMatch(/Dialog\.Backdrop/);
});

test('uses Dialog.Popup (not Dialog.Content)', () => {
  expect(content).toMatch(/Dialog\.Popup/);
  expect(content).not.toMatch(/Dialog\.Content/);
});

test('has Dialog.Title and Dialog.Description for accessibility', () => {
  expect(content).toMatch(/Dialog\.Title/);
  expect(content).toMatch(/Dialog\.Description/);
  expect(content).toContain('This action cannot be undone. Are you sure?');
});

test('has two Dialog.Close buttons (Cancel and Confirm)', () => {
  const closeMatches = content.match(/Dialog\.Close/g);
  expect(closeMatches).not.toBeNull();
  expect(closeMatches!.length).toBeGreaterThanOrEqual(2);
  expect(content).toContain('Cancel');
  expect(content).toContain('Confirm');
});

test('app builds successfully', () => {
  execSync('npm run build', { stdio: 'pipe' });
});
