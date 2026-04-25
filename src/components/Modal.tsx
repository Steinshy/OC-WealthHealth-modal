import { useEffect, useRef } from 'react';

import type { ModalProps } from '../types';
import styles from './Modal.module.css';

/**
 * Modal - A reusable, accessible modal component using native HTML `<dialog>` element
 *
 * Uses the native HTMLDialogElement API for focus trapping, ESC key handling,
 * scroll locking, and top-layer rendering. Auto-closes after `autoCloseDuration` (optional).
 *
 * @component
 * @param {ModalProps} props
 * @param {boolean} props.isOpen - Controls modal visibility (triggers .showModal() / .close())
 * @param {() => void} props.onClose - Callback invoked when modal closes
 * @param {string} [props.title] - Optional title displayed at top of modal
 * @param {'success' | 'error' | 'info' | 'warning' | 'default'} [props.status='default'] - Visual state affecting styling
 * @param {number} [props.autoCloseDuration] - Auto-close after N milliseconds (optional)
 * @param {boolean} [props.closeOnBackdrop=true] - Close modal when clicking backdrop
 * @param {boolean} [props.showCloseButton=true] - Show built-in close button
 * @param {boolean} [props.dismissible=true] - Allow modal to be dismissed via ESC, backdrop click, or close button
 * @param {React.ReactNode} [props.icon] - Optional icon to display in header (e.g., status icon)
 * @param {React.ReactNode} [props.footer] - Optional footer content rendered at bottom
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Modal width size
 * @param {string} [props.className] - Additional CSS class
 * @param {React.ReactNode} props.children - Modal content
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Welcome" status="success" icon={✓}>
 *   <p>Operation successful!</p>
 *   <ModalFooter>Custom footer content</ModalFooter>
 * </Modal>
 * ```
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  status = 'default',
  autoCloseDuration,
  closeOnBackdrop = true,
  showCloseButton = true,
  dismissible = true,
  icon,
  footer,
  size = 'md',
  className,
  children,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  /**
   * Effect: Manage dialog visibility and auto-close timer
   * - Calls .showModal() when isOpen=true
   * - Calls .close() when isOpen=false
   * - Sets up optional auto-close timer
   */
  useEffect(() => {
    if (isOpen && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();

      // Optional: auto-close timer
      if (autoCloseDuration && autoCloseDuration > 0) {
        const timer = setTimeout(() => {
          dialogRef.current?.close();
        }, autoCloseDuration);

        return () => clearTimeout(timer);
      }
    } else if (!isOpen && dialogRef.current?.open) {
      dialogRef.current.close();
    }
  }, [isOpen, autoCloseDuration]);

  /** Close the dialog; parent `onClose` runs once from the dialog `close` event. */
  const closeModal = () => {
    dialogRef.current?.close();
  };

  /**
   * Handle dialog close event (triggered by .close(), ESC key, or backdrop click)
   */
  const handleDialogClose = () => {
    if (dismissible) {
      onClose();
    }
  };

  /**
   * Handle backdrop click to close (if enabled and dismissible)
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (dismissible && closeOnBackdrop && e.target === dialogRef.current) {
      closeModal();
    }
  };

  /**
   * Handle close button click
   */
  const handleCloseButtonClick = () => {
    if (dismissible) {
      closeModal();
    }
  };

  return (
    <dialog ref={dialogRef} onClose={handleDialogClose} onClick={handleBackdropClick} className={`${styles.modal} ${styles[`modal--${status}`]} ${styles[`modal--${size}`]} ${className || ''}`}>
      {title && (
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            {icon && <span className={styles.icon}>{icon}</span>}
            <h2 className={styles.title}>{title}</h2>
          </div>
          {showCloseButton && dismissible && (
            <button className={styles.closeButton} onClick={handleCloseButtonClick} aria-label="Close dialog" type="button">
              ✕
            </button>
          )}
        </div>
      )}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </dialog>
  );
};
