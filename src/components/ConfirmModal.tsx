import { Modal } from './Modal';
import type { ConfirmModalProps } from '../types';
import styles from './ConfirmModal.module.css';

/**
 * ConfirmModal - Pre-configured modal for confirmation dialogs
 *
 * Features:
 * - Simple confirm/cancel action modal
 * - Async confirm handler with loading state
 * - Customizable button labels
 * - Status-based theming
 * - Loading spinner on confirm button
 *
 * @component
 * @param {ConfirmModalProps} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {() => void} props.onClose - Callback when modal closes or cancel is pressed
 * @param {() => void | Promise<void>} props.onConfirm - Async handler when confirm is pressed
 * @param {string} props.title - Modal title
 * @param {ReactNode} props.children - Modal body content
 * @param {string} [props.confirmLabel='Confirm'] - Label for confirm button
 * @param {string} [props.cancelLabel='Cancel'] - Label for cancel button
 * @param {boolean} [props.isLoading] - Shows loading spinner, disables both buttons
 * @param {'success' | 'error' | 'info' | 'warning' | 'default'} [props.status='default'] - Visual state
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * const handleConfirm = async () => {
 *   await deleteUser();
 * };
 *
 * <ConfirmModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleConfirm}
 *   title="Delete User?"
 *   confirmLabel="Delete"
 *   status="error"
 * >
 *   <p>This action cannot be undone.</p>
 * </ConfirmModal>
 * ```
 */
export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, children, confirmLabel = 'Confirm', cancelLabel = 'Cancel', isLoading = false, status = 'default' }: ConfirmModalProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('Confirm error:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} status={status}>
      <div className={styles.form}>
        <div>{children}</div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </button>
          <button type="button" className={styles.submitButton} onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className={styles.spinner} aria-hidden="true"></span>
                {confirmLabel}...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
