import styles from './ErrorBanner.module.css';

/**
 * ErrorBannerProps - Configuration for the ErrorBanner molecule
 */
export interface ErrorBannerProps {
  /** Error message to display */
  message: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * ErrorBanner - A reusable molecule for displaying error messages
 * Typically shown at the top of forms
 *
 * Features:
 * - Accessible error styling
 * - Clear visual hierarchy
 * - WCAG 2.1 AA compliant color contrast
 *
 * @component
 * @param {ErrorBannerProps} props
 *
 * @example
 * ```tsx
 * <ErrorBanner message="Invalid email address" />
 * ```
 */
export const ErrorBanner = ({ message, className }: ErrorBannerProps) => {
  return (
    <div className={`${styles.errorBanner} ${className || ''}`} role="alert" aria-live="assertive">
      {message}
    </div>
  );
};
