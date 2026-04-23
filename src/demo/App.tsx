import { useState } from 'react';
import { Modal, SignupModal, LoginModal, ConfirmModal } from '../index';
import styles from './demo.module.css';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<'success' | 'error' | 'info' | 'warning' | 'default'>('default');
  const [modalStatus, setModalStatus] = useState<'success' | 'error' | 'info' | 'warning' | 'default'>('success');
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState<string>();
  const [initialErrors, setInitialErrors] = useState<Record<string, string>>({});
  const [lastSubmitted, setLastSubmitted] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState<string>();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [lastLoginSubmitted, setLastLoginSubmitted] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const handleSignupSubmit = async (data: { email: string; password: string; confirmPassword: string }) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLastSubmitted({ email: data.email, password: data.password });
    setIsLoading(false);
  };

  const handleSignupError = () => {
    setLastSubmitted(null);
    setInitialErrors({
      email: 'Email already in use. Please try another.',
      password: 'Password does not meet requirements',
      confirmPassword: 'Passwords do not match',
    });
    setSignupError('Email already in use. Please try another.');
    setIsSignupOpen(true);
  };

  const handleTriggerSuccess = () => {
    setSignupError(undefined);
    setInitialErrors({});
    setLastSubmitted({
      email: 'demo@example.com',
      password: 'DemoPassword123',
    });
    setIsSignupOpen(true);
  };

  const handleLoginSubmit = async (data: { email: string; password: string }) => {
    setIsLoginLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLastLoginSubmitted(data);
    setIsLoginLoading(false);
  };

  const handleLoginError = () => {
    setLoginError('Invalid email or password. Please try again.');
    setIsLoginOpen(true);
  };

  const handleConfirmAction = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>wealthHealth-modal Component Library</h1>
        <p>Test Modal and SignupModal components in a browser environment</p>
      </header>

      <main className={styles.main}>
        {/* Modal Examples */}
        <section className={styles.section}>
          <h2>Modal Component</h2>

          <div className={styles.controls}>
            <button
              className={styles.button}
              onClick={() => {
                setModalStatus('success');
                setIsModalOpen(true);
              }}
            >
              Open Success Modal
            </button>
            <button
              className={styles.button}
              onClick={() => {
                setModalStatus('error');
                setIsModalOpen(true);
              }}
            >
              Open Error Modal
            </button>
            <button
              className={styles.button}
              onClick={() => {
                setModalStatus('info');
                setIsModalOpen(true);
              }}
            >
              Open Info Modal
            </button>
            <button
              className={styles.button}
              onClick={() => {
                setModalStatus('default');
                setIsModalOpen(true);
              }}
            >
              Open Default Modal
            </button>
            <button
              className={styles.button}
              onClick={() => {
                setModalStatus('warning');
                setIsModalOpen(true);
              }}
            >
              Open Warning Modal
            </button>
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Modal Demo" status={modalStatus}>
            <p>This is a {modalStatus} modal status.</p>
            <p>Try pressing ESC or clicking the backdrop to close it.</p>
            <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
              Close Modal
            </button>
          </Modal>
        </section>

        {/* SignupModal Example */}
        <section className={styles.section}>
          <h2>SignupModal Component</h2>

          <div className={styles.controls}>
            <button
              className={styles.button}
              onClick={() => {
                setSignupError(undefined);
                setInitialErrors({});
                setLastSubmitted(null);
                setIsSignupOpen(true);
              }}
            >
              Open Signup Form
            </button>
            <button className={styles.button} onClick={handleSignupError}>
              Trigger Error Example
            </button>
            <button className={styles.button} onClick={handleTriggerSuccess}>
              Trigger Success Example
            </button>
          </div>

          <SignupModal
            isOpen={isSignupOpen}
            onClose={() => {
              setIsSignupOpen(false);
              setSignupError(undefined);
              setInitialErrors({});
            }}
            onSubmit={handleSignupSubmit}
            isLoading={isLoading}
            error={signupError}
            initialData={
              lastSubmitted
                ? {
                    email: lastSubmitted.email,
                    password: lastSubmitted.password,
                    confirmPassword: lastSubmitted.password,
                  }
                : undefined
            }
            showSuccess={!!lastSubmitted}
            initialErrors={initialErrors}
          />

          {lastSubmitted && (
            <div className={styles.result}>
              <h3>Last Submission:</h3>
              <pre>{JSON.stringify(lastSubmitted, null, 2)}</pre>
            </div>
          )}
        </section>

        {/* LoginModal Example */}
        <section className={styles.section}>
          <h2>LoginModal Component</h2>

          <div className={styles.controls}>
            <button
              className={styles.button}
              onClick={() => {
                setLoginError(undefined);
                setLastLoginSubmitted(null);
                setIsLoginOpen(true);
              }}
            >
              Open Login Form
            </button>
            <button className={styles.button} onClick={handleLoginError}>
              Trigger Error Example
            </button>
          </div>

          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => {
              setIsLoginOpen(false);
              setLoginError(undefined);
            }}
            onSubmit={handleLoginSubmit}
            isLoading={isLoginLoading}
            error={loginError}
            initialData={
              lastLoginSubmitted
                ? {
                    email: lastLoginSubmitted.email,
                    password: lastLoginSubmitted.password,
                  }
                : undefined
            }
            showSuccess={!!lastLoginSubmitted}
          />

          {lastLoginSubmitted && (
            <div className={styles.result}>
              <h3>Last Submission:</h3>
              <pre>{JSON.stringify(lastLoginSubmitted, null, 2)}</pre>
            </div>
          )}
        </section>

        {/* ConfirmModal Example */}
        <section className={styles.section}>
          <h2>ConfirmModal Component</h2>

          <div className={styles.controls}>
            <button
              className={styles.button}
              onClick={() => {
                setConfirmStatus('default');
                setIsConfirmOpen(true);
              }}
            >
              Open Confirm Dialog
            </button>
            <button
              className={styles.button}
              onClick={() => {
                setConfirmStatus('warning');
                setIsConfirmOpen(true);
              }}
            >
              Open Deletion Warning
            </button>
            <button
              className={styles.button}
              onClick={() => {
                setConfirmStatus('error');
                setIsConfirmOpen(true);
              }}
            >
              Open Error Confirm
            </button>
          </div>

          <ConfirmModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleConfirmAction}
            title={confirmStatus === 'error' ? 'Confirm Error' : confirmStatus === 'warning' ? 'Delete Item?' : 'Confirm Action?'}
            status={confirmStatus}
            confirmLabel={confirmStatus === 'error' ? 'Retry' : confirmStatus === 'warning' ? 'Delete' : 'Confirm'}
          >
            {confirmStatus === 'error' && <p>An error occurred. Do you want to retry this action?</p>}
            {confirmStatus === 'warning' && <p>This action cannot be undone. Are you sure you want to proceed?</p>}
            {confirmStatus === 'default' && <p>Are you sure you want to proceed with this action?</p>}
          </ConfirmModal>
        </section>

        {/* Features */}
        <section className={styles.section}>
          <h2>Features</h2>
          <ul className={styles.features}>
            <li>✅ Native HTML &lt;dialog&gt; element</li>
            <li>✅ Automatic focus trapping</li>
            <li>✅ ESC key & backdrop-click closes modal</li>
            <li>✅ Built-in close button (optional)</li>
            <li>✅ Size variants (sm, md, lg)</li>
            <li>✅ Status variants: success, error, info, warning, default</li>
            <li>✅ CSS custom properties for theming</li>
            <li>✅ Password visibility toggle</li>
            <li>✅ WCAG 2.1 Level AA accessible</li>
            <li>✅ Explicit form labels (not placeholder-only)</li>
            <li>✅ Error messages with aria-describedby</li>
            <li>✅ Focus-visible keyboard navigation</li>
            <li>✅ TypeScript support</li>
            <li>✅ CSS Modules with dark mode support</li>
            <li>✅ Responsive design</li>
            <li>✅ Reduced motion support</li>
            <li>✅ High contrast mode support</li>
          </ul>
        </section>

        {/* Testing Notes */}
        <section className={styles.section}>
          <h2>Accessibility Testing</h2>
          <div className={styles.testNotes}>
            <h3>Keyboard Navigation:</h3>
            <ul>
              <li>
                Press <kbd>Tab</kbd> to navigate through form fields
              </li>
              <li>
                Press <kbd>ESC</kbd> to close modals
              </li>
              <li>
                Press <kbd>Enter</kbd> to submit the form
              </li>
            </ul>

            <h3>Screen Reader Testing:</h3>
            <ul>
              <li>Modal announces as dialog with title</li>
              <li>Form labels are explicitly associated with inputs</li>
              <li>Error messages are announced with aria-describedby</li>
              <li>Required fields are indicated</li>
            </ul>

            <h3>Visual Accessibility:</h3>
            <ul>
              <li>Color contrast meets AA standards</li>
              <li>Focus indicators are visible</li>
              <li>Error states don't rely on color alone</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
