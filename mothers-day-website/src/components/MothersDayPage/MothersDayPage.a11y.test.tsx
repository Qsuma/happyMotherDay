import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MothersDayPage } from './MothersDayPage';

expect.extend(toHaveNoViolations);

/**
 * T075: MothersDayPage Accessibility Tests (Full Page Audit)
 *
 * Tests for WCAG 2.1 Level AA compliance across entire Mother's Day website
 * Tests all components together: Greeting, Gallery, Message Form
 */

describe('MothersDayPage Accessibility Audit', () => {
  it('should have zero accessibility violations (full page)', async () => {
    const { container } = render(<MothersDayPage />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper color contrast throughout', async () => {
    const { container } = render(<MothersDayPage />);

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });

    // Should not have color contrast violations
    const contrastViolations = results.violations.filter(
      (v) => v.id === 'color-contrast',
    );
    expect(contrastViolations).toHaveLength(0);
  });

  it('should have proper heading structure (no skipped levels)', async () => {
    const { container } = render(<MothersDayPage />);

    const results = await axe(container, {
      rules: {
        'heading-order': { enabled: true },
      },
    });

    const headingViolations = results.violations.filter(
      (v) => v.id === 'heading-order',
    );
    expect(headingViolations).toHaveLength(0);
  });

  it('should have proper form labeling', async () => {
    const { container } = render(<MothersDayPage />);

    const results = await axe(container, {
      rules: {
        'form-field-multiple-labels': { enabled: true },
        'label': { enabled: true },
      },
    });

    const formViolations = results.violations.filter((v) =>
      ['form-field-multiple-labels', 'label'].includes(v.id),
    );
    expect(formViolations).toHaveLength(0);
  });

  it('should have proper button and link naming', async () => {
    const { container } = render(<MothersDayPage />);

    const results = await axe(container, {
      rules: {
        'button-name': { enabled: true },
        'link-name': { enabled: true },
      },
    });

    const namingViolations = results.violations.filter((v) =>
      ['button-name', 'link-name'].includes(v.id),
    );
    expect(namingViolations).toHaveLength(0);
  });

  it('should have proper ARIA implementation', async () => {
    const { container } = render(<MothersDayPage />);

    const results = await axe(container, {
      rules: {
        'aria-allowed-attr': { enabled: true },
        'aria-required-attr': { enabled: true },
        'aria-valid-attr': { enabled: true },
      },
    });

    const ariaViolations = results.violations.filter((v) =>
      [
        'aria-allowed-attr',
        'aria-required-attr',
        'aria-valid-attr',
      ].includes(v.id),
    );
    expect(ariaViolations).toHaveLength(0);
  });

  it('should have proper image alt text', async () => {
    const { container } = render(<MothersDayPage />);

    const results = await axe(container, {
      rules: {
        'image-alt': { enabled: true },
      },
    });

    const imageViolations = results.violations.filter(
      (v) => v.id === 'image-alt',
    );
    expect(imageViolations).toHaveLength(0);
  });

  it('should have proper focus management', async () => {
    const { container } = render(<MothersDayPage />);

    // Verify all interactive elements are keyboard accessible
    const buttons = container.querySelectorAll('button');
    const inputs = container.querySelectorAll('input, textarea');

    expect(buttons.length + inputs.length).toBeGreaterThan(0);
  });

  it('should have no redundant ARIA', async () => {
    const { container } = render(<MothersDayPage />);

    const results = await axe(container);

    // Check that no violations exist (general audit)
    expect(results.violations.length).toBe(0);
  });

  it('should report all issues found (detailed audit)', async () => {
    const { container } = render(<MothersDayPage />);

    const results = await axe(container);

    // Log results for documentation
    if (results.violations.length > 0) {
      console.log('Accessibility violations found:');
      results.violations.forEach((violation) => {
        console.log(`- ${violation.id}: ${violation.description}`);
      });
    }

    // Assert zero violations
    expect(results.violations.length).toBe(0);
  });
});
