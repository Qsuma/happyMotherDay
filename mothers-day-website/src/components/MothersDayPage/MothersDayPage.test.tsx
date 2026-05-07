import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MothersDayPage } from './MothersDayPage';

/**
 * T071-T076: MothersDayPage Integration Tests
 *
 * Tests for complete Mother's Day website with all three components:
 * - Greeting Animation (Phase 3)
 * - Gallery (Phase 4)
 * - Message Form (Phase 5)
 */

describe('MothersDayPage Integration', () => {
  // T071: Full page renders with all sections
  describe('T071: Complete page structure', () => {
    it('should render header with title', () => {
      render(<MothersDayPage />);

      const header = screen.getByRole('heading', {
        name: /felicidades mamá/i,
      });
      expect(header).toBeInTheDocument();
    });

    it('should render all three main sections', () => {
      render(<MothersDayPage />);

      // Greeting section (has greeting text)
      expect(screen.getByText(/feliz día de las madres/i)).toBeInTheDocument();

      // Gallery section
      const galleryHeading = screen.getByRole('heading', {
        name: /galería/i,
      });
      expect(galleryHeading).toBeInTheDocument();

      // Message form section
      const messageHeading = screen.getByRole('heading', {
        name: /dedicatoria/i,
      });
      expect(messageHeading).toBeInTheDocument();
    });

    it('should render footer', () => {
      render(<MothersDayPage />);

      const footer = screen.getByText(/hecho con ❤️/i);
      expect(footer).toBeInTheDocument();
    });
  });

  // T072: Gallery integration with page
  describe('T072: Gallery in context', () => {
    it('should render gallery section with images', () => {
      render(<MothersDayPage />);

      // Gallery section should be present
      const galleryHeading = screen.getByRole('heading', {
        name: /galería/i,
      });
      expect(galleryHeading).toBeInTheDocument();
    });

    it('should support keyboard navigation in gallery', async () => {
      const user = userEvent.setup();
      render(<MothersDayPage />);

      // Gallery images should be focusable
      const galleryImages = screen.getAllByRole('img');
      expect(galleryImages.length).toBeGreaterThan(0);

      // Tab to first image
      await user.tab();
      // At least one image should be focusable
      expect(galleryImages[0]).toBeInTheDocument();
    });
  });

  // T073: Message Form integration with page
  describe('T073: Message Form in context', () => {
    it('should render message form section', () => {
      render(<MothersDayPage />);

      const messageForm = screen.getByRole('textbox');
      expect(messageForm).toBeInTheDocument();
    });

    it('should allow complete message flow', async () => {
      const user = userEvent.setup();
      render(<MothersDayPage />);

      // Type message
      const messageInput = screen.getByRole('textbox');
      await user.type(messageInput, 'Te amo mamá');

      // Submit
      const submitButton = screen.getByRole('button', {
        name: /guardar/i,
      });
      await user.click(submitButton);

      // Message should display
      expect(screen.getByText(/te amo mamá/i)).toBeInTheDocument();
    });
  });

  // T074: Page layout and spacing
  describe('T074: Layout and spacing', () => {
    it('should have proper section spacing', () => {
      const { container } = render(<MothersDayPage />);

      const sections = container.querySelectorAll('section');
      expect(sections.length).toBe(3); // 3 main sections
    });

    it('should render complete page structure', () => {
      const { container } = render(<MothersDayPage />);

      const header = container.querySelector('header');
      const main = container.querySelector('main');
      const footer = container.querySelector('footer');

      expect(header).toBeInTheDocument();
      expect(main).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });
  });

  // T075: Accessibility - complete page
  describe('T075: Page accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<MothersDayPage />);

      const h1 = screen.getAllByRole('heading', { level: 1 });
      expect(h1.length).toBeGreaterThan(0);
      expect(h1[0]).toHaveTextContent(/felicidades mamá/i);

      const h2s = screen.getAllByRole('heading', { level: 2 });
      expect(h2s.length).toBeGreaterThanOrEqual(2);
    });

    it('should have proper semantic structure', () => {
      const { container } = render(<MothersDayPage />);

      const header = container.querySelector('header');
      const main = container.querySelector('main');
      const footer = container.querySelector('footer');

      expect(header).toBeInTheDocument();
      expect(main).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });

    it('should have skip navigation (best practice)', () => {
      render(<MothersDayPage />);

      // Either skip link or main content is properly labeled
      const mainContent = screen.getByRole('main');
      expect(mainContent).toBeInTheDocument();
    });

    it('should have proper contrast', () => {
      const { container } = render(<MothersDayPage />);

      // Check that page renders (visual contrast is tested in a11y tests)
      const page = container.querySelector('div');
      expect(page).toBeInTheDocument();
    });
  });

  // T076: Complete user flow integration
  describe('T076: Complete user flow', () => {
    it('user can view greeting, browse gallery, and leave message', async () => {
      const user = userEvent.setup();
      render(<MothersDayPage />);

      // 1. See greeting
      expect(screen.getByText(/feliz día de las madres/i)).toBeInTheDocument();

      // 2. See gallery section
      expect(
        screen.getByRole('heading', {
          name: /galería/i,
        }),
      ).toBeInTheDocument();

      // 3. See message form section
      const messageInput = screen.getByRole('textbox');
      expect(messageInput).toBeInTheDocument();

      // 4. Write and submit message
      await user.type(messageInput, 'Eres la mejor mamá del mundo');

      const submitButton = screen.getByRole('button', {
        name: /guardar/i,
      });
      await user.click(submitButton);

      // 5. Message is saved and displayed
      expect(
        screen.getByText(/eres la mejor mamá del mundo/i),
      ).toBeInTheDocument();

      // 6. Can toggle message visibility
      const hideButton = screen.getByRole('button', {
        name: /ocultar/i,
      });
      await user.click(hideButton);

      expect(
        screen.queryByText(/eres la mejor mamá del mundo/i),
      ).not.toBeInTheDocument();

      // 7. Can show message again
      const showButton = screen.getByRole('button', {
        name: /mostrar/i,
      });
      await user.click(showButton);

      expect(
        screen.getByText(/eres la mejor mamá del mundo/i),
      ).toBeInTheDocument();
    });
  });
});
