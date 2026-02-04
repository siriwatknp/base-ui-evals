import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { test, expect } from 'vitest';

const content = readFileSync('src/App.tsx', 'utf-8');

test('imports Select from correct package', () => {
  expect(content).toMatch(
    /import\s+.*Select.*from\s+['"]@base-ui\/react\/select['"]/,
  );
});

test('uses Select.Root with defaultValue', () => {
  expect(content).toMatch(/Select\.Root/);
  expect(content).toMatch(/defaultValue\s*=\s*["']us["']/);
});

test('uses Select.Trigger with Select.Value and Select.Icon', () => {
  expect(content).toMatch(/Select\.Trigger/);
  expect(content).toMatch(/Select\.Value/);
  expect(content).toMatch(/Select\.Icon/);
});

test('uses Portal > Positioner > Popup > List chain', () => {
  expect(content).toMatch(/Select\.Portal/);
  expect(content).toMatch(/Select\.Positioner/);
  expect(content).toMatch(/Select\.Popup/);
  expect(content).toMatch(/Select\.List/);
});

test('has four Select.Item with correct values', () => {
  const itemMatches = content.match(/Select\.Item[\s\n>]/g);
  expect(itemMatches).not.toBeNull();
  expect(itemMatches!.length).toBeGreaterThanOrEqual(4);
  expect(content).toMatch(/value\s*=\s*["']us["']/);
  expect(content).toMatch(/value\s*=\s*["']uk["']/);
  expect(content).toMatch(/value\s*=\s*["']ca["']/);
  expect(content).toMatch(/value\s*=\s*["']au["']/);
});

test('each Item has ItemText and ItemIndicator', () => {
  const textMatches = content.match(/Select\.ItemText/g);
  const indicatorMatches = content.match(/Select\.ItemIndicator/g);
  expect(textMatches).not.toBeNull();
  expect(textMatches!.length).toBeGreaterThanOrEqual(4);
  expect(indicatorMatches).not.toBeNull();
  expect(indicatorMatches!.length).toBeGreaterThanOrEqual(4);
});

test('has all country names', () => {
  expect(content).toContain('United States');
  expect(content).toContain('United Kingdom');
  expect(content).toContain('Canada');
  expect(content).toContain('Australia');
});

test('app builds successfully', () => {
  execSync('npm run build', { stdio: 'pipe' });
});
