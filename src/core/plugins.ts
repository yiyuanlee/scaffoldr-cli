import fs from 'fs-extra';
import path from 'path';
import { logger } from './logger';

export interface PluginManifest {
  name: string;
  version: string;
  description?: string;
}

export interface Plugin {
  name: string;
  version: string;
  install(ctx: PluginContext): Promise<void>;
  uninstall?(ctx: PluginContext): Promise<void>;
}

export interface PluginContext {
  projectDir: string;
  projectName: string;
}

const SCOPE_PREFIX = '@scaffoldr/plugin-';
const PLUGIN_PREFIX = 'scaffoldr-plugin-';

/**
 * Discover installed scaffoldr plugins from node_modules.
 * Finds both `scaffoldr-plugin-*` and `@scope/scaffoldr-plugin-*` packages.
 */
export async function discoverPlugins(projectDir: string): Promise<string[]> {
  const nodeModules = path.join(projectDir, 'node_modules');
  if (!(await fs.pathExists(nodeModules))) return [];

  const plugins: string[] = [];

  // List all packages in node_modules
  let entries: string[] = [];
  try {
    entries = await fs.readdir(nodeModules);
  } catch {
    return [];
  }

  for (const entry of entries) {
    // Skip scopes & hidden dirs
    if (entry.startsWith('.') || entry.startsWith('@')) continue;

    if (entry.startsWith(PLUGIN_PREFIX)) {
      plugins.push(entry);
    }
  }

  // Also check scoped packages under @scaffoldr/
  const scopeDir = path.join(nodeModules, '@scaffoldr');
  if (await fs.pathExists(scopeDir)) {
    let scopedEntries: string[] = [];
    try {
      scopedEntries = await fs.readdir(scopeDir);
    } catch {
      // ignore
    }
    for (const entry of scopedEntries) {
      if (entry.startsWith('plugin-')) {
        plugins.push(`@scaffoldr/${entry}`);
      }
    }
  }

  return plugins;
}

/**
 * Load a plugin package dynamically with safe error handling.
 */
export async function loadPlugin(
  pluginName: string,
  projectDir: string
): Promise<Plugin | null> {
  try {
    // Try resolving from project node_modules first
    const pluginPath = require.resolve(pluginName, { paths: [projectDir] });
    const pkg = require(pluginPath);
    return pkg as unknown as Plugin;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.debug(`Failed to load plugin "${pluginName}": ${msg}`);
    return null;
  }
}

/**
 * Check if a plugin is installed in project node_modules
 */
export async function isPluginInstalled(
  pluginName: string,
  dir: string
): Promise<boolean> {
  const nodeModules = path.join(dir, 'node_modules', pluginName);
  if (await fs.pathExists(nodeModules)) return true;

  // Also check scoped @scope/package
  if (pluginName.startsWith('@')) {
    const scopePath = path.join(dir, 'node_modules', pluginName);
    return fs.pathExists(scopePath);
  }

  return false;
}

/**
 * Install a plugin via npm install
 */
export async function installPlugin(
  pluginName: string,
  projectDir: string
): Promise<void> {
  const { execSync } = await import('child_process');

  logger.step(`Installing ${pluginName}...`);
  try {
    execSync(`npm install --save-dev ${pluginName}`, {
      cwd: projectDir,
      stdio: 'inherit',
    });
    logger.success(`${pluginName} installed successfully`);
  } catch {
    logger.error(`Failed to install ${pluginName}`);
    throw new Error(`npm install failed for plugin: ${pluginName}`);
  }
}
