#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { version } from '../package.json';

program
  .name('morphix')
  .description(chalk.cyan('An extensible CLI scaffold generator with plugin system'))
  .version(version);

program
  .command('init')
  .description('Generate a new project from a template')
  .argument('<name>', 'Project name')
  .option('-t, --template <template>', 'Template to use (api | library | component)', 'api')
  .option('-y, --yes', 'Skip interactive prompts and use defaults')
  .action(initCommand);

program
  .command('add')
  .description('Add a plugin to the current project')
  .argument('<plugin>', 'Plugin name to add')
  .action(addCommand);

program
  .command('list')
  .description('List available templates and plugins')
  .action(() => {
    console.log(chalk.bold('\n📦 Available Templates'));
    console.log('  api       → Node.js REST API (Express + TypeScript)');
    console.log('  library   → TypeScript library (publish to npm)');
    console.log('  component → Frontend component library\n');
    console.log(chalk.bold('🔌 Available Plugins'));
    console.log('  (run morphix add <plugin> to install)\n');
  });

program.parse();
