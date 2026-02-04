import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { test, expect } from 'vitest';

const content = readFileSync('src/App.tsx', 'utf-8');

test('preserves existing content', () => {
  expect(content).toContain('Frequently Asked Questions');
  expect(content).toContain('Find answers to common questions below.');
});

test('imports Accordion from correct package', () => {
  expect(content).toMatch(
    /import\s+.*Accordion.*from\s+['"]@base-ui\/react\/accordion['"]/,
  );
});

test('uses Accordion.Root', () => {
  expect(content).toMatch(/Accordion\.Root/);
});

test('has three Accordion.Item entries', () => {
  const itemMatches = content.match(/Accordion\.Item/g);
  expect(itemMatches).not.toBeNull();
  expect(itemMatches!.length).toBeGreaterThanOrEqual(3);
});

test('uses correct nesting: Header > Trigger (not just Trigger)', () => {
  const headerCount = (content.match(/Accordion\.Header/g) || []).length;
  const triggerCount = (content.match(/Accordion\.Trigger/g) || []).length;
  expect(headerCount).toBeGreaterThanOrEqual(3);
  expect(triggerCount).toBeGreaterThanOrEqual(3);
});

test('uses Accordion.Panel for answers', () => {
  const panelMatches = content.match(/Accordion\.Panel/g);
  expect(panelMatches).not.toBeNull();
  expect(panelMatches!.length).toBeGreaterThanOrEqual(3);
});

test('has all question and answer texts', () => {
  expect(content).toContain('What is Base UI?');
  expect(content).toContain('Base UI is a headless component library for React.');
  expect(content).toContain('Is it accessible?');
  expect(content).toContain('Yes, all components follow WAI-ARIA guidelines.');
  expect(content).toContain('Can I style it myself?');
  expect(content).toContain('Yes, Base UI provides unstyled components.');
});

test('first item open by default via defaultValue on Root', () => {
  expect(content).toMatch(/defaultValue/);
});

test('app builds successfully', () => {
  execSync('npm run build', { stdio: 'pipe' });
});
