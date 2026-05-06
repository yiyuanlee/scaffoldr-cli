import path from 'path';
import { isPluginInstalled, installPlugin, loadPlugin, discoverPlugins } from '../core/plugins';
import { logger } from '../core/logger';
import { PluginContext } from '../core/plugins';

const BUILT_IN_PLUGINS = ['eslint', 'prettier', 'jest', 'husky', 'lint-staged'];

export async function addCommand(plugin: string) {
  const projectDir = process.cwd();
  const packageJsonPath = path.join(projectDir, 'package.json');

  // Check if we're inside a scaffoldr project
  if (!(await require('fs-extra').pathExists(packageJsonPath))) {
    logger.error('No project found. Please run this command inside a scaffoldr project.');
    process.exit(1);
  }

  // Check if plugin is a known built-in plugin
  if (!BUILT_IN_PLUGINS.includes(plugin)) {
    // Treat unknown plugins as npm package names — let npm decide if it exists
    logger.warn(`Plugin "${plugin}" is not a known built-in plugin.`);
    logger.info(`Known built-ins: ${BUILT_IN_PLUGINS.join(', ')}`);
    logger.info(`Any npm package can be installed directly: npm install --save-dev ${plugin}`);
  }

  // Check if already installed
  if (await isPluginInstalled(plugin, projectDir)) {
    logger.warn(`Plugin "${plugin}" is already installed.`);
    process.exit(0);
  }

  const ctx: PluginContext = { projectDir, projectName: path.basename(projectDir) };

  // Try to load plugin for pre/post install hooks
  const pluginModule = await loadPlugin(plugin, projectDir);

  try {
    // Run plugin's install hook if it exists
    if (pluginModule?.install) {
      await pluginModule.install(ctx);
    } else {
      // Fall back to plain npm install
      await installPlugin(plugin, projectDir);
    }

    logger.success(`Plugin "${plugin}" added successfully!`);
  } catch (err) {
    logger.error(`Failed to add plugin "${plugin}": ${(err as Error).message}`);
    process.exit(1);
  }
}
