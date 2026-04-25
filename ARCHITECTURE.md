# Architecture — wealthhealth-modal

## Overview

`@steinshy/wealthhealth-modal` is a lightweight, accessible React modal component library built with Vite. It was created as a React replacement for the jQuery dialog plugin used in the original HRNet project. The library ships as a dual-format package (ESM + CJS) with full TypeScript types.

**Stack:** React 18/19 · TypeScript 6 · Vite 8 · CSS Modules · Storybook 10

**npm:** `@steinshy/wealthhealth-modal`
**Demo:** https://steinshy.github.io/OC-WealthHealth-modal/

---

## Package Structure

```
src/
├── index.ts                    # Public API — all exports
├── types/
│   └── index.ts                # All TypeScript interfaces (ModalProps, SignupModalProps, …)
│
└── components/
    ├── index.ts                # Re-exports all components
    │
    ├── Modal.tsx               # Base modal (native <dialog>)
    ├── Modal.module.css
    ├── Modal.stories.tsx
    │
    ├── SignupModal.tsx         # Pre-built signup form
    ├── SignupModal.module.css
    ├── SignupModal.stories.tsx
    │
    ├── LoginModal.tsx          # Pre-built login form
    ├── LoginModal.module.css
    ├── LoginModal.stories.tsx
    │
    ├── ConfirmModal.tsx        # Pre-built yes/no confirmation
    ├── ConfirmModal.module.css
    ├── ConfirmModal.stories.tsx
    │
    └── form/                   # Shared form primitives (used inside pre-built modals)
        ├── FormField.tsx       # Label + input + error message
        ├── PasswordField.tsx   # FormField variant with show/hide toggle
        ├── ErrorBanner.tsx     # Top-of-form error block
        └── SuccessMessage.tsx  # Post-submit success block
```

---

## Public API

Everything consumed by users is exported from `src/index.ts`:

**Components**

| Export           | Type      | Description                                                                                                |
| ---------------- | --------- | ---------------------------------------------------------------------------------------------------------- |
| `Modal`          | Component | Base modal — renders any children inside a native `<dialog>`                                               |
| `SignupModal`    | Component | Modal with email + password + confirm password form                                                        |
| `LoginModal`     | Component | Modal with email + password form                                                                           |
| `ConfirmModal`   | Component | Modal with confirm / cancel buttons                                                                        |
| `FormField`      | Component | Accessible label + input + error (re-exported for consumers who want to build custom forms inside `Modal`) |
| `PasswordField`  | Component | FormField with show/hide password toggle                                                                   |
| `ErrorBanner`    | Component | Styled error block                                                                                         |
| `SuccessMessage` | Component | Styled success block                                                                                       |

**Types**

| Export                                                                            | Description                             |
| --------------------------------------------------------------------------------- | --------------------------------------- |
| `ModalProps`                                                                      | Props for `<Modal>`                     |
| `SignupModalProps` / `SignupFormData`                                             | Props and form data for `<SignupModal>` |
| `LoginModalProps` / `LoginFormData`                                               | Props and form data for `<LoginModal>`  |
| `ConfirmModalProps`                                                               | Props for `<ConfirmModal>`              |
| `FormFieldProps`, `PasswordFieldProps`, `ErrorBannerProps`, `SuccessMessageProps` | Props for the form primitives           |

---

## Component Design

### Modal (base)

The foundation of the library. Uses the native HTML `<dialog>` element — no custom focus trap, no portals, no z-index management. The browser handles all of that.

**Key behaviours:**

- `isOpen=true` → calls `dialogRef.current.showModal()` (top-layer, native focus trap)
- `isOpen=false` → calls `dialogRef.current.close()`
- ESC key → browser fires the `close` event → `onClose()` is called once
- Backdrop click → detected via `e.target === dialogRef.current` → calls `.close()`
- `autoCloseDuration` → `setTimeout` clears on cleanup via `useEffect` return
- `dismissible=false` → disables all close paths (ESC, backdrop, close button)

**Prop-driven styling:** `status` and `size` are mapped to CSS Module class variants (`modal--success`, `modal--lg`, etc.) on the `<dialog>` element itself.

### Pre-built modals (SignupModal, LoginModal, ConfirmModal)

Each wraps `<Modal>` and adds its own form logic:

- Local state for field values, validation errors, loading, and success
- Validation runs on submit (not on change) to avoid premature errors
- On submit success: transitions to a success view inside the modal, then calls `onClose`
- `isLoading` prop disables the submit button and shows a spinner
- `error` prop (external) renders an `<ErrorBanner>` at the top

### Form primitives (`form/`)

Shared atoms used inside the pre-built modals. They are also exported for consumers who want to build a custom form inside `<Modal>`.

| Component        | Renders                                           |
| ---------------- | ------------------------------------------------- |
| `FormField`      | `<label>` + `<input>` + optional `<span>` error   |
| `PasswordField`  | `FormField` + show/hide `<button>`                |
| `ErrorBanner`    | Styled `<div role="alert">` for form-level errors |
| `SuccessMessage` | Styled success confirmation block                 |

---

## Styling

All components use **CSS Modules** — class names are scoped and cannot leak. No global class names are applied to the DOM.

**CSS custom properties** on `:root` allow consumers to theme the modal without overriding module classes:

```css
--modal-bg
--modal-text
--modal-border-radius
--modal-shadow
--modal-padding
```

Dark mode and `prefers-reduced-motion` are handled via `@media` queries inside the module files.

---

## Build

Two output formats are produced by `vite build` (configured in `vite.config.ts`):

| File                  | Format           | Used by                          |
| --------------------- | ---------------- | -------------------------------- |
| `dist/index.js`       | ESM              | Bundlers (Vite, webpack, Rollup) |
| `dist/index.cjs`      | CJS              | Node / Jest / older toolchains   |
| `dist/src/index.d.ts` | TypeScript types | IDEs and type checkers           |

The `package.json` `exports` map routes each consumer correctly:

```json
{
  "types": "./dist/src/index.d.ts",
  "import": "./dist/index.js",
  "require": "./dist/index.cjs"
}
```

CSS is declared as a side effect (`"sideEffects": ["**/*.css"]`) so bundlers do not tree-shake the styles.

`react` and `react-dom` are `peerDependencies` — they are not bundled; the consumer provides them.

---

## Development Workflows

| Command               | Purpose                                           |
| --------------------- | ------------------------------------------------- |
| `npm run dev`         | Vite dev server with the demo app (`src/demo/`)   |
| `npm run storybook`   | Storybook with all component stories + a11y addon |
| `npm run build`       | Build the library to `dist/`                      |
| `npm run build:demo`  | Build the static demo for GitHub Pages            |
| `npm run type-check`  | TypeScript strict check                           |
| `npm run lint`        | ESLint                                            |
| `npm run lint:styles` | Stylelint                                         |

### CI/CD (`.github/workflows/`)

| Workflow         | Trigger      | Action                              |
| ---------------- | ------------ | ----------------------------------- |
| `ci.yml`         | push / PR    | type-check, lint, build             |
| `build-demo.yml` | push to main | build + deploy demo to GitHub Pages |
| `publish.yml`    | release tag  | `npm publish` to npm registry       |

---

## Accessibility

The library targets **WCAG 2.1 AA**:
