import { useState } from 'react';
import { MessageDisplay } from './MessageDisplay';
import styles from './MessageForm.module.css';
import type { MessageFormProps } from './MessageForm.types';

/**
 * MessageForm Component (T066)
 *
 * Personalized message form allowing users to write optional messages
 * with validation (max 500 characters), character counter, and display toggle
 *
 * Features:
 * - Character counter (real-time updates)
 * - Max 500 characters enforced
 * - Form submission stores message in component state
 * - Optional message display toggle
 * - Full accessibility (ARIA live regions, labels, focus management)
 * - Mobile-friendly (44px minimum touch targets)
 * - Respects prefers-reduced-motion
 *
 * @param initialMessage - Optional: pre-fill form with initial message
 * @param onMessageChange - Optional: callback fired when text changes
 * @param className - Optional: custom CSS class
 * @param maxChars - Optional: max character limit (default: 500)
 *
 * @example
 * ```tsx
 * <MessageForm
 *   onMessageChange={(text) => console.log(text)}
 *   maxChars={500}
 * />
 * ```
 */
export function MessageForm({
  initialMessage = '',
  onMessageChange,
  className = '',
  maxChars = 500,
}: MessageFormProps) {
  // Form state
  const [messageText, setMessageText] = useState(initialMessage);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  // Handle input change (T055: character counter)
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value.slice(0, maxChars);
    setMessageText(newText);

    // Call parent callback if provided
    if (onMessageChange) {
      onMessageChange(newText);
    }
  };

  // Handle form submission (T057: save and clear)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (messageText.trim()) {
      // Save message
      setSavedMessage(messageText);
      setIsDisplaying(true);

      // Clear input
      setMessageText('');
    }
  };

  // Handle toggle display (T058: show/hide)
  const handleToggleDisplay = () => {
    setIsDisplaying(!isDisplaying);
  };

  // Character counter with styling
  const charPercentage = (messageText.length / maxChars) * 100;
  let counterClass = styles.counter;
  if (charPercentage > 80) {
    counterClass = `${styles.counter} ${styles.error}`;
  } else if (charPercentage > 60) {
    counterClass = `${styles.counter} ${styles.warning}`;
  }

  return (
    <form onSubmit={handleSubmit} className={`${styles.formContainer} ${className}`}>
      {/* Label (T054, T059) */}
      <label className={styles.label} htmlFor="message-input">
        Escribe un Mensaje Especial
      </label>

      {/* Input container */}
      <div className={styles.inputContainer}>
        {/* Text input (T054, T056) */}
        <textarea
          id="message-input"
          className={styles.input}
          value={messageText}
          onChange={handleInputChange}
          maxLength={maxChars}
          placeholder="Comparte tus sentimientos con mamá... (máximo 500 caracteres)"
          rows={4}
          aria-label="Mensaje especial para mamá"
          aria-describedby="char-counter"
        />

        {/* Character counter (T055, T062) */}
        <div className={styles.counterContainer} aria-live="polite" aria-atomic="true">
          <span id="char-counter" className={counterClass}>
            {messageText.length} / {maxChars}
          </span>
          <span className={styles.characterHint}>
            {maxChars - messageText.length} caracteres disponibles
          </span>
        </div>
      </div>

      {/* Buttons (T054, T057, T058, T060) */}
      <div className={styles.buttonGroup}>
        {/* Submit button */}
        <button
          type="submit"
          className={`${styles.button} ${styles.submitButton}`}
          disabled={!messageText.trim()}
          aria-label="Guardar mensaje"
        >
          Guardar Mensaje
        </button>

        {/* Toggle button - only show if message is saved */}
        {savedMessage && (
          <button
            type="button"
            className={`${styles.button} ${styles.toggleButton}`}
            onClick={handleToggleDisplay}
            aria-label={isDisplaying ? 'Ocultar mensaje' : 'Mostrar mensaje'}
            aria-pressed={isDisplaying}
          >
            {isDisplaying ? 'Ocultar' : 'Mostrar'} Mensaje
          </button>
        )}
      </div>

      {/* Message display (T058, T067) */}
      {savedMessage && isDisplaying && (
        <MessageDisplay
          message={savedMessage}
          onClose={() => setIsDisplaying(false)}
          title="Tu Mensaje Especial ❤️"
        />
      )}
    </form>
  );
}
