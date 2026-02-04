import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { test, expect } from 'vitest';

const content = readFileSync('src/App.tsx', 'utf-8');

test('preserves existing profile card', () => {
  expect(content).toContain('My Profile');
  expect(content).toContain('Name: Jane Doe');
  expect(content).toContain('Email: jane@example.com');
});

test('imports Dialog from correct package', () => {
  expect(content).toMatch(
    /import\s+.*Dialog.*from\s+['"]@base-ui\/react\/dialog['"]/,
  );
});

test('imports Field from correct package', () => {
  expect(content).toMatch(
    /import\s+.*Field.*from\s+['"]@base-ui\/react\/field['"]/,
  );
});

test('uses full Dialog composition', () => {
  expect(content).toMatch(/Dialog\.Root/);
  expect(content).toMatch(/Dialog\.Trigger/);
  expect(content).toMatch(/Dialog\.Portal/);
  expect(content).toMatch(/Dialog\.Backdrop/);
  expect(content).toMatch(/Dialog\.Popup/);
});

test('does not use Dialog.Content (wrong API)', () => {
  expect(content).not.toMatch(/Dialog\.Content/);
});

test('dialog has Title and Description', () => {
  expect(content).toMatch(/Dialog\.Title/);
  expect(content).toMatch(/Dialog\.Description/);
  expect(content).toContain('Update your personal information.');
});

test('has two Field.Root with Field.Label', () => {
  const fieldRootMatches = content.match(/Field\.Root/g);
  expect(fieldRootMatches).not.toBeNull();
  expect(fieldRootMatches!.length).toBeGreaterThanOrEqual(2);
  const labelMatches = content.match(/Field\.Label/g);
  expect(labelMatches).not.toBeNull();
  expect(labelMatches!.length).toBeGreaterThanOrEqual(2);
});

test('has Field.Control for inputs', () => {
  const controlMatches = content.match(/Field\.Control/g);
  expect(controlMatches).not.toBeNull();
  expect(controlMatches!.length).toBeGreaterThanOrEqual(2);
});

test('has correct field names and labels', () => {
  expect(content).toContain('Display Name');
  expect(content).toContain('Email');
  expect(content).toMatch(/name\s*=\s*["']displayName["']/);
  expect(content).toMatch(/name\s*=\s*["']email["']/);
});

test('has form with submit and cancel buttons', () => {
  expect(content).toMatch(/<form/);
  expect(content).toContain('Save Changes');
  expect(content).toContain('Cancel');
  expect(content).toMatch(/Dialog\.Close/);
});

test('app builds successfully', () => {
  execSync('npm run build', { stdio: 'pipe' });
});
