import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';
import { logger } from './logger';

export interface TemplateContext {
  projectName: string;
  author: string;
  description: string;
  useTypeScript: boolean;
  useESLint: boolean;
  useJest: boolean;
  [key: string]: unknown;
}

/**
 * Renders all files in a template directory into the target directory
 */
export async function renderTemplate(
  templateDir: string,
  targetDir: string,
  context: TemplateContext
): Promise<void> {
  const files = await fs.readdir(templateDir);

  for (const file of files) {
    const srcPath = path.join(templateDir, file);
    const stats = await fs.stat(srcPath);

    if (stats.isDirectory()) {
      // Skip node_modules and hidden directories
      if (file === 'node_modules' || file.startsWith('.')) continue;
      const destDir = path.join(targetDir, file);
      await fs.mkdirp(destDir);
      await renderTemplate(srcPath, destDir, context);
    } else {
      // Skip files that should not be rendered (e.g. .gitignore)
      const destFileName = file === 'gitignore' ? '.gitignore' : file;
      const destPath = path.join(targetDir, destFileName);

      const ext = path.extname(file);
      const text = await fs.readFile(srcPath, 'utf-8');

      // Only render .hbs files, leave others as-is
      if (ext === '.hbs') {
        const template = Handlebars.compile(text);
        const rendered = template(context);
        await fs.writeFile(destPath.replace('.hbs', ''), rendered, 'utf-8');
        logger.success(`Created ${destPath.replace('.hbs', '')}`);
      } else {
        await fs.copy(srcPath, destPath);
        logger.success(`Created ${destPath}`);
      }
    }
  }
}

/**
 * Register Handlebars helpers for template rendering
 */
export function registerHelpers(): void {
  Handlebars.registerHelper('capitalize', (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  Handlebars.registerHelper('camelCase', (str: string) => {
    return str.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  });

  Handlebars.registerHelper('ifEquals', (a: unknown, b: unknown, opts: Handlebars.HelperOptions) => {
    return a === b ? opts.fn(this) : opts.inverse(this);
  });
}
