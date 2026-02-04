import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { test, expect } from 'vitest';

const content = readFileSync('src/App.tsx', 'utf-8');

test('imports Tabs from correct package', () => {
  expect(content).toMatch(
    /import\s+.*Tabs.*from\s+['"]@base-ui\/react\/tabs['"]/,
  );
});

test('uses Tabs.Root with defaultValue overview', () => {
  expect(content).toMatch(/Tabs\.Root/);
  expect(content).toMatch(/defaultValue\s*=\s*["']overview["']/);
});

test('uses Tabs.List', () => {
  expect(content).toMatch(/Tabs\.List/);
});

test('has three Tabs.Tab with correct values', () => {
  const tabMatches = content.match(/Tabs\.Tab[\s\n]/g);
  expect(tabMatches).not.toBeNull();
  expect(tabMatches!.length).toBeGreaterThanOrEqual(3);
  expect(content).toMatch(/value\s*=\s*["']overview["']/);
  expect(content).toMatch(/value\s*=\s*["']features["']/);
  expect(content).toMatch(/value\s*=\s*["']pricing["']/);
});

test('has Tabs.Indicator', () => {
  expect(content).toMatch(/Tabs\.Indicator/);
});

test('has three Tabs.Panel', () => {
  const panelMatches = content.match(/Tabs\.Panel/g);
  expect(panelMatches).not.toBeNull();
  expect(panelMatches!.length).toBeGreaterThanOrEqual(3);
});

test('panels have correct content', () => {
  expect(content).toContain('Welcome to our product overview.');
  expect(content).toContain('Starting at $9.99/month');
});

test('features panel has a list', () => {
  expect(content).toMatch(/<ul/);
  const liMatches = content.match(/<li/g);
  expect(liMatches).not.toBeNull();
  expect(liMatches!.length).toBeGreaterThanOrEqual(2);
});

test('app builds successfully', () => {
  execSync('npm run build', { stdio: 'pipe' });
});
