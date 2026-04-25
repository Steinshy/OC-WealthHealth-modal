<h1 align="center">WealthHealth-modal</h1>

[![npm version](https://img.shields.io/npm/v/%40steinshy%2Fwealthhealth-modal?logo=npm)](https://www.npmjs.com/package/@steinshy/wealthhealth-modal)
[![npm downloads](https://img.shields.io/npm/dm/%40steinshy%2Fwealthhealth-modal?logo=npm&color=blue)](https://www.npmjs.com/package/@steinshy/wealthhealth-modal)
[![license](https://img.shields.io/npm/l/%40steinshy%2Fwealthhealth-modal)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA-brightgreen)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)
[![Storybook](https://img.shields.io/badge/Storybook-10-FF4785?logo=storybook)](https://storybook.js.org)
[![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint)](https://eslint.org)
[![Prettier](https://img.shields.io/badge/Prettier-3-F7B93E?logo=prettier&logoColor=000)](https://prettier.io)
[![Stylelint](https://img.shields.io/badge/Stylelint-17-000?logo=stylelint)](https://stylelint.io)

<div align="center">
  <img src="public/mockup/mockup.png" alt="WealthHealth-modal demo — responsive mockup" />
</div>

A lightweight React modal component library using native `<dialog>` element. Includes pre-built SignupModal, LoginModal, and ConfirmModal with form validation and accessibility built in.

## Live demo and Storybook

| Resource       | URL / link                                                  |
| -------------- | ----------------------------------------------------------- |
| Language       | English · [Français](./README.fr.md)                        |
| Architecture   | [ARCHITECTURE.md](./ARCHITECTURE.md)                        |
| ArchitectureFr | [ARCHITECTURE.fr.md](./ARCHITECTURE.fr.md)                  |
| GitHub         | https://github.com/Steinshy/OC-WealthHealth-modal           |
| Demo app       | https://steinshy.github.io/OC-WealthHealth-modal/           |
| Storybook      | https://steinshy.github.io/OC-WealthHealth-modal/storybook/ |

On GitHub Pages, the demo and Storybook are produced in one CI step: the demo is at the site root and Storybook is deployed under `storybook/`.

## Features

- **Native `<dialog>` element** — No custom focus trapping hacks, just the browser API
- **WCAG 2.1 AA accessible** — Proper labels, error messaging, focus management
- **TypeScript-first** — Full type safety out of the box
- **React 18 & 19** — Works with both versions
- **CSS Modules** — Scoped styles, no class name conflicts
- **Pre-built forms** — SignupModal, LoginModal, ConfirmModal ready to use
- **Dark mode & reduced motion** — Respects user preferences
- **`useTheme` hook** — Built-in light/dark toggle with localStorage persistence

## Prerequisites

- **Node.js** 18 or newer (repository CI uses Node 22)
- **React** 18 or 19

## Install

```bash
npm install @steinshy/wealthhealth-modal
```

## Quick Start

### Basic Modal

```tsx
import { Modal } from '@steinshy/wealthhealth-modal';
import { useState } from 'react';

export function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Welcome" status="success">
        <p>Operation completed successfully!</p>
      </Modal>
    </>
  );
}
```

### Signup Form

```tsx
import { SignupModal, type SignupFormData } from '@steinshy/wealthhealth-modal';
import { useState } from 'react';

export function AuthPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string>();

  const handleSignup = async (data: SignupFormData) => {
    try {
      await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      // Modal auto-closes on success
    } catch (err) {
      setError('Signup failed');
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Sign Up</button>
      <SignupModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={handleSignup} error={error} />
    </>
  );
}
```

## Components

### Modal

Base modal component. Use for custom content.

| Prop                | Type                                                       | Default     | Description                                             |
| ------------------- | ---------------------------------------------------------- | ----------- | ------------------------------------------------------- |
| `isOpen`            | `boolean`                                                  | required    | Show/hide modal                                         |
| `onClose`           | `() => void`                                               | required    | Called once when the dialog closes                      |
| `title`             | `string`                                                   | optional    | Modal title (header omitted if unset)                   |
| `children`          | `ReactNode`                                                | required    | Modal content                                           |
| `status`            | `'success' \| 'error' \| 'info' \| 'warning' \| 'default'` | `'default'` | Visual state (top border color)                         |
| `size`              | `'sm' \| 'md' \| 'lg'`                                     | `'md'`      | Modal width                                             |
| `autoCloseDuration` | `number`                                                   | optional    | Close automatically after N milliseconds                |
| `showCloseButton`   | `boolean`                                                  | `true`      | Show × button (when `title` and `dismissible` allow it) |
| `dismissible`       | `boolean`                                                  | `true`      | Allow ESC, backdrop (if enabled), and close button      |
| `closeOnBackdrop`   | `boolean`                                                  | `true`      | Allow clicking outside to close                         |
| `icon`              | `ReactNode`                                                | optional    | Optional icon in the header                             |
| `footer`            | `ReactNode`                                                | optional    | Optional footer below content                           |
| `className`         | `string`                                                   | optional    | Extra class on `<dialog>`                               |

### SignupModal

Pre-built signup form with email, password, password confirmation.

| Prop            | Type                                      | Default  | Description                                     |
| --------------- | ----------------------------------------- | -------- | ----------------------------------------------- |
| `isOpen`        | `boolean`                                 | required | Show/hide                                       |
| `onClose`       | `() => void`                              | required | Close callback                                  |
| `onSubmit`      | `(data: SignupFormData) => Promise<void>` | required | Async submit; throw on failure                  |
| `isLoading`     | `boolean`                                 | `false`  | Spinner and disabled submit                     |
| `error`         | `string`                                  | optional | Error banner at top                             |
| `initialData`   | `SignupFormData`                          | optional | Pre-filled fields                               |
| `showSuccess`   | `boolean`                                 | optional | Show success UI without submitting (e.g. demos) |
| `initialErrors` | `Record<string, string>`                  | optional | Field-level errors on open                      |

### LoginModal

Pre-built login form with email and password.

| Prop            | Type                                     | Default  | Description                        |
| --------------- | ---------------------------------------- | -------- | ---------------------------------- |
| `isOpen`        | `boolean`                                | required | Show/hide                          |
| `onClose`       | `() => void`                             | required | Close callback                     |
| `onSubmit`      | `(data: LoginFormData) => Promise<void>` | required | Async submit; throw on failure     |
| `isLoading`     | `boolean`                                | `false`  | Spinner and disabled submit        |
| `error`         | `string`                                 | optional | Error banner at top                |
| `initialData`   | `LoginFormData`                          | optional | Pre-filled fields                  |
| `showSuccess`   | `boolean`                                | optional | Show success UI without submitting |
| `initialErrors` | `Record<string, string>`                 | optional | Field-level errors on open         |

### ConfirmModal

Simple yes/no confirmation dialog.

| Prop           | Type                                                       | Default     | Description                               |
| -------------- | ---------------------------------------------------------- | ----------- | ----------------------------------------- |
| `isOpen`       | `boolean`                                                  | required    | Show/hide                                 |
| `onClose`      | `() => void`                                               | required    | Close callback                            |
| `onConfirm`    | `() => void \| Promise<void>`                              | required    | Confirm handler — modal closes on resolve |
| `title`        | `string`                                                   | required    | Dialog title                              |
| `children`     | `ReactNode`                                                | required    | Dialog content                            |
| `confirmLabel` | `string`                                                   | `'Confirm'` | Confirm button text                       |
| `cancelLabel`  | `string`                                                   | `'Cancel'`  | Cancel button text                        |
| `isLoading`    | `boolean`                                                  | `false`     | Show spinner, disable buttons             |
| `status`       | `'success' \| 'error' \| 'info' \| 'warning' \| 'default'` | `'default'` | Visual state                              |

## Theme

### `useTheme()`

A hook that manages light/dark mode. It sets `data-theme` on `<html>`, persists the choice under the `localStorage` key **`wh-theme`**, and defaults to the OS `prefers-color-scheme` on first visit.

```tsx
import { useTheme } from '@steinshy/wealthhealth-modal';

export function App() {
  const { theme, toggleTheme, setTheme, isDark } = useTheme();

  return (
    <>
      <button onClick={toggleTheme}>{isDark ? '☀ Light mode' : '☾ Dark mode'}</button>
      {/* All modals respond automatically */}
    </>
  );
}
```

| Return value  | Type                 | Description                     |
| ------------- | -------------------- | ------------------------------- |
| `theme`       | `'light' \| 'dark'`  | Current active theme            |
| `isDark`      | `boolean`            | `true` when dark mode is active |
| `toggleTheme` | `() => void`         | Toggle between light and dark   |
| `setTheme`    | `(t: Theme) => void` | Set a specific theme            |

Exported types: `Theme`, `UseThemeReturn` (see package exports).

The hook writes `data-theme="light"` or `data-theme="dark"` to the `<html>` element. All library components pick this up automatically — no ThemeProvider or prop drilling required.

> **SSR note:** `useTheme` reads `localStorage` and `window.matchMedia` on mount, so it is safe to render server-side (it defaults to `'light'` on the server).

## Styling

Components use CSS Modules for styling. Override with custom classes:

```tsx
import { Modal } from '@steinshy/wealthhealth-modal';
import styles from './customStyles.module.css';

<Modal isOpen={true} onClose={() => {}} className={styles.custom}>
  Content
</Modal>;
```

Available CSS custom properties:

```css
:root {
  --modal-bg: #ffffff;
  --modal-text: rgba(0, 0, 0, 0.87);
  --modal-text-light: rgba(0, 0, 0, 0.6);
  --modal-border-radius: 4px;
  --modal-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
  --modal-border-color-success: #4caf50;
  --modal-border-color-error: #f44336;
  --modal-border-color-info: #2196f3;
  --modal-border-color-warning: #ff9800;
  --modal-title-color-success: #2e7d32;
  --modal-title-color-error: #c62828;
  --modal-title-color-info: #1565c0;
  --modal-title-color-warning: #e65100;
}
```

Override dark mode values via `data-theme` (set by `useTheme`) or the media query:

```css
/* via useTheme() hook */
[data-theme='dark'] {
  --modal-bg: #424242;
  --modal-text: rgba(255, 255, 255, 0.87);
}

/* or via OS preference */
@media (prefers-color-scheme: dark) {
  :root {
    --modal-bg: #424242;
    --modal-text: rgba(255, 255, 255, 0.87);
  }
}
```

## Accessibility

- Native `<dialog>` element (proper semantics)
- Automatic focus trapping
- ESC key closes modal
- Explicit labels on all form inputs
- Error messages linked to inputs via `aria-describedby`
- Focus management (moves to first error field)
- Color contrast 4.5:1 (AA standard)
- Respects `prefers-reduced-motion` and `prefers-color-scheme`
- 16px minimum font size on inputs (prevents iOS zoom)

## Browser Support

| Browser | Version |
| ------- | ------- |
| Chrome  | 37+     |
| Firefox | 98+     |
| Safari  | 15.4+   |
| Edge    | 79+     |

## Developing this repository

| Command              | Description                                                                    |
| -------------------- | ------------------------------------------------------------------------------ |
| `npm run dev`        | Demo (http://localhost:5173) and Storybook (http://localhost:6006) together    |
| `npm run dev:demo`   | Demo only                                                                      |
| `npm run storybook`  | Storybook only                                                                 |
| `npm run build`      | Library build to `dist/`                                                       |
| `npm run build:demo` | Demo + Storybook static output into `dist-demo/` (same layout as GitHub Pages) |
| `npm run preview`    | Serve `dist-demo` locally after `build:demo`                                   |

CI runs formatting, ESLint, Stylelint, type-check, and `build:demo` with the GitHub Pages base path, then checks that `dist-demo/storybook/index.html` exists.

For a deeper view of folders, builds, and workflows, see [ARCHITECTURE.md](./ARCHITECTURE.md) or the [French architecture doc](./ARCHITECTURE.fr.md).

## License

MIT

---

**GitHub:** https://github.com/Steinshy/OC-WealthHealth-modal

**Original OpenClassrooms project** https://github.com/OpenClassrooms-Student-Center/P12_Front-end
