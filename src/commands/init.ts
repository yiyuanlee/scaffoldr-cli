import path from 'path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';
import { renderTemplate, registerHelpers, TemplateContext } from '../core/template';
import { logger } from '../core/logger';
import { TEMPLATE_DIR } from '../core/constants';

const TEMPLATES = ['api', 'library', 'component'] as const;
type TemplateName = (typeof TEMPLATES)[number];

export async function initCommand(name: string, opts: { template?: string; yes?: boolean }) {
  registerHelpers();

  const targetDir = path.resolve(name);

  // Check if directory already exists
  if (await fs.pathExists(targetDir)) {
    logger.error(`Directory ${name} already exists. Please choose a different name.`);
    process.exit(1);
  }

  logger.step(`Scaffolding project ${name}...\n`);

  let context: TemplateContext;

  if (opts.yes) {
    // Non-interactive mode: use defaults
    context = {
      projectName: name,
      author: 'Yiyuan Li',
      description: `A ${opts.template || 'api'} project`,
      useTypeScript: true,
      useESLint: true,
      useJest: true,
    };
  } else {
    // Interactive wizard
    const answers = await inquirer.prompt<TemplateContext>([
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
        default: `A ${opts.template || 'api'} project`,
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author name:',
        default: 'Yiyuan Li',
      },
      {
        type: 'confirm',
        name: 'useTypeScript',
        message: 'Use TypeScript?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'useESLint',
        message: 'Add ESLint?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'useJest',
        message: 'Add Jest for testing?',
        default: true,
      },
    ]);

    context = {
      projectName: name,
      ...answers,
    };
  }

  // Resolve template directory
  const templateName = (TEMPLATES.includes(opts.template as TemplateName)
    ? opts.template
    : 'api') as TemplateName;

  const templatePath = path.join(TEMPLATE_DIR, templateName);

  if (!(await fs.pathExists(templatePath))) {
    logger.error(`Template "${templateName}" not found. Available: ${TEMPLATES.join(', ')}`);
    process.exit(1);
  }

  const spinner = ora({
    text: 'Generating files...',
    spinner: 'dots',
  }).start();

  try {
    await fs.mkdirp(targetDir);
    await renderTemplate(templatePath, targetDir, context);
    spinner.succeed();

    logger.bold(`\n✅ Project "${name}" created successfully!\n`);
    logger.info(`Next steps:`);
    logger.step(`  cd ${name}`);
    logger.step(`  npm install`);
    logger.step(`  npm run dev\n`);
  } catch (err) {
    spinner.fail();
    logger.error(`Failed to scaffold project: ${(err as Error).message}`);
    // Clean up on failure
    await fs.remove(targetDir);
    process.exit(1);
  }
}
