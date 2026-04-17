# Storybook Setup & Usage

This guide covers setting up and using Storybook for component development and documentation in our React + Vite project.

## Overview

Storybook is an isolated development environment for UI components. It allows you to:

- **Develop components independently** without worrying about app context
- **Document components** with live examples and interactive controls
- **Test variations** of components (different props, states, sizes)
- **Share documentation** with designers, PMs, and other developers
- **Catch regressions** with visual testing workflows

## Installation & Setup

### 1. Install Storybook

```bash
npm install -D storybook @storybook/react @storybook/react-vite
```

### 2. Initialize Storybook

```bash
npx storybook@latest init
```

This creates:

- `.storybook/main.ts` — Storybook configuration
- `.storybook/preview.ts` — Global story settings (decorators, parameters)
- `src/stories/` — Example stories (can be deleted)

### 3. Configure Vite Integration

Update `.storybook/main.ts`:

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.ts?(x)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@storybook/addon-interactions'],
  docs: {
    autodocs: 'tag',
  },
};

export default config;
```

### 4. Add Scripts to package.json

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build:storybook": "storybook build"
  }
}
```

## Writing Stories

### Basic Story Structure

Create `src/components/Modal.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';

const meta = {
  component: Modal,
  title: 'Components/Modal',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    status: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning', 'default'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Modal Title',
    children: <p>This is modal content.</p>,
    status: 'default',
  },
};

// Error state
export const Error: Story = {
  args: {
    isOpen: true,
    title: 'Error Dialog',
    status: 'error',
    children: <p>Something went wrong.</p>,
  },
};

// Success state
export const Success: Story = {
  args: {
    isOpen: true,
    title: 'Success!',
    status: 'success',
    children: <p>Your action was completed.</p>,
  },
};

// Interactive story with close button
export const WithCloseButton: Story = {
  args: {
    isOpen: true,
    title: 'Closable Modal',
    showCloseButton: true,
    children: <p>Click the × button or ESC to close.</p>,
  },
};

// Size variants
export const Small: Story = {
  args: {
    isOpen: true,
    title: 'Small Modal',
    size: 'sm',
    children: <p>Compact modal.</p>,
  },
};

export const Large: Story = {
  args: {
    isOpen: true,
    title: 'Large Modal',
    size: 'lg',
    children: <p>Full-width modal for complex content.</p>,
  },
};
```

### Interactive Story with State

```tsx
export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <button onClick={() => setIsOpen(true)}>Open Modal</button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Interactive Modal">
          <p>This modal was opened from a button.</p>
        </Modal>
      </div>
    );
  },
};
```

## Essential Addons

### Accessibility (@storybook/addon-a11y)

Automatically audit components for accessibility issues.

**Install:**

```bash
npm install -D @storybook/addon-a11y
```

**Usage:**

1. Run Storybook: `npm run storybook`
2. Click the **Accessibility** tab in the bottom panel
3. View WCAG violations and fixes

### Controls (Built-in)

Dynamically change props in the UI without code changes.

**Usage:**

```tsx
argTypes: {
  isOpen: { control: 'boolean' },
  title: { control: 'text' },
  size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
}
```

### Docs (Built-in)

Auto-generates documentation from JSDoc comments and TypeScript types.

**Enable:**

```typescript
// .storybook/main.ts
docs: {
  autodocs: 'tag', // Generates docs for stories tagged with 'autodocs'
}
```

**JSDoc Example:**

```tsx
/**
 * Modal component using native <dialog> element.
 *
 * @component
 * @param {ModalProps} props
 * @example
 * const [isOpen, setIsOpen] = useState(false);
 * return <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Hello" />
 */
export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  // ...
};
```

## Running Storybook

### Development Mode

```bash
npm run storybook
```

Opens at `http://localhost:6006`

- Hot module reloading
- Live component editing
- Real-time prop controls

### Build for Production

```bash
npm run build:storybook
```

Outputs static HTML site in `storybook-static/` directory.

**Deploy to Vercel, Netlify, or GitHub Pages:**

```bash
npm run build:storybook
# Deploy storybook-static/ folder
```

## Best Practices

### 1. Keep Stories Simple

One story per component variant. Use `argTypes` for controls instead of writing multiple stories for slight prop changes.

```tsx
// ✅ Good: Use controls
export const Default: Story = {
  args: { isOpen: true, status: 'default' },
  argTypes: { status: { control: 'select', options: [...] } },
};

// ❌ Avoid: Redundant stories
export const DefaultOpen: Story = { args: { isOpen: true } };
export const DefaultClosed: Story = { args: { isOpen: false } };
```

### 2. Document Props with TypeScript

Storybook auto-extracts prop documentation from TypeScript interfaces:

```tsx
export interface ModalProps {
  /** Controls modal visibility */
  isOpen: boolean;

  /** Callback fired when modal closes */
  onClose: () => void;

  /** Modal heading text */
  title: string;

  /** Visual state (colors top border) */
  status?: 'success' | 'error' | 'info' | 'warning' | 'default';
}
```

### 3. Use Layout Parameter

Optimize space for different component types:

```tsx
parameters: {
  layout: 'centered',    // Modal, dialog, popover
  // layout: 'fullscreen', // Page-level components
  // layout: 'padded',     // Forms, cards
}
```

### 4. Test Accessibility

Every story should pass accessibility checks:

```tsx
export const Default: Story = {
  args: {
    /* ... */
  },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
  },
};
```

### 5. Group Related Stories

Use the `/` separator in the title to organize by hierarchy:

```tsx
// Stories appear as:
// Components/Modal/Default
// Components/Modal/Error
// Components/SignupModal/Default
// Components/SignupModal/With Error

meta = {
  title: 'Components/Modal',
  // ...
};

meta = {
  title: 'Components/SignupModal',
  // ...
};
```

## CI/CD Integration

### Visual Regression Testing

Add Chromatic for visual testing across pull requests:

```bash
npm install -D @chromatic-com/storybook
npx storybook-test --coverage
```

### GitHub Actions Workflow

```yaml
name: Storybook Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build:storybook
      - run: npx chromatic --exit-zero-on-changes
        env:
          CHROMATIC_APP_CODE: ${{ secrets.CHROMATIC_APP_CODE }}
```

## Resources

- **[Storybook Documentation](https://storybook.js.org/docs/react/get-started/frameworks/react-vite)**
- **[Component Story Format (CSF)](https://storybook.js.org/docs/react/api/csf)**
- **[Storybook Addons](https://storybook.js.org/addons)**
- **[Accessibility Testing in Storybook](https://storybook.js.org/docs/react/writing-tests/accessibility-testing)**
- **[Chromatic for Visual Testing](https://www.chromatic.com/)**
