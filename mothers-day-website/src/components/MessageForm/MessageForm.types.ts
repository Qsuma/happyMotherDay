/**
 * TypeScript interfaces for MessageForm component
 * 
 * Defines prop types for MessageForm and MessageDisplay components
 */

export interface MessageFormProps {
  /**
   * Optional: Initialize form with pre-filled message
   * Useful for persisting across component remounts
   */
  initialMessage?: string;

  /**
   * Optional: Callback fired when message text changes
   * Useful for parent component to track changes
   */
  onMessageChange?: (text: string) => void;

  /**
   * Optional: Custom CSS class to apply to root element
   */
  className?: string;

  /**
   * Optional: Max character count allowed (default: 500)
   */
  maxChars?: number;
}

export interface MessageDisplayProps {
  /**
   * The message text to display
   */
  message: string;

  /**
   * Callback fired when close/hide button is clicked
   */
  onClose: () => void;

  /**
   * Optional: Custom title for the message display section
   */
  title?: string;

  /**
   * Optional: Custom CSS class
   */
  className?: string;
}
