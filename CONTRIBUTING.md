# Contributing to scaffoldr

Thank you for your interest in contributing! 🎉

---

## Development Setup

```bash
# 1. Fork and clone the repo
git clone https://github.com/yiyuanlee/scaffoldr-cli.git
cd scaffoldr-cli

# 2. Install dependencies
npm install

# 3. Build TypeScript
npm run build

# 4. Run tests
npm test
```

---

## Project Structure

```
scaffoldr-cli/
├── src/
│   ├── index.ts          # CLI entry point (commander.js)
│   ├── commands/
│   │   ├── init.ts        # scaffoldr init command
│   │   └── add.ts         # scaffoldr add command
│   └── core/
│       ├── logger.ts      # Styled terminal output
│       ├── template.ts   # Handlebars template rendering
│       ├── plugins.ts    # Plugin discovery & loading
│       └── constants.ts  # Shared constants
├── templates/             # Built-in project templates
├── .github/workflows/     # CI/CD pipelines
└── package.json
```

---

## Adding a New Template

1. Create a new folder under `templates/`
2. Add Handlebars templates (`.hbs` files)
3. Register the template in `src/core/constants.ts`
4. Add tests in `__tests__/`
5. Update `README.md` with the new template

---

## Adding a New Command

1. Create a new file under `src/commands/`
2. Register the command in `src/index.ts`
3. Add tests in `__tests__/commands/`

---

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new template "express-api"
fix: handle missing template directory
docs: update README installation instructions
chore: upgrade TypeScript to 5.4
```

---

## Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

---

## Publishing to npm

Publishing is handled automatically by GitHub Actions CI when changes are merged to `main`.

To publish manually (maintainers only):

```bash
npm run build
npm version patch  # or minor / major
npm publish --access public
```

---

## Code Style

- TypeScript strict mode is enforced
- Run `npm run build` before committing
- All new features must include tests
- All tests must pass on CI

---

## Questions?

Open an issue at https://github.com/yiyuanlee/scaffoldr-cli/issues