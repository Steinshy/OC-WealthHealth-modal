import type { ReactNode } from 'react';

/**
 * ModalProps - Configuration for the base Modal component
 * @interface
 */
export interface ModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback invoked when modal closes (via close button, ESC key, or auto-close) */
  onClose: () => void;
  /** Optional title displayed at top of modal */
  title?: string;
  /** Visual state affecting modal styling (success=green, error=red, info=blue, warning=amber, default=neutral) */
  status?: 'success' | 'error' | 'info' | 'warning' | 'default';
  /** Auto-close after N milliseconds (optional; if not set, modal stays open until user closes) */
  autoCloseDuration?: number;
  /** Close modal when clicking the backdrop (default: true) */
  closeOnBackdrop?: boolean;
  /** Show a built-in × close button in the header (default: true) */
  showCloseButton?: boolean;
  /** Allow modal to be dismissed (controls ESC, backdrop, and close button - default: true) */
  dismissible?: boolean;
  /** Icon to display in header (e.g., status icon) */
  icon?: ReactNode;
  /** Footer content (rendered at bottom of modal) */
  footer?: ReactNode;
  /** Modal width size variant (default: 'md') */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS class applied to the dialog element */
  className?: string;
  /** Modal content (rendered as children inside dialog) */
  children: ReactNode;
}

/**
 * Re-export molecule props from form
 */
export type { FormFieldProps } from '../components/form/FormField';
export type { PasswordFieldProps } from '../components/form/PasswordField';
export type { ErrorBannerProps } from '../components/form/ErrorBanner';
export type { SuccessMessageProps } from '../components/form/SuccessMessage';

/**
 * SignupFormData - Form submission payload for SignupModal
 * @interface
 */
export interface SignupFormData {
  /** User email address */
  email: string;
  /** User password */
  password: string;
  /** Password confirmation (must match password) */
  confirmPassword: string;
}

/**
 * SignupModalProps - Configuration for the SignupModal component
 * @interface
 */
export interface SignupModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback invoked when modal closes */
  onClose: () => void;
  /** Async handler for form submission; receives validated form data and throws on error */
  onSubmit: (formData: SignupFormData) => Promise<void>;
  /** Shows loading spinner and disables submit button while true */
  isLoading?: boolean;
  /** Error message displayed at top of form (if set, modal shows error state) */
  error?: string;
  /** Pre-fill form with initial data (useful for demo or edit modes) */
  initialData?: SignupFormData;
  /** Show success state without submitting (useful for demo) */
  showSuccess?: boolean;
  /** Initial validation errors to display (useful for demo) */
  initialErrors?: Record<string, string>;
}

/**
 * LoginFormData - Form submission payload for LoginModal
 * @interface
 */
export interface LoginFormData {
  /** User email address */
  email: string;
  /** User password */
  password: string;
}

/**
 * LoginModalProps - Configuration for the LoginModal component
 * @interface
 */
export interface LoginModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback invoked when modal closes */
  onClose: () => void;
  /** Async handler for form submission; receives validated form data and throws on error */
  onSubmit: (formData: LoginFormData) => Promise<void>;
  /** Shows loading spinner and disables submit button while true */
  isLoading?: boolean;
  /** Error message displayed at top of form (if set, modal shows error state) */
  error?: string;
  /** Pre-fill form with initial data (useful for demo or edit modes) */
  initialData?: LoginFormData;
  /** Show success state without submitting (useful for demo) */
  showSuccess?: boolean;
  /** Initial validation errors to display (useful for demo) */
  initialErrors?: Record<string, string>;
}

/**
 * ConfirmModalProps - Configuration for the ConfirmModal component
 * @interface
 */
export interface ConfirmModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback invoked when modal closes or cancel is pressed */
  onClose: () => void;
  /** Callback invoked when confirm button is pressed */
  onConfirm: () => void | Promise<void>;
  /** Modal title */
  title: string;
  /** Modal body content */
  children: ReactNode;
  /** Label for the confirm button (default: 'Confirm') */
  confirmLabel?: string;
  /** Label for the cancel button (default: 'Cancel') */
  cancelLabel?: string;
  /** Shows loading spinner on confirm button and disables both buttons while true */
  isLoading?: boolean;
  /** Visual state of the modal (default: 'default') */
  status?: 'success' | 'error' | 'info' | 'warning' | 'default';
}
