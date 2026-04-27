# create-morphix

> An extensible TypeScript CLI scaffold generator with plugin system and interactive wizard

```bash
npm create morphix@latest my-api-project -- --template api
```

```
› Scaffolding project my-api-project...

  ✓ Created src/index.ts
  ✓ Created package.json
  ✓ Created tsconfig.json

✅ Project "my-api-project" created successfully!

Next steps:
  › cd my-api-project
  › npm install
  › npm run dev
```

---

## Features

- 🔌 **Extensible Plugin System** — extend the CLI with your own npm packages
- 🎨 **Interactive Wizard** — not just flags, full interactive prompts
- 📦 **Multiple Templates** — API server, npm library, frontend component library
- 🎯 **Smart Defaults** — works out of the box, fully configurable

## Installation

### Local development

```bash
git clone https://github.com/yiyuanlee/morphix-cli.git
cd morphix-cli
npm install
npm run build
node dist/index.js init my-project
```

### As a global CLI

```bash
npm install -g create-morphix
morphix init my-project
```

---

## Usage

### `morphix init`

Generate a new project from a template.

```bash
# Interactive mode (recommended)
morphix init my-project

# With explicit template
morphix init my-project --template api

# Fully non-interactive
morphix init my-project --yes --template component
```

**Available templates:**

| Template | Description |
|----------|-------------|
| `api` | Node.js + Express REST API with TypeScript |
| `library` | TypeScript npm library with Jest testing |
| `component` | Frontend component library with Storybook |

### `morphix add`

Add a plugin to your project.

```bash
morphix add eslint    # Add ESLint configuration
morphix add jest     # Add Jest testing framework
morphix add prettier  # Add Prettier code formatter
morphix add husky     # Add Git hooks with Husky
morphix add lint-staged # Add pre-commit lint staging
```

### `morphix list`

Show all available templates and plugins.

```bash
morphix list
```

---

## Architecture

```
morphix-cli/
├── src/
│   ├── index.ts              # CLI entry point (commander.js)
│   ├── commands/
│   │   ├── init.ts           # morphix init command
│   │   └── add.ts            # morphix add command
│   └── core/
│       ├── logger.ts         # Styled terminal output
│       ├── template.ts      # Handlebars template rendering
│       ├── plugins.ts       # Plugin discovery & loading
│       └── constants.ts     # Shared constants (e.g. template dir)
├── templates/
│   ├── api/                 # Express + TypeScript API template
│   ├── library/             # TypeScript npm library template
│   └── component/           # Frontend component library template
└── package.json
```

### Plugin Protocol

A morphix plugin is any npm package that exports:

```typescript
interface Plugin {
  name: string;
  version: string;
  install(ctx: PluginContext): Promise<void>;
  uninstall?(ctx: PluginContext): Promise<void>;
}

interface PluginContext {
  projectDir: string;
  projectName: string;
}
```

Plugins are discovered from `node_modules/` and loaded via `require()` at runtime.

---

## Roadmap

- [ ] `morphix add <plugin>` — plugin installation with npm
- [ ] `morphix remove <plugin>` — uninstall and rollback
- [ ] Remote templates via GitHub URL
- [ ] Template editor: `morphix template init`
- [ ] `morphix update` — self-update the CLI
- [ ] Publish to npm as `create-morphix`
- [ ] Interactive wizard in non-TTY environments (fallback to prompts)

---

## License

MIT © Yiyuan Li
