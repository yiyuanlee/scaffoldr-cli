import chalk from 'chalk';

/**
 * Styled console logger for CLI output
 */
export const logger = {
  debug(msg: string) {
    if (process.env.DEBUG) {
      console.log(chalk.gray('[debug]'), msg);
    }
  },
  info(msg: string) {
    console.log(chalk.blue('ℹ'), msg);
  },
  success(msg: string) {
    console.log(chalk.green('✓'), msg);
  },
  warn(msg: string) {
    console.log(chalk.yellow('⚠'), msg);
  },
  error(msg: string) {
    console.error(chalk.red('✗'), msg);
  },
  step(msg: string) {
    console.log(chalk.cyan('›'), msg);
  },
  bold(msg: string) {
    console.log(chalk.bold(msg));
  },
};
