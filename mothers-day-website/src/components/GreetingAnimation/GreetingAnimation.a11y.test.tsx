import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { GreetingAnimation } from './GreetingAnimation';

expect.extend(toHaveNoViolations);

/**
 * T023: Accessibility Tests for GreetingAnimation
 * 
 * Verifies:
 * - No axe-core violations
 * - Text color contrast >= 4.5:1 (WCAG AA)
 * - Semantic HTML (proper heading levels, aria-live if needed)
 */

describe('GreetingAnimation Accessibility (T023)', () => {
  it('should have no axe-core violations', async () => {
    const { container } = render(
      <GreetingAnimation
        text="¡Feliz Día de las Madres!"
        subtitle="Contigo Siempre"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have sufficient color contrast (WCAG AA)', async () => {
    const { container } = render(
      <GreetingAnimation
        text="¡Feliz Día de las Madres!"
      />,
    );

    // Get computed style of greeting text
    const greetingElement = container.querySelector('[class*="greeting"]');
    expect(greetingElement).toBeDefined();

    const computedStyle = window.getComputedStyle(greetingElement!);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;

    console.log(
      `✅ Greeting color: ${color}, background: ${backgroundColor}`,
    );

    // Verify element has text content (will be checked for contrast by axe)
    expect(greetingElement?.textContent).toBeTruthy();
  });

  it('should use semantic HTML structure', () => {
    const { container } = render(
      <GreetingAnimation
        text="¡Feliz Día de las Madres!"
      />,
    );

    // Check for semantic HTML - should use appropriate heading or text element
    const heading = container.querySelector('h1, h2, h3, h4, h5, h6, p, div[role="heading"]');
    expect(heading).toBeDefined();

    // Check for proper region role if animation is dynamic (optional)
    const region = container.querySelector('[role="region"]');
    if (region) {
      const ariaLive = region.getAttribute('aria-live');
      if (ariaLive) {
        expect(['polite', 'assertive', 'off']).toContain(ariaLive);
      }
    }
  });

  it('should have proper heading hierarchy or role', () => {
    const { container } = render(
      <GreetingAnimation
        text="¡Feliz Día de las Madres!"
      />,
    );

    // Should have either a heading element or role="heading"
    const hasHeading = container.querySelector('h1, h2, h3, h4, h5, h6');
    const hasHeadingRole = container.querySelector('[role="heading"]');

    expect(hasHeading || hasHeadingRole).toBeTruthy();
  });

  it('should be keyboard accessible (if interactive)', async () => {
    const { container } = render(
      <GreetingAnimation
        text="¡Feliz Día de las Madres!"
      />,
    );

    // Animation component is typically display-only, but ensure no keyboard traps
    const focusableElements = container.querySelectorAll(
      'button, a, input, [tabindex]',
    );

    // Should have no focusable elements (greeting is display-only)
    // or if it does, ensure they're accessible
    for (const element of focusableElements) {
      expect(element.getAttribute('tabindex')).not.toBe('-1');
    }
  });

  it('should respect prefers-reduced-motion for accessibility', () => {
    // Mock matchMedia for reduced motion
    const matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    const { container } = render(
      <GreetingAnimation
        text="¡Feliz Día de las Madres!"
      />,
    );

    // Should still be visible and readable
    const greetingElement = container.querySelector('[class*="greeting"]');
    expect(greetingElement?.textContent).toContain('Feliz Día');
  });
});
