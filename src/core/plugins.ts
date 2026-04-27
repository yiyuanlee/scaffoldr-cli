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

/**
 * Discover installed plugins from node_modules
 */
export async function discoverPlugins(): Promise<string[]> {
  // Reserved plugin names that are built-in
  const builtIn = ['eslint', 'prettier', 'jest', 'husky', 'lint-staged'];
  return builtIn;
}

/**
 * Load a plugin package dynamically
 */
export async function loadPlugin(pluginName: string): Promise<Plugin | null> {
  try {
    const pkg = await import(pluginName);
    return pkg as unknown as Plugin;
  } catch {
    return null;
  }
}

/**
 * Check if a plugin is installed in node_modules
 */
export async function isPluginInstalled(pluginName: string, dir: string): Promise<boolean> {
  const nodeModules = path.join(dir, 'node_modules', pluginName);
  return fs.pathExists(nodeModules);
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
