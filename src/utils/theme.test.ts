import test from 'node:test';
import assert from 'node:assert/strict';
import {
  persistTheme,
  readStoredTheme,
  resolveInitialTheme,
  THEME_STORAGE_KEY,
  toggleThemeValue,
} from './theme';

test('resolveInitialTheme defaults to light when no preference is stored', () => {
  assert.equal(resolveInitialTheme(null), 'light');
  assert.equal(resolveInitialTheme(undefined), 'light');
  assert.equal(resolveInitialTheme('invalid'), 'light');
  assert.equal(resolveInitialTheme('light'), 'light');
  assert.equal(resolveInitialTheme('dark'), 'dark');
});

test('toggleThemeValue alternates cleanly between light and dark', () => {
  assert.equal(toggleThemeValue('light'), 'dark');
  assert.equal(toggleThemeValue('dark'), 'light');
});

test('readStoredTheme and persistTheme round-trip through storage safely', () => {
  const mem = new Map<string, string>();
  const mockStorage = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => {
      mem.set(k, v);
    },
  };

  assert.equal(readStoredTheme(mockStorage), 'light');
  persistTheme('dark', mockStorage);
  assert.equal(mem.get(THEME_STORAGE_KEY), 'dark');
  assert.equal(readStoredTheme(mockStorage), 'dark');
  persistTheme('light', mockStorage);
  assert.equal(readStoredTheme(mockStorage), 'light');
});

test('readStoredTheme and persistTheme tolerate storage exceptions gracefully', () => {
  const throwingStorage = {
    getItem: () => {
      throw new Error('blocked');
    },
    setItem: () => {
      throw new Error('blocked');
    },
  };
  assert.equal(readStoredTheme(throwingStorage), 'light');
  assert.doesNotThrow(() => persistTheme('dark', throwingStorage));
});
