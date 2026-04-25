import { forwardRef, useState, type ReactNode } from 'react';
import { FormField, type FormFieldProps } from './FormField';
import styles from './PasswordField.module.css';

/**
 * PasswordFieldProps - Configuration for the PasswordField molecule
 * Extends FormFieldProps with password-specific options
 */
export interface PasswordFieldProps extends Omit<FormFieldProps, 'type'> {
  /** Whether to show the password (default: false) */
  showPassword?: boolean;
  /** Callback when password visibility toggle is clicked */
  onToggleShowPassword?: (show: boolean) => void;
  /** Custom icon/emoji for show password button */
  showPasswordIcon?: ReactNode;
  /** Custom icon/emoji for hide password button */
  hidePasswordIcon?: ReactNode;
}

/**
 * PasswordField - A reusable molecule component for password inputs
 * Combines FormField with a password visibility toggle button
 *
 * Features:
 * - Material Design inspired input styling
 * - Show/hide password toggle
 * - WCAG 2.1 AA accessible
 * - inherited from FormField
 *
 * @component
 * @param {PasswordFieldProps} props
 *
 * @example
 * ```tsx
 * const [password, setPassword] = useState('');
 * const [showPassword, setShowPassword] = useState(false);
 *
 * <PasswordField
 *   label="Password"
 *   id="password"
 *   name="password"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   showPassword={showPassword}
 *   onToggleShowPassword={setShowPassword}
 *   required
 * />
 * ```
 */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { showPassword: externalShowPassword, onToggleShowPassword, showPasswordIcon = '👁️', hidePasswordIcon = '🙈', ...props },
  ref
) {
  const [internalShowPassword, setInternalShowPassword] = useState(false);

  const showPassword = externalShowPassword !== undefined ? externalShowPassword : internalShowPassword;

  const handleToggle = () => {
    const newState = !showPassword;
    if (onToggleShowPassword) {
      onToggleShowPassword(newState);
    } else {
      setInternalShowPassword(newState);
    }
  };

  return (
    <div className={styles.passwordField}>
      <FormField
        {...props}
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        inputProps={{
          ...props.inputProps,
          style: { ...props.inputProps?.style, paddingRight: '40px' },
        }}
      />
      <button type="button" className={styles.togglePassword} onClick={handleToggle} aria-label={showPassword ? 'Hide password' : 'Show password'} disabled={props.disabled}>
        {showPassword ? hidePasswordIcon : showPasswordIcon}
      </button>
    </div>
  );
});
