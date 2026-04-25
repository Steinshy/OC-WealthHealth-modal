import styles from './SuccessMessage.module.css';

/**
 * SuccessMessageProps - Configuration for the SuccessMessage molecule
 */
export interface SuccessMessageProps {
  /** Success message text */
  message: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * SuccessMessage - A reusable molecule for displaying success messages
 * Typically shown after form submission
 *
 * Features:
 * - Centered layout
 * - Success styling with green color
 * - WCAG 2.1 AA compliant color contrast
 *
 * @component
 * @param {SuccessMessageProps} props
 *
 * @example
 * ```tsx
 * <SuccessMessage message="Account created successfully!" />
 * ```
 */
export const SuccessMessage = ({ message, className }: SuccessMessageProps) => {
  return (
    <div className={`${styles.successMessage} ${className || ''}`} role="status" aria-live="polite">
      <p className={styles.successText}>{message}</p>
    </div>
  );
};
