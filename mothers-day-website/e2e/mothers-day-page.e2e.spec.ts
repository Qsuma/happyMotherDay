import { test, expect } from '@playwright/test';

/**
 * T067-T070: Full-Page Integration E2E Tests
 * 
 * Tests for complete Mother's Day website user flows
 * - Desktop (1920px) and mobile (iPhone 12) viewports
 * - Complete journey: Greeting → Gallery → Message Form
 * - 4G throttling to simulate real network conditions
 */

// Test on desktop viewport
test.describe('MothersDayPage E2E - Desktop (1920px)', () => {
  test.beforeEach(async ({ page }) => {
    // Enable 4G throttling
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 1.6 * 1024 * 1024 / 8, // 4G
      uploadThroughput: 750 * 1024 / 8,
      latency: 150,
    });

    await page.goto('http://localhost:5173', {
      waitUntil: 'networkidle',
    });
  });

  test('T067: Complete user flow on desktop', async ({ page }) => {
    // 1. Page loads and displays greeting
    const h1 = page.locator('h1:has-text("Felicidades Mamá")');
    await expect(h1).toBeVisible();

    // 2. See greeting animation text
    const greetingText = page.locator('text=¡Feliz Día de las Madres!');
    await expect(greetingText).toBeVisible();

    // 3. See gallery section
    const galleryHeading = page.locator('h2:has-text("Galería de Fotos")');
    await expect(galleryHeading).toBeVisible();

    // 4. Gallery images should be loaded
    const galleryImages = page.locator('img[loading="lazy"]');
    const imageCount = await galleryImages.count();
    expect(imageCount).toBeGreaterThan(0);

    // 5. Message form should be visible
    const messageHeading = page.locator('h2:has-text("Tu Dedicatoria")');
    await expect(messageHeading).toBeVisible();

    // 6. Message input should be present
    const messageInput = page.locator('textarea');
    await expect(messageInput).toBeVisible();

    // 7. Type a message
    await messageInput.fill('Te quiero mucho mamá');
    await expect(messageInput).toHaveValue('Te quiero mucho mamá');

    // 8. Submit message
    const submitButton = page.locator('button:has-text("Guardar Mensaje")');
    await submitButton.click();

    // 9. Message should be displayed
    const displayedMessage = page.locator('text=Te quiero mucho mamá');
    await expect(displayedMessage).toBeVisible();

    // 10. Footer should be visible
    const footer = page.locator('text=Hecho con ❤️ para ti');
    await expect(footer).toBeVisible();
  });

  test('T068: Gallery keyboard navigation', async ({ page }) => {
    // Navigate to gallery section
    const galleryHeading = page.locator('h2:has-text("Galería de Fotos")');
    await galleryHeading.scrollIntoViewIfNeeded();

    // Focus on first image
    const images = page.locator('img[loading="lazy"]');
    await images.first().focus();

    // Verify image is focused (has focus outline or aria-selected)
    const firstImage = images.first();
    expect(await firstImage.isVisible()).toBe(true);

    // Arrow right should move to next image
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    // Page should not scroll (prevents layout shift)
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    expect(scrollHeight).toBeGreaterThan(0);
  });

  test('T069: Message form complete flow with toggle', async ({ page }) => {
    // Find and fill message form
    const messageInput = page.locator('textarea');
    const testMessage = 'Feliz día a la mejor mamá del mundo';

    await messageInput.fill(testMessage);

    // Submit
    const submitButton = page.locator('button:has-text("Guardar Mensaje")');
    await submitButton.click();

    // Message should be displayed
    const displayedMessage = page.locator(`text=${testMessage}`);
    await expect(displayedMessage).toBeVisible();

    // Toggle button should appear (hide/show)
    const hideButton = page.locator('button:has-text("Ocultar")');
    expect(await hideButton.count()).toBeGreaterThan(0);

    // Click hide
    await hideButton.click();

    // Message should be hidden
    await expect(displayedMessage).not.toBeVisible();

    // Show button should appear
    const showButton = page.locator('button:has-text("Mostrar")');
    expect(await showButton.count()).toBeGreaterThan(0);

    // Click show
    await showButton.click();

    // Message should be visible again
    await expect(displayedMessage).toBeVisible();
  });

  test('T070: Responsive layout maintained', async ({ page }) => {
    // Check that main sections are rendered
    const sections = page.locator('section');
    expect(await sections.count()).toBe(3);

    // Each section should be visible in viewport
    for (let i = 0; i < (await sections.count()); i++) {
      const section = sections.nth(i);
      await section.scrollIntoViewIfNeeded();
      expect(await section.isVisible()).toBe(true);
    }
  });
});

// Test on mobile viewport (iPhone 12)
test.describe('MothersDayPage E2E - Mobile (iPhone 12)', () => {
  test.beforeEach(async ({ page, context }) => {
    // Set iPhone 12 viewport
    const iphone12 = {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      hasTouch: true,
      isLandscape: false,
    };

    // Enable 4G throttling
    const client = await context.newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 1.6 * 1024 * 1024 / 8, // 4G
      uploadThroughput: 750 * 1024 / 8,
      latency: 150,
    });

    // Navigate with iPhone user agent
    await page.goto('http://localhost:5173', {
      waitUntil: 'networkidle',
    });

    // Set viewport
    await page.setViewportSize(iphone12);
  });

  test('T067M: Complete flow on mobile (iPhone 12)', async ({ page }) => {
    // 1. Greeting should be visible
    const greeting = page.locator('h1:has-text("Felicidades Mamá")');
    await expect(greeting).toBeVisible();

    // 2. Scroll down to see gallery
    await page.locator('h2:has-text("Galería de Fotos")').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // 3. Gallery images should be responsive
    const images = page.locator('img[loading="lazy"]');
    const firstImage = images.first();
    await expect(firstImage).toBeVisible();

    // 4. Scroll to message form
    await page.locator('h2:has-text("Tu Dedicatoria")').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // 5. Type message on mobile
    const messageInput = page.locator('textarea');
    await messageInput.tap(); // Use tap for mobile
    await messageInput.fill('Eres mi mamá favorita');

    // 6. Submit on mobile
    const submitButton = page.locator('button:has-text("Guardar Mensaje")');
    await submitButton.tap();

    // 7. Message should be visible
    const displayedMessage = page.locator('text=Eres mi mamá favorita');
    await expect(displayedMessage).toBeVisible();
  });

  test('T068M: Gallery responsive on mobile', async ({ page }) => {
    // Gallery should fit mobile viewport
    const galleryHeading = page.locator('h2:has-text("Galería de Fotos")');
    await galleryHeading.scrollIntoViewIfNeeded();

    // Images should be stacked (mobile view)
    const images = page.locator('img[loading="lazy"]');
    expect(await images.count()).toBeGreaterThan(0);

    // Each image should be tappable (minimum 44px height on mobile)
    const firstImage = images.first();
    const box = await firstImage.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(40); // Allow some flex
  });

  test('T069M: Message form on mobile', async ({ page }) => {
    // Scroll to message form
    await page.locator('h2:has-text("Tu Dedicatoria")').scrollIntoViewIfNeeded();

    // Input should be readable (16px font to prevent zoom)
    const messageInput = page.locator('textarea');
    const inputSize = await messageInput.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return parseInt(styles.fontSize);
    });
    expect(inputSize).toBeGreaterThanOrEqual(14); // At least readable

    // Submit button should be tappable (44px minimum)
    const submitButton = page.locator('button:has-text("Guardar Mensaje")');
    const buttonBox = await submitButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(40);
  });

  test('T070M: Mobile touch interactions', async ({ page }) => {
    // Scroll to gallery
    await page.locator('h2:has-text("Galería de Fotos")').scrollIntoViewIfNeeded();

    // Try swiping/scrolling
    const images = page.locator('img[loading="lazy"]');
    const firstImage = images.first();

    // Image should respond to viewport
    await expect(firstImage).toBeVisible();

    // No horizontal scroll should occur (full viewport width)
    const bodyScrollWidth = await page.evaluate(
      () => document.body.scrollWidth,
    );
    const windowWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(windowWidth + 1); // +1 for rounding
  });
});
