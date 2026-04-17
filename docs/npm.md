# NPM Publishing Guide

Complete guide to creating, configuring, and publishing scoped public packages to npm.

## Package Naming

### Scoped Package Format

Scoped packages are namespaced with `@scope/package-name`:

```json
{
  "name": "@wealthhealth/hrnet-modal"
}
```

**Benefits:**

- Prevents naming conflicts (e.g., `@yourorg/modal` vs generic `modal`)
- Groups related packages under one namespace
- Professional branding for libraries
- Easier to organize on npm

### Naming Guidelines

Follow npm's package naming conventions:

| Rule                 | Example                 | Notes                                             |
| -------------------- | ----------------------- | ------------------------------------------------- |
| **Lowercase only**   | `@scope/my-package` ✅  | `@scope/MyPackage` ❌                             |
| **No special chars** | `@scope/my-package` ✅  | `@scope/my_package` ⚠️ (works but dash preferred) |
| **Descriptive**      | `@scope/react-modal` ✅ | `@scope/x` ❌                                     |
| **No trailing dots** | `my-package` ✅         | `my-package.` ❌                                  |
| **Avoid confusion**  | `@scope/button` ✅      | `@scope/btn` ❌ (unclear)                         |

### Scope Naming

Choose a scope that represents your organization:

```json
{
  "name": "@wealthhealth/hrnet-modal"
}
```

Common patterns:

- `@company/package` — Company/org packages
- `@yourname/package` — Personal packages
- `@team-prefix/package` — Team-specific packages

## Package Configuration

### package.json Setup

```json
{
  "name": "@wealthhealth/hrnet-modal",
  "version": "0.1.0",
  "description": "Accessible React modal component library built with native <dialog>",
  "main": "dist/index.cjs",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "README.md", "LICENSE"],
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "vite build",
    "type-check": "tsc --noEmit",
    "prepublishOnly": "npm run type-check && npm run build"
  },
  "keywords": ["react", "modal", "dialog", "component", "accessible", "a11y"],
  "author": "Your Name",
  "license": "MIT",
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/hrnet-modal.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/hrnet-modal/issues"
  },
  "homepage": "https://github.com/yourusername/hrnet-modal#readme"
}
```

### Key Fields Explained

| Field              | Purpose                                      | Required             |
| ------------------ | -------------------------------------------- | -------------------- |
| `name`             | Package identifier (`@scope/name`)           | ✅                   |
| `version`          | Semantic version (MAJOR.MINOR.PATCH)         | ✅                   |
| `description`      | Short summary for npm search                 | ✅                   |
| `main`             | Entry point for CommonJS (Node.js)           | ✅                   |
| `module`           | Entry point for ES modules                   | ✅                   |
| `types`            | TypeScript declaration file                  | ✅ (for TS packages) |
| `files`            | Whitelist of published files                 | ✅                   |
| `exports`          | Modern module resolution (Node.js 12.20+)    | Recommended          |
| `keywords`         | npm search terms (max 5 recommended)         | ✅                   |
| `peerDependencies` | Required by consumers                        | ✅ (for libraries)   |
| `devDependencies`  | Development-only deps (excluded from bundle) | ✅                   |
| `repository`       | Git repository URL                           | Recommended          |
| `bugs`             | Issue tracker URL                            | Recommended          |
| `license`          | SPDX license (MIT, Apache-2.0, etc.)         | ✅                   |

## Semantic Versioning

Use semantic versioning for releases: `MAJOR.MINOR.PATCH`

```
Version: 1.5.2
         │ │ │
         │ │ └─ PATCH (bug fixes, no API changes)
         │ └─── MINOR (new features, backwards compatible)
         └───── MAJOR (breaking changes)
```

### When to Bump Version

| Scenario        | Bump       | Example                     |
| --------------- | ---------- | --------------------------- |
| Bug fix         | PATCH      | `0.1.0` → `0.1.1`           |
| New feature, BC | MINOR      | `0.1.1` → `0.2.0`           |
| Breaking change | MAJOR      | `0.2.0` → `1.0.0`           |
| Pre-release     | Add suffix | `1.0.0-alpha`, `1.0.0-rc.1` |

### Release Checklist

- [ ] Update `version` in `package.json`
- [ ] Update `CHANGELOG.md` (if maintained)
- [ ] Run `npm run type-check` (passes with 0 errors)
- [ ] Run `npm run build` (succeeds)
- [ ] Test in consumer app (optional but recommended)
- [ ] Create git tag: `git tag v0.2.0`
- [ ] Push: `git push && git push --tags`

## NPM Account Setup

### Create an npm Account

1. Go to [npmjs.com](https://www.npmjs.com/)
2. Click **Sign Up**
3. Confirm email
4. Enable **2FA** (two-factor authentication)

### Login Locally

```bash
npm login
```

Prompts for:

- Username
- Password
- Email address
- 2FA code (if enabled)

**Verify login:**

```bash
npm whoami
```

### Configure .npmrc (Optional)

Store auth token in `~/.npmrc`:

```bash
//registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE
```

Get token from npm dashboard → **Access Tokens** → Create token.

## Publishing to npm

### Before Publishing

Ensure the package is ready:

```bash
# Type check
npm run type-check

# Build
npm run build

# Verify build output
ls -la dist/
```

The `prepublishOnly` script runs automatically before `npm publish`:

```json
"prepublishOnly": "npm run type-check && npm run build"
```

### Publish Package

```bash
npm publish
```

**For scoped public packages**, use `--access public`:

```bash
npm publish --access public
```

This grants public access to your scoped package (default is private).

### Verify Publication

```bash
npm view @wealthhealth/hrnet-modal
```

Check on [npmjs.com](https://www.npmjs.com/package/@wealthhealth/hrnet-modal)

### Update Published Package

Bump version, then publish again:

```bash
# Edit version in package.json
npm publish
```

## Distribution Tags (dist-tags)

Tag releases with semantic labels:

```bash
# Tag as "latest" (default)
npm publish

# Tag as prerelease
npm publish --tag beta
npm publish --tag rc

# Add/move tags to existing versions
npm dist-tag add @wealthhealth/hrnet-modal@0.1.0 rc
npm dist-tag add @wealthhealth/hrnet-modal@0.2.0 latest

# View all tags
npm dist-tag ls @wealthhealth/hrnet-modal
```

### Tag Examples

| Tag      | Use Case             | Install Command                   |
| -------- | -------------------- | --------------------------------- |
| `latest` | Stable release       | `npm install @scope/package`      |
| `beta`   | Testing new features | `npm install @scope/package@beta` |
| `rc`     | Release candidate    | `npm install @scope/package@rc`   |
| `next`   | Major WIP version    | `npm install @scope/package@next` |

## Consuming the Package

### Install from npm

```bash
npm install @wealthhealth/hrnet-modal
```

### Import Components

```tsx
import { Modal, SignupModal, LoginModal } from '@wealthhealth/hrnet-modal';

export function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Hello">
      <p>Modal content</p>
    </Modal>
  );
}
```

### TypeScript Support

Types are auto-discovered from `package.json` → `types` field:

```json
"types": "dist/index.d.ts"
```

IDE provides full autocomplete and type checking.

## CI/CD Automation

### GitHub Actions: Publish on Release

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          registry-url: https://registry.npmjs.org/

      - run: npm ci
      - run: npm run type-check
      - run: npm run build

      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Setup NPM_TOKEN Secret

1. Go to npm dashboard → **Access Tokens**
2. Create **Automation** token
3. In GitHub repo: **Settings** → **Secrets** → **New secret**
4. Name: `NPM_TOKEN`, Value: your token

## Troubleshooting

### "You do not have permission to publish this package"

**Cause:** Scoped package defaults to private.

**Fix:**

```bash
npm publish --access public
```

### "Package name already exists"

**Cause:** Package with that name already published.

**Fix:** Choose a different name or scope:

```json
{
  "name": "@yourscope/package-name"
}
```

### "403 Forbidden" during publish

**Causes:**

- Not logged in: `npm login`
- Invalid credentials: `npm logout` then `npm login`
- No 2FA code provided when prompted
- Insufficient permissions (not owner)

### "dist/ directory not found"

**Fix:** Build before publishing:

```bash
npm run build
npm publish
```

## Resources

- **[npm Package Documentation](https://docs.npmjs.com/)**
- **[Scoped Packages Guide](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)**
- **[package.json Guide](https://docs.npmjs.com/creating-a-package-json-file)**
- **[Semantic Versioning](https://semver.org/)**
- **[npm Security Best Practices](https://docs.npmjs.com/about-npm/security-best-practices)**
