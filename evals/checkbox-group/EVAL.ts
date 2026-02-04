import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { test, expect } from 'vitest';

const content = readFileSync('src/App.tsx', 'utf-8');

test('imports Checkbox from correct package', () => {
  expect(content).toMatch(
    /import\s+.*Checkbox.*from\s+['"]@base-ui\/react\/checkbox['"]/,
  );
});

test('uses Checkbox.Root for each checkbox', () => {
  const matches = content.match(/Checkbox\.Root/g);
  expect(matches).not.toBeNull();
  expect(matches!.length).toBeGreaterThanOrEqual(3);
});

test('uses Checkbox.Indicator inside each checkbox', () => {
  const matches = content.match(/Checkbox\.Indicator/g);
  expect(matches).not.toBeNull();
  expect(matches!.length).toBeGreaterThanOrEqual(3);
});

test('has all three name attributes', () => {
  expect(content).toMatch(/name\s*=\s*["']email["']/);
  expect(content).toMatch(/name\s*=\s*["']sms["']/);
  expect(content).toMatch(/name\s*=\s*["']push["']/);
});

test('email checkbox is defaultChecked', () => {
  expect(content).toContain('defaultChecked');
});

test('has fieldset and legend', () => {
  expect(content).toMatch(/<fieldset/);
  expect(content).toContain('Notification Preferences');
});

test('has all label texts', () => {
  expect(content).toContain('Email updates');
  expect(content).toContain('SMS alerts');
  expect(content).toContain('Push notifications');
});

test('app builds successfully', () => {
  execSync('npm run build', { stdio: 'pipe' });
});
