import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageDisplay } from './MessageDisplay';

/**
 * T059: MessageDisplay Component Tests
 * 
 * Tests for the message display subcomponent with close button
 */

describe('MessageDisplay Component', () => {
  const mockOnClose = vi.fn();

  it('should render saved message with title', () => {
    render(
      <MessageDisplay
        message="¡Eres la mejor mamá!"
        onClose={mockOnClose}
      />,
    );

    // Should have title
    const title = screen.getByText(/tu mensaje|your message|mensaje/i);
    expect(title).toBeInTheDocument();

    // Should display the message
    expect(screen.getByText(/eres la mejor mamá/i)).toBeInTheDocument();
  });

  it('should render close/hide button', () => {
    render(
      <MessageDisplay
        message="Test message"
        onClose={mockOnClose}
      />,
    );

    const closeButton = screen.getByRole('button', {
      name: /cerrar|close|ocultar|hide|x/i,
    });
    expect(closeButton).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MessageDisplay
        message="Test message"
        onClose={mockOnClose}
      />,
    );

    const closeButton = screen.getByRole('button', {
      name: /cerrar|close|ocultar|hide|x/i,
    });

    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should accept custom title prop', () => {
    render(
      <MessageDisplay
        message="My special message"
        onClose={mockOnClose}
        title="Mi Dedicatoria"
      />,
    );

    expect(screen.getByText(/mi dedicatoria/i)).toBeInTheDocument();
  });

  it('should have proper styling (container with border/background)', () => {
    const { container } = render(
      <MessageDisplay
        message="Styled message"
        onClose={mockOnClose}
      />,
    );

    // Should have a container with visible styling
    const displayContainer = container.querySelector('[class*="display"]') ||
      container.querySelector('[class*="message"]');
    expect(displayContainer).toBeInTheDocument();

    // Should be visible
    expect(displayContainer).toBeVisible();
  });

  it('should be accessible with proper ARIA attributes', () => {
    render(
      <MessageDisplay
        message="Accessible message"
        onClose={mockOnClose}
      />,
    );

    // Should have semantic structure
    const message = screen.getByText(/accessible message/i);
    expect(message).toBeInTheDocument();

    // Close button should be accessible
    const closeButton = screen.getByRole('button', {
      name: /cerrar|close|ocultar|hide|x/i,
    });
    expect(closeButton).toBeVisible();
  });

  it('should handle multiline messages', () => {
    const multilineMessage = 'Line 1\nLine 2\nLine 3';
    render(
      <MessageDisplay
        message={multilineMessage}
        onClose={mockOnClose}
      />,
    );

    // Message should be rendered (newlines preserved or replaced with spaces)
    const messageElement = screen.getByText(/line 1/i, { exact: false });
    expect(messageElement).toBeInTheDocument();
  });

  it('should handle long messages gracefully', () => {
    const longMessage = 'a'.repeat(500);
    render(
      <MessageDisplay
        message={longMessage}
        onClose={mockOnClose}
      />,
    );

    // Should display without breaking layout
    const container = screen.getByText(/aaaa/, { exact: false });
    expect(container).toBeInTheDocument();
  });

  it('should accept custom className', () => {
    const { container } = render(
      <MessageDisplay
        message="Test"
        onClose={mockOnClose}
        className="custom-class"
      />,
    );

    const element = container.firstChild;
    expect(element).toHaveClass('custom-class');
  });
});
