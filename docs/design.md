# Atomic Design Methodology

Guide to structuring components using Atomic Design principles, as applied to this modal component library.

## Overview

**Atomic Design** is a methodology for creating design systems by breaking UI into fundamental building blocks, then combining them into increasingly complex components.

The five levels are:

1. **Atoms** — Basic, indivisible elements
2. **Molecules** — Groups of atoms bonded together
3. **Organisms** — Complex UI sections composed of molecules
4. **Templates** — Page-level layouts without content
5. **Pages** — Fully rendered pages with real data

## The Five Levels

### 1. Atoms

**Smallest building blocks.** Cannot be broken down further without losing functionality.

**Examples:**

- Buttons
- Input fields
- Labels
- Icons
- Text
- Spacers

**In this library:**

- The `<button>` element inside Modal
- Form inputs in SignupModal, LoginModal
- Text labels

**Characteristics:**

- No dependencies on other components
- Single responsibility
- Highly reusable
- Stateless or minimal state

**Code Example:**

```tsx
// Button atom
export const Button = ({ children, onClick, disabled }: ButtonProps) => (
  <button onClick={onClick} disabled={disabled} className={styles.button}>
    {children}
  </button>
);
```

### 2. Molecules

**Simple groups of atoms bonded together.** Serve a single purpose but are more complex than atoms.

**Examples:**

- Form group (label + input + error message)
- Search bar (input + button)
- Card (image + title + description)
- Password field (input + visibility toggle)

**In this library:**

- **Form field molecule:** `<label>` + `<input>` + error message (in SignupModal)
- **Password input molecule:** `<input>` + show/hide toggle button
- **Button group molecule:** Multiple buttons with layout

**Characteristics:**

- Composed of atoms
- Do one thing well
- Reusable across the app
- Minimal logic

**Code Example:**

```tsx
// Form field molecule
interface FormFieldProps {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}

export const FormField = ({ label, value, error, onChange, type = 'text', required }: FormFieldProps) => (
  <div className={styles.field}>
    <label htmlFor={label}>
      {label}
      {required && <span className={styles.required}>*</span>}
    </label>
    <input id={label} type={type} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={error ? `${label}-error` : undefined} className={error ? styles.inputError : ''} />
    {error && (
      <span id={`${label}-error`} className={styles.error} role="alert">
        {error}
      </span>
    )}
  </div>
);
```

### 3. Organisms

**Relatively complex UI sections composed of groups of molecules and/or atoms.**

**Examples:**

- Form (multiple form fields + submit button)
- Header (logo + navigation + search)
- Card grid
- Navigation menu
- Modal (title + content + actions)

**In this library:**

- **Modal organism** — uses title (atom), content (molecule/atom), buttons (atom)
- **SignupModal organism** — composed of:
  - Form title (atom)
  - Email field (molecule)
  - Password field (molecule)
  - Confirm password field (molecule)
  - Submit button (atom)
  - Error message (atom)
- **ConfirmModal organism** — composed of:
  - Modal container
  - Content area
  - Action buttons

**Characteristics:**

- Composed of molecules/atoms
- Bigger scope than molecules
- Can contain logic (state, event handlers)
- Still reusable but context-aware

**Code Example:**

```tsx
// SignupModal organism
export const SignupModal = ({ isOpen, onClose, onSubmit, isLoading, error }: SignupModalProps) => {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation logic
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign Up">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <ErrorBanner message={error} />}

        <FormField label="Email" type="email" value={formData.email} onChange={(email) => setFormData({ ...formData, email })} error={errors.email} required />

        <PasswordField label="Password" value={formData.password} onChange={(password) => setFormData({ ...formData, password })} error={errors.password} required />

        <PasswordField
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={(confirmPassword) => setFormData({ ...formData, confirmPassword })}
          error={errors.confirmPassword}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
    </Modal>
  );
};
```

### 4. Templates

**Page-level layouts without real content.** Act as a blueprint showing component structure.

**Examples:**

- Article template (header + sidebar + main content)
- Product page template (hero + features + reviews)
- Admin dashboard template (navbar + sidebar + main area)

**Note:** This library focuses on components, not full pages. Templates would be used by consuming applications.

**Code Example (in consuming app):**

```tsx
// LoginPageTemplate
export const LoginPageTemplate = () => (
  <div className={styles.page}>
    <header className={styles.header}>
      <Logo />
    </header>

    <main className={styles.main}>
      <LoginModal isOpen={true} onClose={() => {}} />
    </main>

    <footer className={styles.footer}>
      <Footer />
    </footer>
  </div>
);
```

### 5. Pages

**Fully rendered pages with real data.** Instance of a template with actual content.

**Examples:**

- Home page (user logged in with real data)
- Product page (specific product details)
- User dashboard (user's orders, settings, etc.)

**Note:** Pages are created by consuming applications using our modal components.

## Applying Atomic Design to This Library

### Current Structure

```
src/
├── components/
│   ├── Modal.tsx              [ORGANISM] Base modal
│   ├── SignupModal.tsx        [ORGANISM] Signup form modal
│   ├── LoginModal.tsx         [ORGANISM] Login form modal
│   └── ConfirmModal.tsx       [ORGANISM] Confirmation dialog
└── types/
    └── index.ts               [Shared interfaces]
```

### Component Hierarchy

```
Atoms (from React/HTML)
├── <button>
├── <input>
├── <label>
└── <div>, <dialog>, etc.

Molecules (could be extracted)
├── FormField (input + label + error)
├── PasswordField (input + show/hide + label)
└── ErrorBanner (error icon + message)

Organisms (current library)
├── Modal (base dialog)
├── SignupModal (form modal)
├── LoginModal (form modal)
└── ConfirmModal (confirm dialog)
```

## Design System Benefits

### 1. Consistency

Using atoms and molecules ensures consistent styling across the app.

```tsx
// All form fields use the same molecule
<FormField label="Email" ... />
<FormField label="Password" ... />
```

### 2. Reusability

Components at each level can be reused in multiple contexts.

```tsx
// FormField used in signup, login, settings, etc.
<SignupModal />   // Uses FormField inside
<LoginModal />    // Uses FormField inside
<SettingsModal /> // Uses FormField inside
```

### 3. Maintainability

Changes to atoms/molecules propagate to all dependent organisms automatically.

```tsx
// Fix bug in FormField → all modals benefit
// Update FormField styles → entire system updates
```

### 4. Scalability

Clear structure makes it easy to add new components.

```tsx
// Adding ResetPasswordModal reuses existing FormField
export const ResetPasswordModal = ({ isOpen, onClose, onSubmit }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Reset Password">
    <FormField label="Email" ... />
    <PasswordField label="New Password" ... />
    <button onClick={onSubmit}>Reset</button>
  </Modal>
);
```

## Implementation Guidelines

### 1. Start with Atoms

Build the smallest, most reusable pieces first.

```tsx
// Atoms: button, input, label
// Don't add organism logic to atoms
export const Button = ({ children, onClick }: ButtonProps) => <button onClick={onClick}>{children}</button>;
```

### 2. Compose Molecules

Group atoms to solve a specific, recurring problem.

```tsx
// Molecule: solves the problem of "email input with validation"
export const EmailField = ({ value, onChange, error }: EmailFieldProps) => <FormField label="Email" type="email" value={value} onChange={onChange} error={error} />;
```

### 3. Build Organisms

Combine molecules to create feature-complete components.

```tsx
// Organism: signup form uses EmailField molecule
export const SignupModal = ({ isOpen, onClose, onSubmit }: SignupModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Sign Up">
    <EmailField ... />
    <PasswordField ... />
    <button type="submit">Sign Up</button>
  </Modal>
);
```

### 4. Keep Separation Clear

Each level should have clear responsibilities.

| Level        | Responsibility        | Can use                 |
| ------------ | --------------------- | ----------------------- |
| **Atom**     | Single visual element | HTML, CSS               |
| **Molecule** | Combines atoms        | Atoms                   |
| **Organism** | Feature component     | Atoms, molecules, logic |
| **Template** | Page layout           | All components          |
| **Page**     | Real content          | All components + data   |

## Best Practices

### 1. Don't Over-Engineer

Not every component needs all five levels. For a simple button, atoms alone are fine.

```tsx
// Simple—no molecules needed
export const Button = ({ children, onClick }: ButtonProps) => <button onClick={onClick}>{children}</button>;
```

### 2. Extract When Duplicated

If you use the same atom/molecule combo 3+ times, extract it.

```tsx
// ✅ Extract: password field appears in signup, login, reset password
export const PasswordField = ({ label, value, onChange, error }: PasswordFieldProps) => (
  // ...
);

// ❌ Don't over-extract: used only once
// Every <input> doesn't need to be its own component
```

### 3. Props Tell the Story

Props should reflect the component's level and purpose.

```tsx
// Molecule: focused props (label, value, error)
export const FormField = ({ label, value, error, onChange }: FormFieldProps) => ...

// Organism: higher-level props (isOpen, onSubmit)
export const SignupModal = ({ isOpen, onClose, onSubmit }: SignupModalProps) => ...
```

### 4. Naming Clarifies Intent

Use clear, descriptive names that reflect the component's level.

```tsx
// Atom: low-level name
(Button, Input, Label);

// Molecule: describes combination
(FormField, PasswordInput, ConfirmButton);

// Organism: describes feature
(SignupModal, LoginModal, ConfirmDialog);
```

## Resources

- **[Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/chapter-2/)** — Original methodology
- **[Thinking in React](https://react.dev/learn/thinking-in-react)** — Component decomposition
- **[Component-Driven Development](https://component-driven.dev/)** — Building design systems
