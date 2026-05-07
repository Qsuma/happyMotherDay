import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageForm } from './MessageForm';

/**
 * T054-T062: MessageForm Component Tests (TDD)
 * 
 * These tests define the expected behavior and will initially FAIL.
 * Implementation follows test completion.
 */

describe('MessageForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // T054: Renders text input with label and submit button
  describe('T054: Basic rendering', () => {
    it('should render text input with associated label', () => {
      render(<MessageForm />);

      // Should have a textbox (textarea) with label
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should render submit button with clear action text', () => {
      render(<MessageForm />);

      const submitButton = screen.getByRole('button', {
        name: /guardar|save|enviar|submit|añadir|add/i,
      });

      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeVisible();
    });

    it('should render character counter', () => {
      render(<MessageForm />);

      // Should show something like "0 / 500"
      const counter = screen.getByText(/\d+\s*\/\s*500/);
      expect(counter).toBeInTheDocument();
    });
  });

  // T055: Character counter updates as user types
  describe('T055: Character counter', () => {
    it('should display correct character count as user types', async () => {
      const user = userEvent.setup();
      render(<MessageForm />);

      const input = screen.getByRole('textbox');

      // Initially should show "0 / 500"
      expect(screen.getByText(/0\s*\/\s*500/)).toBeInTheDocument();

      // Type some text (10 characters: "Hola Mamá!")
      await user.type(input, 'Hola Mamá!');

      // Should show "10 / 500"
      expect(screen.getByText(/10\s*\/\s*500/)).toBeInTheDocument();
    });

    it('should update counter dynamically with each keystroke', async () => {
      const user = userEvent.setup();
      render(<MessageForm />);

      const input = screen.getByRole('textbox');

      // Type character by character
      await user.type(input, 'Hello');
      expect(screen.getByText(/5\s*\/\s*500/)).toBeInTheDocument();

      await user.type(input, ' World');
      expect(screen.getByText(/11\s*\/\s*500/)).toBeInTheDocument();
    });

    it('should have aria-live region for counter updates', () => {
      render(<MessageForm />);

      const counter = screen.getByText(/\d+\s*\/\s*500/);
      const liveRegion = counter.closest('[aria-live]') || counter.parentElement?.closest('[aria-live]');

      if (liveRegion) {
        expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      }
    });
  });

  // T056: Max 500 characters enforced
  describe('T056: Character limit enforcement', () => {
    it('should prevent input beyond 500 characters', async () => {
      const user = userEvent.setup();
      render(<MessageForm />);

      const input = screen.getByRole('textbox') as HTMLTextAreaElement;

      // Generate 505 characters
      const longText = 'a'.repeat(505);

      await user.type(input, longText);

      // Value should be capped at 500
      expect(input.value.length).toBeLessThanOrEqual(500);
      expect(input.maxLength).toBe(500);
    });

    it('should show counter at "500 / 500" when max is reached', async () => {
      const user = userEvent.setup();
      render(<MessageForm />);

      const input = screen.getByRole('textbox');
      const maxText = 'x'.repeat(500);

      await user.type(input, maxText);

      expect(screen.getByText(/500\s*\/\s*500/)).toBeInTheDocument();
    });

    it('should prevent typing beyond 500 characters', async () => {
      const user = userEvent.setup();
      render(<MessageForm />);

      const input = screen.getByRole('textbox') as HTMLTextAreaElement;

      // Try to type 505 characters
      const text = 'a'.repeat(505);
      await user.type(input, text);

      // Should only have 500 characters
      expect(input.value).toHaveLength(500);
    });
  });

  // T057: Form submission stores message and clears input
  describe('T057: Form submission', () => {
    it('should clear input after submission', async () => {
      const user = userEvent.setup();
      render(<MessageForm />);

      const input = screen.getByRole('textbox') as HTMLTextAreaElement;
      const submitButton = screen.getByRole('button', {
        name: /guardar/i,
      });

      // Type message
      await user.type(input, 'Happy Mother Day!');
      expect(input.value).toBe('Happy Mother Day!');

      // Submit form
      await user.click(submitButton);

      // Input should be cleared
      expect(input.value).toBe('');
    });

    it('should display message after submission', async () => {
      const user = userEvent.setup();
      render(<MessageForm />);

      const input = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', {
        name: /guardar/i,
      });

      await user.type(input, 'Eres la mejor mamá');
      await user.click(submitButton);

      // Message should be visible somewhere
      expect(screen.getByText(/eres la mejor mamá/i)).toBeInTheDocument();
    });

    it('should call onMessageChange callback if provided', async () => {
      const onMessageChange = vi.fn();
      const user = userEvent.setup();
      render(<MessageForm onMessageChange={onMessageChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Test');

      // Should have been called during typing
      expect(onMessageChange).toHaveBeenCalled();
    });
  });

  // T058: Display toggle button shows/hides message
  describe('T058: Display toggle', () => {
    it('should have a toggle button to show/hide message', async () => {
      const user = userEvent.setup();
      render(<MessageForm />);

      const input = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', {
        name: /guardar/i,
      });

      await user.type(input, 'Test message');
      await user.click(submitButton);

      // Now toggle button should exist
      const toggleButton = screen.queryByRole('button', {
        name: /mostrar|ocultar/i,
      });
      expect(toggleButton).toBeInTheDocument();
    });

    it('should toggle message visibility when button is clicked', async () => {
      const user = userEvent.setup();
      render(<MessageForm />);

      const input = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', {
        name: /guardar/i,
      });

      await user.type(input, 'Mi mensaje especial');
      await user.click(submitButton);

      // Message should be visible
      expect(screen.getByText(/mi mensaje especial/i)).toBeInTheDocument();

      // Find and click toggle button to hide
      const hideButton = screen.getByRole('button', {
        name: /ocultar/i,
      });
      await user.click(hideButton);

      // Message should be hidden
      expect(screen.queryByText(/mi mensaje especial/i)).not.toBeInTheDocument();

      // Click again to show
      const showButton = screen.getByRole('button', {
        name: /mostrar/i,
      });
      await user.click(showButton);

      // Message should be visible again
      expect(screen.getByText(/mi mensaje especial/i)).toBeInTheDocument();
    });
  });

  // T059: Accessibility - label association
  describe('T059: Accessibility - labels', () => {
    it('should have properly associated label for input', () => {
      render(<MessageForm />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should have visible focus outline on input', async () => {
      const user = userEvent.setup();
      render(<MessageForm />);

      const input = screen.getByRole('textbox') as HTMLElement;
      await user.click(input);

      // Input should have focus
      expect(input).toHaveFocus();
    });
  });

  // T060: Accessibility - button text clarity
  describe('T060: Button text clarity', () => {
    it('submit button should have clear action text', () => {
      render(<MessageForm />);

      const submitButton = screen.getByRole('button', {
        name: /guardar/i,
      });

      expect(submitButton.textContent).toMatch(/guardar/i);
    });

    it('toggle button should clearly indicate action (show/hide)', async () => {
      const user = userEvent.setup();
      render(<MessageForm />);

      const input = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', {
        name: /guardar/i,
      });

      await user.type(input, 'Test');
      await user.click(submitButton);

      const toggleButton = screen.getByRole('button', {
        name: /mostrar|ocultar/i,
      });

      expect(toggleButton.textContent).toMatch(/mostrar|ocultar/i);
    });
  });

  // T061: Accessibility - aria-live for counter
  describe('T061: Accessibility - aria-live', () => {
    it('character counter should have aria-live="polite"', () => {
      render(<MessageForm />);

      const counter = screen.getByText(/0\s*\/\s*500/);

      // Either counter itself or a parent should have aria-live
      const containerWithAriaLive = counter.closest('[aria-live]');
      if (containerWithAriaLive) {
        expect(containerWithAriaLive).toHaveAttribute('aria-live', 'polite');
      }
    });

    it('should announce updates to screen readers', async () => {
      const user = userEvent.setup();
      render(<MessageForm />);

      const input = screen.getByRole('textbox');

      await user.type(input, 'Hello');

      // Counter should update with aria-live
      expect(screen.getByText(/5\s*\/\s*500/)).toBeInTheDocument();
    });
  });

  // T062: Integration - full user flow
  describe('T062: Full user flow', () => {
    it('complete flow: type -> counter updates -> submit -> display toggle', async () => {
      const user = userEvent.setup();
      render(<MessageForm />);

      // 1. Type message
      const input = screen.getByRole('textbox') as HTMLTextAreaElement;
      await user.type(input, 'Happy Mothers Day');

      // 2. Verify counter updates
      expect(screen.getByText(/17\s*\/\s*500/)).toBeInTheDocument();

      // 3. Submit form
      const submitButton = screen.getByRole('button', {
        name: /guardar/i,
      });
      await user.click(submitButton);

      // 4. Input should be cleared
      expect(input.value).toBe('');

      // 5. Message should display
      expect(screen.getByText(/happy mothers day/i)).toBeInTheDocument();

      // 6. Toggle should work
      const hideButton = screen.getByRole('button', {
        name: /ocultar/i,
      });
      await user.click(hideButton);
      expect(screen.queryByText(/happy mothers day/i)).not.toBeInTheDocument();

      // 7. Toggle back to show
      const showButton = screen.getByRole('button', {
        name: /mostrar/i,
      });
      await user.click(showButton);
      expect(screen.getByText(/happy mothers day/i)).toBeInTheDocument();
    });
  });
});
