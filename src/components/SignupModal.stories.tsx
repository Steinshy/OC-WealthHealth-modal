import type { Meta, StoryObj } from '@storybook/react';
import { SignupModal } from './SignupModal';

const meta = {
  component: SignupModal,
  title: 'Components/SignupModal',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    error: { control: 'text' },
    showSuccess: { control: 'boolean' },
  },
} satisfies Meta<typeof SignupModal>;

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
    error: 'An account with this email already exists.',
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
    initialData: { email: 'user@example.com', password: '', confirmPassword: '' },
  },
};
