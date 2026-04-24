import { forwardRef } from 'react';

import styles from './FormField.module.css';

/**
 * FormFieldProps - Configuration for the FormField molecule
 * A reusable molecule combining label, input, and error message
 */
export interface FormFieldProps {
  /** Field label text */
  label: string;
  /** Input type (text, email, password, etc.) */
  type?: string;
  /** Input ID - used for htmlFor/label association */
  id: string;
  /** Input name attribute */
  name: string;
  /** Input value */
  value: string;
  /** Change handler */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Error message to display */
  error?: string;
  /** Disable the input */
  disabled?: boolean;
  /** Required field indicator */
  required?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional input props */
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'id' | 'name' | 'value' | 'onChange' | 'disabled' | 'required' | 'aria-describedby'>;
}

/**
 * FormField - A reusable molecule component for form fields
 * Combines label, input, and error message with WCAG 2.1 AA accessibility
 *
 * Features:
 * - Material Design inspired input styling
 * - Explicit labels (not placeholder-only) - WCAG 1.3.1
 * - Clear error messages with aria-describedby - WCAG 1.3.1
 * - Focus states for keyboard navigation
 *
 * @component
 * @param {FormFieldProps} props
 *
 * @example
 * ```tsx
 * const [email, setEmail] = useState('');
 * const [error, setError] = useState<string>();
 *
 * <FormField
 *   label="Email"
 *   type="email"
 *   id="email"
 *   name="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={error}
 *   required
 * />
 * ```
 */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { label, type = 'text', id, name, value, onChange, error, disabled = false, required = false, className, inputProps = {} },
  ref
) {
  const errorId = `${id}-error`;

  return (
    <div className={`${styles.formGroup} ${className || ''}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <input
        ref={ref}
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        style={{ width: '100%' }}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
