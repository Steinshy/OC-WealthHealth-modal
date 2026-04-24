import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmModal } from './ConfirmModal';

const meta = {
  component: ConfirmModal,
  title: 'Components/ConfirmModal',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    status: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning', 'default'],
    },
    confirmLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
  },
} satisfies Meta<typeof ConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Are you sure?',
    children: <p>This action cannot be undone.</p>,
    onClose: () => {},
    onConfirm: () => {},
  },
};

export const DeleteConfirm: Story = {
  args: {
    isOpen: true,
    title: 'Delete Item?',
    children: <p>This will permanently delete the item and all associated data.</p>,
    onClose: () => {},
    onConfirm: async () => {},
    confirmLabel: 'Delete',
    cancelLabel: 'Keep',
    status: 'error',
  },
};

export const Loading: Story = {
  args: {
    isOpen: true,
    title: 'Processing...',
    children: <p>Please wait while we process your request.</p>,
    onClose: () => {},
    onConfirm: async () => {},
    isLoading: true,
  },
};

export const SuccessVariant: Story = {
  args: {
    isOpen: true,
    title: 'Publish Changes?',
    children: <p>Your changes will be visible to all users.</p>,
    onClose: () => {},
    onConfirm: () => {},
    confirmLabel: 'Publish',
    status: 'success',
  },
};
