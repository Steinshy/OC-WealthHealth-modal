import type { Meta, StoryObj } from '@storybook/react';
import { LoginModal } from './LoginModal';

const meta = {
  component: LoginModal,
  title: 'Components/LoginModal',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    error: { control: 'text' },
    showSuccess: { control: 'boolean' },
  },
} satisfies Meta<typeof LoginModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onSubmit: async () => {},
  },
};

export const WithError: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onSubmit: async () => {},
    error: 'Invalid email or password.',
  },
};

export const Loading: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onSubmit: async () => {},
    isLoading: true,
  },
};

export const ShowSuccess: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onSubmit: async () => {},
    showSuccess: true,
  },
};

export const WithInitialData: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onSubmit: async () => {},
    initialData: { email: 'user@example.com', password: '' },
  },
};
