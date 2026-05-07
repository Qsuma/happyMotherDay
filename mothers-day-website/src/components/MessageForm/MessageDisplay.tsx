import styles from './MessageForm.module.css';
import type { MessageDisplayProps } from './MessageForm.types';

/**
 * MessageDisplay Component
 *
 * Displays a saved message in a styled container with close button
 * Used within MessageForm to show the user's saved message
 *
 * @param message - The message text to display
 * @param onClose - Callback when close button is clicked
 * @param title - Optional custom title (default: "Tu Mensaje")
 * @param className - Optional CSS class name
 */
export function MessageDisplay({
  message,
  onClose,
  title = 'Tu Mensaje',
  className,
}: MessageDisplayProps) {
  return (
    <div className={`${styles.displayContainer} ${className || ''}`}>
      <h3 className={styles.displayTitle}>{title}</h3>

      <p className={styles.messageText}>{message}</p>

      <button
        onClick={onClose}
        className={styles.closeButton}
        aria-label="Close or hide message"
        title="Hide this message"
      >
        Ocultar
      </button>
    </div>
  );
}
