import path from 'path';
import fs from 'fs-extra';
import { discoverPlugins, isPluginInstalled, loadPlugin } from '../plugins';

const TEST_DIR = path.join(__dirname, '../../__testtmp__');

beforeEach(async () => {
  await fs.ensureDir(TEST_DIR);
});

afterEach(async () => {
  await fs.remove(TEST_DIR);
});

describe('discoverPlugins', () => {
  it('returns empty array when no node_modules exists', async () => {
    const result = await discoverPlugins('/non-existent-dir');
    expect(result).toEqual([]);
  });

  it('returns empty array when node_modules is empty', async () => {
    await fs.ensureDir(path.join(TEST_DIR, 'node_modules'));
    const result = await discoverPlugins(TEST_DIR);
    expect(result).toEqual([]);
  });

  it('discovers scaffoldr-plugin-* packages', async () => {
    const nm = path.join(TEST_DIR, 'node_modules');
    await fs.ensureDir(path.join(nm, 'scaffoldr-plugin-eslint'));
    await fs.ensureDir(path.join(nm, 'scaffoldr-plugin-prettier'));
    await fs.ensureDir(path.join(nm, 'some-other-package')); // should be ignored

    const result = await discoverPlugins(TEST_DIR);
    expect(result).toContain('scaffoldr-plugin-eslint');
    expect(result).toContain('scaffoldr-plugin-prettier');
    expect(result).not.toContain('some-other-package');
  });

  it('discovers @scaffoldr/plugin-* scoped packages', async () => {
    const nm = path.join(TEST_DIR, 'node_modules');
    await fs.ensureDir(path.join(nm, '@scaffoldr', 'plugin-husky'));
    await fs.ensureDir(path.join(nm, '@scaffoldr', 'plugin-lint-staged'));

    const result = await discoverPlugins(TEST_DIR);
    expect(result).toContain('@scaffoldr/plugin-husky');
    expect(result).toContain('@scaffoldr/plugin-lint-staged');
  });

  it('skips hidden directories', async () => {
    const nm = path.join(TEST_DIR, 'node_modules');
    await fs.ensureDir(path.join(nm, '.bin'));
    await fs.ensureDir(path.join(nm, '@types'));

    const result = await discoverPlugins(TEST_DIR);
    expect(result).not.toContain('.bin');
    expect(result).not.toContain('@types');
  });
});

describe('isPluginInstalled', () => {
  it('returns false when node_modules does not exist', async () => {
    const result = await isPluginInstalled('some-plugin', '/non-existent');
    expect(result).toBe(false);
  });

  it('returns true when plugin directory exists', async () => {
    const nm = path.join(TEST_DIR, 'node_modules');
    await fs.ensureDir(path.join(nm, 'eslint'));

    const result = await isPluginInstalled('eslint', TEST_DIR);
    expect(result).toBe(true);
  });

  it('returns true for scoped packages', async () => {
    const nm = path.join(TEST_DIR, 'node_modules');
    await fs.ensureDir(path.join(nm, '@typescript-eslint', 'eslint-plugin'));

    const result = await isPluginInstalled('@typescript-eslint/eslint-plugin', TEST_DIR);
    expect(result).toBe(true);
  });

  it('returns false when plugin does not exist', async () => {
    const nm = path.join(TEST_DIR, 'node_modules');
    await fs.ensureDir(nm);

    const result = await isPluginInstalled('nonexistent', TEST_DIR);
    expect(result).toBe(false);
  });
});

describe('loadPlugin', () => {
  it('returns null when plugin cannot be resolved', async () => {
    const result = await loadPlugin('nonexistent-plugin-xyz', TEST_DIR);
    expect(result).toBeNull();
  });

  it('returns null with DEBUG env set but plugin not found (does not throw)', async () => {
    const prev = process.env.DEBUG;
    process.env.DEBUG = '1';
    try {
      const result = await loadPlugin('nonexistent-plugin-xyz', TEST_DIR);
      expect(result).toBeNull();
    } finally {
      if (prev === undefined) delete process.env.DEBUG;
      else process.env.DEBUG = prev;
    }
  });
});
