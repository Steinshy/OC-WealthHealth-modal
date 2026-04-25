import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';

const meta = {
  component: Modal,
  title: 'Components/Modal',
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

const noop = () => {};

function InteractiveModalPlayground() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Interactive Modal">
        <p>This modal was opened from a button.</p>
      </Modal>
    </div>
  );
}

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: noop,
    title: 'Modal Title',
    children: <p>This is modal content.</p>,
    status: 'default',
  },
};

export const Error: Story = {
  args: {
    isOpen: true,
    onClose: noop,
    title: 'Error Dialog',
    status: 'error',
    children: <p>Something went wrong.</p>,
  },
};

export const Success: Story = {
  args: {
    isOpen: true,
    onClose: noop,
    title: 'Success!',
    status: 'success',
    children: <p>Your action was completed.</p>,
  },
};

export const Info: Story = {
  args: {
    isOpen: true,
    onClose: noop,
    title: 'Information',
    status: 'info',
    children: <p>Here is some useful information.</p>,
  },
};

export const Warning: Story = {
  args: {
    isOpen: true,
    onClose: noop,
    title: 'Warning',
    status: 'warning',
    children: <p>Please review before proceeding.</p>,
  },
};

export const WithCloseButton: Story = {
  args: {
    isOpen: true,
    onClose: noop,
    title: 'Closable Modal',
    showCloseButton: true,
    children: <p>Click the × button or ESC to close.</p>,
  },
};

export const Small: Story = {
  args: {
    isOpen: true,
    onClose: noop,
    title: 'Small Modal',
    size: 'sm',
    children: <p>Compact modal.</p>,
  },
};

export const Large: Story = {
  args: {
    isOpen: true,
    onClose: noop,
    title: 'Large Modal',
    size: 'lg',
    children: <p>Full-width modal for complex content.</p>,
  },
};

export const Interactive: Story = {
  args: {
    isOpen: false,
    onClose: noop,
    title: 'Interactive Modal',
    children: <p>This modal was opened from a button.</p>,
  },
  render: () => <InteractiveModalPlayground />,
};
