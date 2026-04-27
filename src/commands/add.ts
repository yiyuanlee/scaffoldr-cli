import path from 'path';
import { isPluginInstalled, installPlugin, loadPlugin, discoverPlugins } from '../core/plugins';
import { logger } from '../core/logger';
import { PluginContext } from '../core/plugins';

const BUILT_IN_PLUGINS = ['eslint', 'prettier', 'jest', 'husky', 'lint-staged'];

export async function addCommand(plugin: string) {
  const projectDir = process.cwd();
  const packageJsonPath = path.join(projectDir, 'package.json');

  // Check if we're inside a morphix project
  if (!(await require('fs-extra').pathExists(packageJsonPath))) {
    logger.error('No project found. Please run this command inside a morphix project.');
    process.exit(1);
  }

  // Check if plugin is a known/built-in plugin
  if (!BUILT_IN_PLUGINS.includes(plugin)) {
    const available = await discoverPlugins();
    logger.warn(`Plugin "${plugin}" is not a known built-in plugin.`);
    logger.info(`Known plugins: ${available.join(', ')}`);
    logger.info(`You can also install any npm package directly via: npm install --save-dev ${plugin}`);
    process.exit(1);
  }

  // Check if already installed
  if (await isPluginInstalled(plugin, projectDir)) {
    logger.warn(`Plugin "${plugin}" is already installed.`);
    process.exit(0);
  }

  const ctx: PluginContext = { projectDir, projectName: path.basename(projectDir) };

  // Load plugin for pre/post install hooks
  const pluginModule = await loadPlugin(plugin);

  try {
    // Run plugin's install hook if it exists
    if (pluginModule?.install) {
      await pluginModule.install(ctx);
    } else {
      await installPlugin(plugin, projectDir);
    }

    logger.success(`Plugin "${plugin}" added successfully!`);
  } catch (err) {
    logger.error(`Failed to add plugin "${plugin}": ${(err as Error).message}`);
    process.exit(1);
  }
}
