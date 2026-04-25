# Architecture — wealthhealth-modal

**Language:** English · [Français](./ARCHITECTURE.fr.md) — **README:** [English](./README.md) · [Français](./README.fr.md)

## Overview

`@steinshy/wealthhealth-modal` is a lightweight, accessible React modal component library built with Vite. It was created as a React replacement for the jQuery dialog plugin used in the original HRNet project. The library ships as a dual-format package (ESM + CJS) with full TypeScript types.

**Stack:** React 18/19 · TypeScript 6 · Vite 8 · CSS Modules · Storybook 10 (`@storybook/react-vite`)

**npm:** `@steinshy/wealthhealth-modal`  
**Demo:** https://steinshy.github.io/OC-WealthHealth-modal/  
**Storybook (hosted with the demo):** https://steinshy.github.io/OC-WealthHealth-modal/storybook/

---

## Repository layout

```
.
├── src/
│   ├── index.ts                 # Public API — re-exports components, hook, types
│   ├── types/index.ts           # ModalProps, SignupModalProps, …
│   ├── hooks/useTheme.ts        # Theme hook (data-theme + localStorage)
│   ├── demo/                    # Vite demo app (not published in the npm package)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── demo.css
│   │   └── demo.module.css
│   └── components/
│       ├── index.ts
│       ├── Modal.tsx / Modal.module.css / Modal.stories.tsx
│       ├── SignupModal.tsx / …module.css / …stories.tsx
│       ├── LoginModal.tsx / …module.css / …stories.tsx
│       ├── ConfirmModal.tsx / …module.css / …stories.tsx
│       └── form/                # Shared form primitives
│           ├── FormField.tsx
│           ├── PasswordField.tsx
│           ├── ErrorBanner.tsx
│           ├── SuccessMessage.tsx
│           └── index.ts
├── .storybook/                  # Storybook config (React + Vite, a11y addon)
├── vite.config.ts               # Library build → dist/
├── vite.demo.config.ts          # Demo SPA → dist-demo/ (+ publicDir for demo assets)
├── index.html                   # Dev entry for the demo (root)
├── public/                      # Default Vite public dir (dev)
└── .github/workflows/           # CI, Pages, publish
```

Library `dts` generation excludes `src/demo/**` so demo-only code never ships in type definitions.

---

## Public API

Everything consumed by users is exported from `src/index.ts`:

### Components

| Export           | Description                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| `Modal`          | Base modal — native `<dialog>`, configurable status, size, footer, icon, dismiss rules |
| `SignupModal`    | Email + password + confirm; client validation; loading and error UX                    |
| `LoginModal`     | Email + password; same UX patterns as signup                                           |
| `ConfirmModal`   | Confirm / cancel with optional async confirm + loading                                 |
| `FormField`      | Label + input + error (for custom forms inside `Modal`)                                |
| `PasswordField`  | `FormField` + visibility toggle                                                        |
| `ErrorBanner`    | Form-level error region                                                                |
| `SuccessMessage` | Post-submit success region                                                             |

### Hook

| Export     | Description                                                                                                    |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| `useTheme` | Sets `data-theme` on `<html>`, persists under `localStorage` key `wh-theme`, syncs with `prefers-color-scheme` |

### Types

| Export                                                                            | Description          |
| --------------------------------------------------------------------------------- | -------------------- |
| `ModalProps`, `SignupModalProps`, `LoginModalProps`, `ConfirmModalProps`          | Component props      |
| `SignupFormData`, `LoginFormData`                                                 | Submit payloads      |
| `FormFieldProps`, `PasswordFieldProps`, `ErrorBannerProps`, `SuccessMessageProps` | Form primitive props |
| `Theme`, `UseThemeReturn`                                                         | Theme hook types     |

---

## Component design

### Modal (base)

Uses the native HTML `<dialog>` element — no custom focus trap library, no portals for the dialog surface itself. The browser provides top-layer behavior and focus handling when `showModal()` is used.

**Typical flow:**

- `isOpen === true` → `dialogRef.current.showModal()`
- `isOpen === false` → `dialogRef.current.close()`
- Close paths (ESC, backdrop when enabled, close button) converge on a single `onClose` notification per close
- `dismissible={false}` disables user-driven dismiss paths as implemented in the component
- `autoCloseDuration` uses a timer with cleanup on unmount or when duration changes

**Styling:** `status` and `size` map to CSS Module modifier classes on the `<dialog>`.

### Pre-built modals

`SignupModal`, `LoginModal`, and `ConfirmModal` compose `Modal` and own local UI state (values, validation, loading, success). Validation is oriented around submit. Successful flows can show an in-modal success state before calling `onClose`.

### Form primitives (`form/`)

Reused inside pre-built modals and exported for consumers building custom layouts inside `Modal`.

---

## Styling

Components use **CSS Modules**. Consumers can pass `className` on `Modal` and override **CSS custom properties** where the modules declare them (see `Modal.module.css` for the canonical list, including status border/title colors).

Dark appearance is driven by:

- `data-theme="dark"` on `<html>` (written by `useTheme`), and/or
- `@media (prefers-color-scheme: dark)` rules inside the modules

`prefers-reduced-motion` is respected for animations.

---

## Builds

### Library (`npm run build`, `vite.config.ts`)

| Output           | Role                                        |
| ---------------- | ------------------------------------------- |
| `dist/index.js`  | ESM entry                                   |
| `dist/index.cjs` | CommonJS entry                              |
| `dist/**/*.d.ts` | TypeScript declarations (`vite-plugin-dts`) |

Rollup `external`: `react`, `react-dom`, `react/jsx-runtime`. CSS is injected at runtime in the bundle via `vite-plugin-css-injected-by-js` so consumers do not import separate CSS files.

`package.json` `exports` points `"."` to types + ESM + CJS. `"sideEffects": ["**/*.css"]` ensures bundlers retain CSS-related side effects where applicable.

### Demo + GitHub Pages (`npm run build:demo`)

1. **Vite** (`vite.demo.config.ts`) builds the demo SPA into **`dist-demo/`** with `base` from `VITE_BASE_PATH` (e.g. `/OC-WealthHealth-modal/` in CI).
2. **Storybook** runs `storybook build -o dist-demo/storybook` so the static Storybook site lives beside the demo at **`/…/storybook/`** on Pages.

`vite.demo.config.ts` sets `publicDir` to `demo-public/` (repo-root folder for extra static files copied into the demo build when present).

**Local preview:** `npm run preview` runs `build:demo` then `vite preview` with the demo config.

**Storybook alone:** `npm run storybook` (dev) or `npm run build:storybook` (default output directory `storybook-static/`, gitignored).

---

## Development commands

| Command                           | Purpose                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`                     | Demo Vite server (port **5173**) and Storybook (**6006**) via `concurrently` |
| `npm run dev:demo`                | Demo only (`vite`)                                                           |
| `npm run storybook`               | Storybook dev server only                                                    |
| `npm run build`                   | Library → `dist/`                                                            |
| `npm run build:demo`              | Demo → `dist-demo/` + Storybook → `dist-demo/storybook/`                     |
| `npm run build:storybook`         | Static Storybook build (default out dir `storybook-static/`)                 |
| `npm run preview`                 | Production-like demo after `build:demo`                                      |
| `npm run type-check`              | `tsc --noEmit`                                                               |
| `npm run lint` / `lint:fix`       | ESLint                                                                       |
| `npm run lint:styles`             | Stylelint on `src/**/*.css`                                                  |
| `npm run format` / `format:check` | Prettier                                                                     |

---

## CI/CD (`.github/workflows/`)

| Workflow         | Trigger                          | What it does                                                                                                                                                                       |
| ---------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml`         | Push and pull request            | `format:check`, ESLint, Stylelint, `type-check`, `build:demo` with `VITE_BASE_PATH` set to `/${{ github.event.repository.name }}/`, then verifies `dist-demo/storybook/index.html` |
| `build-demo.yml` | Push to **`main`** and **`dev`** | `build:demo` with the same base path, verifies Storybook output, uploads **`dist-demo`** as the GitHub Pages artifact, deploy job publishes Pages                                  |
| `publish.yml`    | GitHub **Release** created       | Ensures the release commit is on `main`, runs `prepublishOnly`, `npm publish`                                                                                                      |

Publishing requires `NPM_TOKEN` in repository secrets.

---

## Storybook

- **Framework:** `@storybook/react-vite` with stories under `src/**/*.stories.tsx`.
- **Addon:** `@storybook/addon-a11y`.
- **`viteFinal`:** merges `base: './'` so asset URLs work when hosted under a subpath (e.g. `/repo/storybook/`). Chunk size warning limit is raised for the large preview bundle.

---

## Accessibility

The library targets **WCAG 2.1 AA**-oriented patterns:

- Native `<dialog>` semantics and keyboard-dismissible patterns where enabled
- Form labels, descriptions, and error text wired for assistive tech
- Visible focus styles (`:focus-visible`)
- Color contrast and non-color cues for states
- `prefers-reduced-motion` and theme preferences respected in CSS

Automated a11y feedback is available in Storybook via the accessibility addon; manual screen reader and keyboard testing remain important for releases.
