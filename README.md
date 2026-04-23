# WealthHealth-modal

[![npm](https://img.shields.io/npm/v/WealthHealth-modal?color=blue)](https://www.npmjs.com/package/WealthHealth-modal)
[![license](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-enabled-blue)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-blue)](https://react.dev)
[![accessibility](https://img.shields.io/badge/WCAG-2.1%20AA-green)](https://www.w3.org/WAI/WCAG21/quickref/)

A lightweight React modal component library using native `<dialog>` element. Includes pre-built SignupModal, LoginModal, and ConfirmModal with form validation and accessibility built in.

## Features

- **Native `<dialog>` element** — No custom focus trapping hacks, just the browser API
- **WCAG 2.1 AA accessible** — Proper labels, error messaging, focus management
- **TypeScript-first** — Full type safety out of the box
- **React 18 & 19** — Works with both versions
- **CSS Modules** — Scoped styles, no class name conflicts
- **Pre-built forms** — SignupModal, LoginModal, ConfirmModal ready to use
- **Dark mode & reduced motion** — Respects user preferences

## Install

```bash
npm install WealthHealth-modal
```

## Quick Start

### Basic Modal

```tsx
import { Modal } from 'WealthHealth-modal';
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
import { SignupModal } from 'WealthHealth-modal';
import { useState } from 'react';

export function AuthPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string>();

  const handleSignup = async (data) => {
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

| Prop              | Type                                          | Default     | Description                             |
| ----------------- | --------------------------------------------- | ----------- | --------------------------------------- |
| `isOpen`          | `boolean`                                     | required    | Show/hide modal                         |
| `onClose`         | `() => void`                                  | required    | Called on ESC or backdrop click         |
| `title`           | `string`                                      | required    | Modal title                             |
| `children`        | `ReactNode`                                   | required    | Modal content                           |
| `status`          | `'success' \| 'error' \| 'info' \| 'default'` | `'default'` | Visual state (changes top border color) |
| `size`            | `'sm' \| 'md' \| 'lg'`                        | `'md'`      | Modal width                             |
| `showCloseButton` | `boolean`                                     | `false`     | Show × button                           |
| `closeOnBackdrop` | `boolean`                                     | `true`      | Allow clicking outside to close         |

### SignupModal

Pre-built signup form with email, password, password confirmation.

| Prop        | Type                      | Default   | Description                  |
| ----------- | ------------------------- | --------- | ---------------------------- |
| `isOpen`    | `boolean`                 | required  | Show/hide                    |
| `onClose`   | `() => void`              | required  | Close callback               |
| `onSubmit`  | `(data) => Promise<void>` | required  | Form submission handler      |
| `isLoading` | `boolean`                 | `false`   | Show spinner, disable button |
| `error`     | `string`                  | undefined | Error message at top         |

### LoginModal

Pre-built login form with email and password.

Same props as SignupModal (minus confirmPassword validation).

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

## Styling

Components use CSS Modules for styling. Override with custom classes:

```tsx
import { Modal } from 'WealthHealth-modal';
import styles from './customStyles.module.css';

<Modal isOpen={true} onClose={() => {}} className={styles.custom}>
  Content
</Modal>;
```

Available CSS custom properties:

```css
:root {
  --modal-bg: #ffffff;
  --modal-text: #000000;
  --modal-border-radius: 4px;
  --modal-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  --modal-padding: 24px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --modal-bg: #1e1e1e;
    --modal-text: #ffffff;
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

## License

MIT

---

**GitHub:** https://github.com/Steinshy/OC-WealthHealth-modal
**Demo** https://steinshy.github.io/OC-WealthHealth-modal/
**Original Project Repo** https://github.com/OpenClassrooms-Student-Center/P12_Front-end
