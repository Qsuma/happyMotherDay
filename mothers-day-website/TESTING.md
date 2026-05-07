# Testing Guide

## Test Architecture

The project uses a comprehensive testing strategy with multiple levels of test coverage:

1. **Unit Tests** - Individual components and functions
2. **Integration Tests** - Multiple components working together
3. **E2E Tests** - Complete user workflows
4. **Accessibility Tests** - WCAG 2.1 AA compliance

## Testing Stack

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit & integration test runner |
| **React Testing Library** | Component testing utilities |
| **Playwright** | E2E browser testing |
| **axe-core + jest-axe** | Accessibility auditing |
| **jsdom** | DOM simulation in Node.js |

## Running Tests

### All Tests
```bash
npm run test              # Run all tests once
npm run test:watch       # Run in watch mode
npm run test -- --coverage  # With coverage report
```

### Specific Test Files
```bash
# Run specific component tests
npm run test src/components/GreetingAnimation

# Run E2E tests
npm run test:e2e

# Run with specific reporter
npm run test -- --reporter=verbose
```

### E2E Tests
```bash
npm run test:e2e          # Run all E2E tests
npm run test:e2e -- gallery  # Run specific E2E suite
```

## Unit Tests

### Test File Structure

Location: `src/components/ComponentName/ComponentName.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render with correct text', () => {
    render(<ComponentName text="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<ComponentName />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Testing Best Practices

#### 1. Query Priority (React Testing Library)

Use queries in this order:

```typescript
// ✅ BEST - By role (most accessible)
screen.getByRole('button', { name: /submit/i })

// ✅ GOOD - By label text
screen.getByLabelText('Username')

// ✅ ACCEPTABLE - By text
screen.getByText('Hello World')

// ❌ AVOID - By test ID (implementation detail)
screen.getByTestId('submit-button')
```

#### 2. User Events

Always use `userEvent` instead of `fireEvent`:

```typescript
// ✅ CORRECT - Simulates real user interaction
const user = userEvent.setup();
await user.type(input, 'hello');
await user.click(button);

// ❌ WRONG - Doesn't simulate real events
fireEvent.change(input, { target: { value: 'hello' } });
fireEvent.click(button);
```

#### 3. Async Handling

Use `waitFor` for asynchronous updates:

```typescript
// ✅ CORRECT
await waitFor(() => {
  expect(screen.getByText('Loading complete')).toBeInTheDocument();
});

// ❌ WRONG - May fail due to timing
await new Promise(resolve => setTimeout(resolve, 1000));
expect(screen.getByText('Loading complete')).toBeInTheDocument();
```

### Component Test Examples

#### GreetingAnimation Tests

```typescript
describe('GreetingAnimation', () => {
  it('should render greeting text', () => {
    render(<GreetingAnimation text="Happy Day!" />);
    expect(screen.getByText('Happy Day!')).toBeInTheDocument();
  });

  it('should apply animation class when reduced motion is not set', () => {
    const { container } = render(<GreetingAnimation text="Hello" />);
    expect(container.querySelector('.animated')).toBeInTheDocument();
  });

  it('should respect prefers-reduced-motion', () => {
    // Mock matchMedia
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { container } = render(<GreetingAnimation text="Hello" />);
    expect(container.querySelector('.noAnimation')).toBeInTheDocument();
  });

  it('should be responsive on mobile', () => {
    render(<GreetingAnimation text="Hello" />);
    // Render in 320px viewport
    expect(screen.getByText('Hello')).toBeVisible();
  });
});
```

#### Gallery Tests

```typescript
describe('Gallery', () => {
  const mockImages = [
    { id: 1, url: '/img1.jpg', alt: 'Image 1' },
    { id: 2, url: '/img2.jpg', alt: 'Image 2' },
  ];

  it('should render all images', () => {
    render(<Gallery images={mockImages} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(mockImages.length);
  });

  it('should navigate with arrow keys', async () => {
    const user = userEvent.setup();
    const { container } = render(<Gallery images={mockImages} />);
    
    const firstImage = container.querySelector('img');
    firstImage?.focus();
    
    await user.keyboard('{ArrowRight}');
    expect(container.querySelector('[aria-selected="true"]')).toBeInTheDocument();
  });

  it('should apply lazy loading attribute', () => {
    render(<Gallery images={mockImages} />);
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('loading', 'lazy');
    });
  });
});
```

#### MessageForm Tests

```typescript
describe('MessageForm', () => {
  it('should limit input to 500 characters', async () => {
    const user = userEvent.setup();
    render(<MessageForm maxChars={500} />);
    
    const input = screen.getByRole('textbox');
    const longText = 'a'.repeat(600);
    
    await user.type(input, longText);
    expect(input).toHaveValue('a'.repeat(500));
  });

  it('should update counter in real-time', async () => {
    const user = userEvent.setup();
    render(<MessageForm />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello');
    
    expect(screen.getByText(/5 \/ 500/)).toBeInTheDocument();
  });

  it('should save message on submit', async () => {
    const user = userEvent.setup();
    render(<MessageForm />);
    
    await user.type(screen.getByRole('textbox'), 'My message');
    await user.click(screen.getByRole('button', { name: /save/i }));
    
    expect(screen.getByText('My message')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });
});
```

## Integration Tests

### Full Page Integration

Location: `src/components/MothersDayPage/MothersDayPage.test.tsx`

```typescript
describe('MothersDayPage Integration', () => {
  it('should render all sections in correct order', () => {
    render(<MothersDayPage />);
    
    const sections = screen.getAllByRole('region');
    expect(sections[0]).toHaveTextContent('Greeting');
    expect(sections[1]).toHaveTextContent('Gallery');
    expect(sections[2]).toHaveTextContent('Message');
  });

  it('should support complete user flow', async () => {
    const user = userEvent.setup();
    render(<MothersDayPage />);
    
    // User sees greeting
    expect(screen.getByText(/greeting/i)).toBeInTheDocument();
    
    // User navigates gallery
    await user.keyboard('{ArrowRight}');
    
    // User writes message
    await user.type(screen.getByRole('textbox'), 'Hello Mom');
    await user.click(screen.getByRole('button', { name: /save/i }));
    
    // Message displays
    expect(screen.getByText('Hello Mom')).toBeInTheDocument();
  });
});
```

## Accessibility Tests

### Using axe-core

Location: `src/components/ComponentName/ComponentName.a11y.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ComponentName } from './ComponentName';

expect.extend(toHaveNoViolations);

describe('ComponentName Accessibility', () => {
  it('should have zero accessibility violations', async () => {
    const { container } = render(<ComponentName />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper color contrast', async () => {
    const { container } = render(<ComponentName />);
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });

    const violations = results.violations.filter(v => v.id === 'color-contrast');
    expect(violations).toHaveLength(0);
  });

  it('should have proper heading hierarchy', async () => {
    const { container } = render(<ComponentName />);
    const results = await axe(container, {
      rules: {
        'heading-order': { enabled: true },
      },
    });

    expect(results.violations).toHaveLength(0);
  });
});
```

### WCAG 2.1 AA Checklist

Tests verify:
- ✅ Color contrast ≥ 4.5:1 for normal text
- ✅ Color contrast ≥ 3:1 for large text
- ✅ Focus indicators visible (3px minimum)
- ✅ Keyboard navigation working
- ✅ Form labels associated with inputs
- ✅ Button and link text descriptive
- ✅ Images have alt text
- ✅ No color used alone to convey information
- ✅ Motion animations respect `prefers-reduced-motion`

## E2E Tests

### Playwright Configuration

File: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

#### Greeting Animation E2E

```typescript
import { test, expect } from '@playwright/test';

test('user sees greeting on page load', async ({ page }) => {
  await page.goto('/');
  
  const greeting = page.locator('text=¡Feliz Día de las Madres!');
  await expect(greeting).toBeVisible({ timeout: 3000 });
  
  // Animation should complete in < 2 seconds
  const startTime = Date.now();
  await greeting.evaluate((el) => {
    return new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
  });
  const duration = Date.now() - startTime;
  expect(duration).toBeLessThan(2100);
});

test('respects prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  
  const greeting = page.locator('text=¡Feliz Día de las Madres!');
  // Should appear immediately without animation
  await expect(greeting).toBeVisible({ timeout: 500 });
});
```

#### Gallery E2E

```typescript
test('user navigates gallery with arrow keys', async ({ page }) => {
  await page.goto('/');
  
  const firstImage = page.locator('img').first();
  await firstImage.focus();
  
  // Press right arrow
  await page.keyboard.press('ArrowRight');
  
  // Gallery should update
  const secondImage = page.locator('img').nth(1);
  await expect(secondImage).toBeFocused();
  
  // Page should not scroll
  const scrollPos = await page.evaluate(() => window.scrollY);
  expect(scrollPos).toBe(0);
});

test('works on mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12
  await page.goto('/');
  
  const gallery = page.locator('section').filter({ hasText: 'Gallery' });
  await expect(gallery).toBeVisible();
  
  // Gallery should be responsive
  const grid = page.locator('[role="grid"]');
  const boundingBox = await grid.boundingBox();
  expect(boundingBox?.width).toBeLessThanOrEqual(390);
});
```

#### Message Form E2E

```typescript
test('complete message form flow', async ({ page }) => {
  await page.goto('/');
  
  const input = page.getByRole('textbox');
  await input.fill('Te amo mamá');
  
  // Counter should update
  await expect(page.locator('text=/11 \\/ 500/')).toBeVisible();
  
  // Submit
  await page.getByRole('button', { name: /save/i }).click();
  
  // Message should display
  await expect(page.locator('text=Te amo mamá')).toBeVisible();
  
  // Toggle hide/show
  await page.getByRole('button', { name: /hide/i }).click();
  await expect(page.locator('text=Te amo mamá')).not.toBeVisible();
  
  await page.getByRole('button', { name: /show/i }).click();
  await expect(page.locator('text=Te amo mamá')).toBeVisible();
});
```

## Test Coverage Targets

| Component | Unit | Integration | E2E | A11y | Total |
|-----------|------|-------------|-----|------|-------|
| GreetingAnimation | 6 | - | 2 | 6 | 14 |
| Gallery | 9 | - | 3 | 9 | 21 |
| MessageForm | 21 | - | 2 | 6 | 29 |
| MothersDayPage | - | 14 | 4 | 10 | 28 |
| **Totals** | **36** | **14** | **11** | **31** | **92+** |

**Coverage Target**: 90%+ overall, 100% for critical paths

## Debugging Tests

### Debug Output

```bash
# See detailed test output
npm run test -- --reporter=verbose

# Print debug info in test
import { debug } from '@testing-library/react';
const { debug } = render(<Component />);
debug(); // Prints DOM to console
```

### Debugging E2E

```bash
# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test
npx playwright test gallery.e2e.spec.ts

# Debug mode (interactive)
npx playwright test --debug
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Test fails intermittently | Add `waitFor` for async updates |
| "Element not in viewport" | Use `scrollIntoViewIfNeeded()` |
| Focus-related failures | Mock `matchMedia` for motion preferences |
| Image loading timeouts | Use `loading="lazy"` and appropriate waits |
| Keyboard nav not working | Ensure elements are focusable (tabindex or semantic) |

## Continuous Integration

GitHub Actions configuration (example):

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run test:e2e
```

## Test Documentation Standards

Each test file should include:
- Clear test descriptions
- Setup/teardown comments where needed
- Expected behavior documented
- Links to related requirements

```typescript
/**
 * T019: GreetingAnimation Component Tests
 * 
 * Tests for User Story 1 (US1) - Animated Greeting
 * Verifies rendering, animations, and accessibility
 * 
 * @see spec.md line: animated greeting
 * @see ARCHITECTURE.md section: GreetingAnimation
 */
describe('GreetingAnimation (T019)', () => {
  // Tests here...
});
```
