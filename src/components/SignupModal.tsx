import { useState, useRef, useEffect, useCallback } from 'react';

import { Modal } from './Modal';
import { FormField, PasswordField, ErrorBanner, SuccessMessage } from './form';
import type { SignupFormData, SignupModalProps } from '../types';
import styles from './SignupModal.module.css';

/**
 * SignupModal - Pre-configured modal for user sign-up with form validation
 *
 * Features:
 * - WCAG 2.1 Level AA accessible form inputs with explicit labels
 * - Password confirmation validation
 * - Loading state during form submission
 * - Error state with user-friendly messages
 * - Success state after successful submission
 * - Focus management: moves focus to first invalid field on error
 *
 * @component
 * @param {SignupModalProps} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {() => void} props.onClose - Callback when modal closes
 * @param {(data: SignupFormData) => Promise<void>} props.onSubmit - Async submit handler
 * @param {boolean} [props.isLoading] - Shows loading spinner, disables submit
 * @param {string} [props.error] - Error message to display at top of form
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * const handleSubmit = async (data) => {
 *   const response = await fetch('/api/signup', {
 *     method: 'POST',
 *     body: JSON.stringify(data),
 *   });
 *   if (!response.ok) throw new Error('Signup failed');
 * };
 *
 * <SignupModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSubmit={handleSubmit}
 * />
 * ```
 */
export const SignupModal = ({ isOpen, onClose, onSubmit, isLoading = false, error, initialData, showSuccess = false, initialErrors }: SignupModalProps) => {
  const [formData, setFormData] = useState<SignupFormData>(
    initialData || {
      email: '',
      password: '',
      confirmPassword: '',
    }
  );

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>(initialErrors || {});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const successCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSuccessCloseTimer = useCallback(() => {
    if (successCloseTimerRef.current !== null) {
      clearTimeout(successCloseTimerRef.current);
      successCloseTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      clearSuccessCloseTimer();
    }
    return () => clearSuccessCloseTimer();
  }, [isOpen, clearSuccessCloseTimer]);

  /**
   * Validate form data and return errors object
   * Rules:
   * - All fields required
   * - Email must be valid format
   * - Password must be at least 8 characters
   * - Confirm password must match password
   */
  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  /**
   * Handle form submission
   * 1. Validate form
   * 2. Call onSubmit prop with form data
   * 3. Show success on completion
   * 4. Auto-close after 2 seconds
   */
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearSuccessCloseTimer();

    // Validate
    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Focus first invalid field for accessibility
      if (errors.email) emailRef.current?.focus();
      else if (errors.password) passwordRef.current?.focus();
      else if (errors.confirmPassword) confirmPasswordRef.current?.focus();
      return;
    }

    try {
      await onSubmit(formData);
      setSubmitted(true);

      successCloseTimerRef.current = setTimeout(() => {
        successCloseTimerRef.current = null;
        resetForm();
        onClose();
      }, 2000);
    } catch (err) {
      // Error is passed via props, no additional handling needed
      console.error('Signup error:', err);
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({ email: '', password: '', confirmPassword: '' });
    setValidationErrors({});
    setSubmitted(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  /**
   * Handle input change and clear errors for that field
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error for this field once user starts typing
    if (validationErrors[id]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  /**
   * Determine modal status based on form state
   */
  const getStatus = () => {
    if (submitted || showSuccess) return 'success';
    if (error) return 'error';
    return 'info';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign Up" status={getStatus()}>
      {submitted || showSuccess ? (
        <SuccessMessage message="Account created successfully! Redirecting..." />
      ) : (
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {error && <ErrorBanner message={error} />}

          {/* Email field - using FormField molecule */}
          <FormField
            label="Email"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={validationErrors.email}
            required
            disabled={isLoading}
            ref={emailRef}
          />

          {/* Password field - using PasswordField molecule */}
          <PasswordField
            label="Password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={validationErrors.password}
            required
            disabled={isLoading}
            ref={passwordRef}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword(!showPassword)}
          />

          {/* Confirm password field - using PasswordField molecule */}
          <PasswordField
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={validationErrors.confirmPassword}
            required
            disabled={isLoading}
            ref={confirmPasswordRef}
            showPassword={showConfirmPassword}
            onToggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          {/* Submit button with loading state */}
          <div className={styles.actions}>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className={styles.spinner} aria-hidden="true"></span>
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
