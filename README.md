# hrnet-modal

Modern, accessible modal component library for React with built-in form handling.

## Overview

`hrnet-modal` is a production-ready React component library providing a base `Modal` component for displaying dialogs, plus a pre-configured `SignupModal` example with WCAG 2.1 Level AA form inputs, validation, and error handling.

**Key features:**

- **Native HTML `<dialog>` element** — Uses modern HTMLDialogElement API for automatic focus trapping, ESC key handling, and scroll locking
- **WCAG 2.1 Level AA accessible** — Explicit labels, error messaging with `aria-describedby`, focus management, and color contrast compliance
- **TypeScript-first** — Full type safety with exported interfaces for props and form data
- **Status-aware styling** — Success, error, info, and default states with CSS animations
- **CSS Modules** — Scoped styling, responsive design, dark mode support, and reduced-motion support
- **React 18+ / React 19 compatible** — Works with latest React versions

## Installation

```bash
npm install hrnet-modal
# or
yarn add hrnet-modal
# or
pnpm add hrnet-modal
```

## Quick Start

### Basic Modal

```tsx
import { Modal } from 'hrnet-modal';
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

### Sign-up Modal with Form

```tsx
import { SignupModal } from 'hrnet-modal';
import { useState } from 'react';

export function AuthPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSignup = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Signup failed');
      // Modal auto-closes on success after 2s
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Sign Up</button>
      <SignupModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setError(undefined);
        }}
        onSubmit={handleSignup}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
```

## Components API

### Modal

Base modal component using native HTML `<dialog>` element.

#### Props

| Prop                | Type                                          | Default     | Description                                                             |
| ------------------- | --------------------------------------------- | ----------- | ----------------------------------------------------------------------- |
| `isOpen`            | `boolean`                                     | _required_  | Controls modal visibility                                               |
| `onClose`           | `() => void`                                  | _required_  | Callback when modal closes (ESC key, backdrop click, or explicit close) |
| `title`             | `string`                                      | `undefined` | Optional title displayed at top of modal                                |
| `status`            | `'success' \| 'error' \| 'info' \| 'default'` | `'default'` | Visual state with corresponding border color and styling                |
| `autoCloseDuration` | `number`                                      | `undefined` | Auto-close after N milliseconds (optional)                              |
| `children`          | `React.ReactNode`                             | _required_  | Modal content                                                           |

#### Example

```tsx
<Modal isOpen={true} onClose={handleClose} title="Confirmation" status="info" autoCloseDuration={3000}>
  <p>Please confirm this action.</p>
</Modal>
```

### SignupModal

Pre-configured modal for user registration with form validation and error handling.

#### Props

| Prop        | Type                                      | Default     | Description                                   |
| ----------- | ----------------------------------------- | ----------- | --------------------------------------------- |
| `isOpen`    | `boolean`                                 | _required_  | Controls modal visibility                     |
| `onClose`   | `() => void`                              | _required_  | Callback when modal closes or form succeeds   |
| `onSubmit`  | `(data: SignupFormData) => Promise<void>` | _required_  | Async handler for form submission (e.g. API)  |
| `isLoading` | `boolean`                                 | `false`     | Shows loading spinner, disables submit button |
| `error`     | `string`                                  | `undefined` | Error message displayed at top of form        |

#### Form Data

```typescript
interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}
```

#### Example

```tsx
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string>();

<SignupModal
  isOpen={showSignup}
  onClose={() => setShowSignup(false)}
  onSubmit={async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Signup failed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsLoading(false);
    }
  }}
  isLoading={isLoading}
  error={error}
/>;
```

## Accessibility

`hrnet-modal` implements WCAG 2.1 Level AA accessibility standards:

### Modal Container

- ✅ Uses native HTML `<dialog>` element (not `<div role="dialog">`)
- ✅ Automatic focus trapping while modal is open
- ✅ ESC key closes modal (native behavior)
- ✅ Scroll locking when modal is active (automatic)
- ✅ Screen readers announce modal opening/closing
- ✅ Focus returns to trigger element on close

### Form Inputs (SignupModal)

- ✅ Explicit `<label htmlFor={id}>` on every field (no placeholder-only labels)
- ✅ Error messages linked via `aria-describedby` to associated input
- ✅ Focus management: moves focus to first invalid field on validation error
- ✅ Required field indicators with `required` attribute and visual marker
- ✅ Color contrast: text (4.5:1 AA), error colors (AA standards)
- ✅ Keyboard navigation: logical tab order without overrides
- ✅ No reliance on color alone to convey errors

### Responsive & Inclusive

- ✅ Mobile-optimized input sizing (16px font to prevent iOS zoom)
- ✅ Reduced motion support: animations disabled for users with `prefers-reduced-motion: reduce`
- ✅ High contrast mode: increased font weight and border width for `prefers-contrast: more`
- ✅ Dark mode support: colors adapt to `prefers-color-scheme: dark`

## Styling

Components use **CSS Modules** for scoped styling. To customize appearance, override CSS module classes:

```tsx
import { Modal } from 'hrnet-modal';
import styles from 'hrnet-modal/dist/Modal.module.css';
import customStyles from './customModal.module.css';

<Modal isOpen={true} onClose={() => {}} className={customStyles.modal}>
  Content
</Modal>;
```

Or use CSS custom properties (future enhancement):

```css
:root {
  --modal-bg: #ffffff;
  --modal-border-radius: 8px;
  --modal-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}
```

### Available CSS Classes

**Modal.module.css:**

- `modal` — Main dialog container
- `modal--success` — Success status styling (green left border)
- `modal--error` — Error status styling (red left border)
- `modal--info` — Info status styling (blue left border)

**SignupModal.module.css:**

- `form` — Form container
- `formGroup` — Single form field container
- `label` — Form label (always visible)
- `input` — Form input field
- `inputError` — Input with validation error
- `errorMessage` — Inline error text
- `submitButton` — Submit button
- `spinner` — Loading animation

## Browser Support

| Browser | Version | Support |
| ------- | ------- | ------- |
| Chrome  | 37+     | ✅ Full |
| Firefox | 98+     | ✅ Full |
| Safari  | 15.4+   | ✅ Full |
| Edge    | 79+     | ✅ Full |

Native `<dialog>` element is supported in all modern browsers. For older browser support, consider using a polyfill like `dialog-polyfill`.

## Examples

### Success State with Auto-Close

```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Success" status="success" autoCloseDuration={2000}>
  <p>Your changes have been saved!</p>
</Modal>;
```

### Error State

```tsx
<Modal isOpen={showError} onClose={() => setShowError(false)} title="Error" status="error">
  <p>An error occurred while processing your request. Please try again.</p>
  <button onClick={() => setShowError(false)}>Dismiss</button>
</Modal>
```

### Info State

```tsx
<Modal isOpen={showInfo} onClose={() => setShowInfo(false)} title="Information" status="info">
  <p>This feature requires JavaScript to be enabled.</p>
</Modal>
```

## License

MIT

---

**Repository:** https://github.com/YourUsername/hrnet-modal  
**Issues:** https://github.com/YourUsername/hrnet-modal/issues
