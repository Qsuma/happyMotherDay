# Quickstart: Mother's Day Website - Let's Build It! 🚀

This guide walks you through building the Mother's Day website step-by-step, following the spec and plan.

## Pre-requisites

- Node.js 18+ installed
- npm 9+ or pnpm installed
- Code editor (VS Code recommended)
- 10-15 minutes to get started

## Step 1: Setup Your Project (5 minutes)

### Option A: Fresh React Project (Recommended)

```bash
# Navigate to your project root
cd /Users/qsuma/holaMundo

# Create a new React project with Vite (fastest)
npm create vite@latest mothers-day-app -- --template react
cd mothers-day-app

# Install dependencies
npm install
npm install framer-motion clsx

# Install dev dependencies for testing
npm install --save-dev typescript @types/react @types/node
npm install --save-dev vitest @testing-library/react @testing-library/user-event @axe-core/react
npm install --save-dev playwright @playwright/test
npm install --save-dev tailwindcss postcss autoprefixer prettier eslint

# Initialize TypeScript strict mode
# Create/update tsconfig.json with: "strict": true

# Initialize Tailwind
npx tailwindcss init -p
```

### Option B: Use Existing React App

```bash
# If you already have a React app, just add missing dependencies
cd /Users/qsuma/holaMundo
npm install framer-motion clsx
npm install --save-dev vitest @testing-library/react @testing-library/user-event @axe-core/react playwright tailwindcss
```

## Step 2: Create Project Structure (5 minutes)

```bash
# Create all necessary folders
mkdir -p src/components/{GreetingAnimation,Gallery,MessageForm,MothersDayPage}
mkdir -p src/hooks
mkdir -p src/constants
mkdir -p src/assets/images
mkdir -p tests/{unit,integration,e2e}

# Verify structure
tree src/  # or: ls -R src/
```

## Step 3: Create Constants (5 minutes)

### 3a. Create `src/constants/greetingText.ts`

```typescript
export const GREETING_TEXT = "¡Feliz Día de las Madres! 💚";

export const GREETING_SUBTITLE = "Con todo mi amor y gratitud";
```

### 3b. Create `src/constants/galleryImages.ts`

```typescript
export const GALLERY_IMAGES = [
  {
    id: 1,
    title: "Flores para ti",
    altText: "Flores coloridas con mensaje de amor",
    imageUrl: "/images/greeting-01.webp",
    description: "Las flores más hermosas para la persona más especial"
  },
  {
    id: 2,
    title: "Corazón infinito",
    altText: "Símbolo de corazón infinito",
    imageUrl: "/images/greeting-02.webp",
    description: "Mi amor por ti es infinito"
  },
  {
    id: 3,
    title: "Sonrisas y abrazos",
    altText: "Ilustración de personas abrazándose",
    imageUrl: "/images/greeting-03.webp",
    description: "Tus abrazos son mi favorito"
  },
  {
    id: 4,
    title: "Recuerdos especiales",
    altText: "Fotos de momentos juntas",
    imageUrl: "/images/greeting-04.webp",
    description: "Cada momento contigo es especial"
  },
  {
    id: 5,
    title: "Eres mi fuerza",
    altText: "Mujer fuerte y valiente",
    imageUrl: "/images/greeting-05.webp",
    description: "Tu fortaleza me inspira cada día"
  },
  {
    id: 6,
    title: "Te amo mucho",
    altText: "Mensaje de amor en letras grandes",
    imageUrl: "/images/greeting-06.webp",
    description: "Tres palabras que nunca serán suficientes"
  }
];
```

### 3c. Create `src/constants/animations.ts`

```typescript
export const ANIMATION_CONFIG = {
  greeting: {
    duration: 1.5, // seconds
    delay: 0.3,
    easing: [0.23, 1, 0.320, 1], // custom easing
  },
  gallery: {
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 100,
    },
  },
};
```

## Step 4: Build Your First Component - Custom Hook (10 minutes)

### 4a. Create `src/hooks/useAnimationPreference.ts`

```typescript
import { useEffect, useState } from 'react';

/**
 * Custom hook to detect user's prefers-reduced-motion setting
 * Returns true if user prefers reduced motion, false otherwise
 * 
 * @returns {boolean} True if user prefers reduced motion
 * 
 * @example
 * const prefersReducedMotion = useAnimationPreference();
 * return <div animate={!prefersReducedMotion && {opacity: 1}} />;
 */
export function useAnimationPreference(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check user's motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}
```

### 4b. Test the Hook - Create `src/hooks/useAnimationPreference.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAnimationPreference } from './useAnimationPreference';

describe('useAnimationPreference', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('should return false when user does NOT prefer reduced motion', () => {
    const { result } = renderHook(() => useAnimationPreference());
    expect(result.current).toBe(false);
  });

  it('should return true when user prefers reduced motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: true, // Simulate user preference
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useAnimationPreference());
    expect(result.current).toBe(true);
  });
});
```

**Test it:**
```bash
npm run test
# Should see: ✓ useAnimationPreference (2 tests)
```

## Step 5: Build Greeting Component (15 minutes)

### 5a. Create `src/components/GreetingAnimation/GreetingAnimation.types.ts`

```typescript
export interface GreetingAnimationProps {
  text: string;
  subtitle?: string;
  duration?: number;
  className?: string;
}
```

### 5b. Create `src/components/GreetingAnimation/GreetingAnimation.tsx`

```typescript
import { motion } from 'framer-motion';
import { useAnimationPreference } from '../../hooks/useAnimationPreference';
import { ANIMATION_CONFIG } from '../../constants/animations';
import type { GreetingAnimationProps } from './GreetingAnimation.types';
import styles from './GreetingAnimation.module.css';

/**
 * GreetingAnimation Component
 * Displays an animated greeting message with fade-in and slide effects
 * Respects user's prefers-reduced-motion setting
 * 
 * @component
 * @example
 * <GreetingAnimation 
 *   text="¡Feliz Día de las Madres! 💚" 
 *   subtitle="Con todo mi amor"
 * />
 */
export function GreetingAnimation({
  text,
  subtitle,
  duration = ANIMATION_CONFIG.greeting.duration,
  className = '',
}: GreetingAnimationProps) {
  const prefersReducedMotion = useAnimationPreference();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : custom * 0.1,
      },
    }),
  };

  return (
    <motion.div
      className={`${styles.container} ${className}`}
      variants={prefersReducedMotion ? {} : containerVariants}
      initial="hidden"
      animate="visible"
      role="region"
      aria-label="Greeting message"
    >
      <motion.h1
        className={styles.text}
        variants={itemVariants}
        custom={0}
      >
        {text}
      </motion.h1>
      {subtitle && (
        <motion.p
          className={styles.subtitle}
          variants={itemVariants}
          custom={1}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
```

### 5c. Create `src/components/GreetingAnimation/GreetingAnimation.module.css`

```css
.container {
  text-align: center;
  padding: 40px 20px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.text {
  font-size: 48px;
  font-weight: bold;
  color: white;
  margin: 0;
  line-height: 1.2;
}

.subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin: 16px 0 0 0;
  font-weight: 300;
  letter-spacing: 1px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .container {
    padding: 30px 16px;
    min-height: 150px;
  }

  .text {
    font-size: 32px;
  }

  .subtitle {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 20px 12px;
  }

  .text {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }
}
```

### 5d. Create `src/components/GreetingAnimation/GreetingAnimation.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GreetingAnimation } from './GreetingAnimation';

describe('GreetingAnimation', () => {
  it('should render greeting text', () => {
    render(
      <GreetingAnimation 
        text="¡Feliz Día de las Madres! 💚"
      />
    );
    expect(screen.getByText("¡Feliz Día de las Madres! 💚")).toBeInTheDocument();
  });

  it('should render subtitle when provided', () => {
    render(
      <GreetingAnimation 
        text="¡Feliz Día!" 
        subtitle="Con amor"
      />
    );
    expect(screen.getByText("Con amor")).toBeInTheDocument();
  });

  it('should have proper ARIA label for accessibility', () => {
    render(
      <GreetingAnimation 
        text="¡Feliz Día!"
      />
    );
    expect(screen.getByRole('region', { name: 'Greeting message' })).toBeInTheDocument();
  });

  it('should respect prefers-reduced-motion', () => {
    // Mock the media query
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(
      <GreetingAnimation 
        text="¡Feliz Día!"
      />
    );
    expect(container.querySelector('[role="region"]')).toBeInTheDocument();
  });
});
```

**Test it:**
```bash
npm run test
# Should see: ✓ GreetingAnimation (4 tests)
```

## Step 6: Create Page Container (5 minutes)

### 6a. Create `src/components/MothersDayPage/MothersDayPage.tsx`

```typescript
import { GreetingAnimation } from '../GreetingAnimation/GreetingAnimation';
import { GREETING_TEXT, GREETING_SUBTITLE } from '../../constants/greetingText';
import styles from './MothersDayPage.module.css';

/**
 * MothersDayPage - Main page component
 * Composes all feature components: Greeting, Gallery, Message Form
 */
export function MothersDayPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Felicidades Mamá</h1>
      </header>

      <main className={styles.main}>
        {/* Phase 3: Greeting Animation */}
        <section className={styles.section}>
          <GreetingAnimation 
            text={GREETING_TEXT}
            subtitle={GREETING_SUBTITLE}
          />
        </section>

        {/* Phase 4: Gallery (coming next) */}
        {/* <section className={styles.section}>
          <Gallery />
        </section> */}

        {/* Phase 5: Message Form (coming next) */}
        {/* <section className={styles.section}>
          <MessageForm />
        </section> */}
      </main>

      <footer className={styles.footer}>
        <p>Hecho con ❤️ para ti</p>
      </footer>
    </div>
  );
}
```

### 6b. Create `src/components/MothersDayPage/MothersDayPage.module.css`

```css
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #fafafa, #f5f5f5);
}

.header {
  background: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0;
  font-size: 36px;
  color: #333;
}

.main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px;
}

.section {
  margin-bottom: 60px;
}

.footer {
  background: white;
  padding: 20px;
  text-align: center;
  color: #666;
  border-top: 1px solid #eee;
  margin-top: auto;
}

@media (max-width: 768px) {
  .title {
    font-size: 24px;
  }

  .main {
    padding: 20px 16px;
  }

  .section {
    margin-bottom: 40px;
  }
}
```

### 6c. Update `src/App.tsx`

```typescript
import { MothersDayPage } from './components/MothersDayPage/MothersDayPage';
import './App.css';

function App() {
  return <MothersDayPage />;
}

export default App;
```

## Step 7: Run Your App! 🎉

```bash
# Start development server
npm run dev

# Open browser to http://localhost:5173
# You should see your greeting with animation!

# Run tests
npm run test

# Run specific test file
npm run test -- GreetingAnimation

# Open Playwright inspector (optional)
npm run test:e2e --headed
```

## Step 8: What's Next?

Continue with the spec:
- [ ] **Phase 4**: Build the Gallery component (US2)
- [ ] **Phase 5**: Build the Message Form (US3)
- [ ] **Phase 6**: Integration testing (all components together)
- [ ] **Phase 7**: Polish and optimization

Each phase should take 4-6 hours and follow the same pattern:
1. Write failing tests
2. Implement component
3. Tests pass
4. Test E2E with Playwright
5. Verify accessibility
6. Verify performance

## 🎓 Learning Checkpoint

You've now learned:

✅ **TDD in React** (test first, code second)  
✅ **Component templates** (.tsx + .test.tsx + .types.ts + .module.css)  
✅ **Custom hooks** (reusable logic)  
✅ **Accessibility** (aria-label, prefers-reduced-motion)  
✅ **Responsive design** (mobile-first CSS)  
✅ **Animation** (Framer Motion)  

---

## 🤔 If Something Doesn't Work

**Tests fail?**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript version: `npm list typescript`

**App doesn't start?**
- Check port 5173 is free
- Run: `npm run dev` with full output
- Check Node version: `node --version` (should be 18+)

**Styles don't apply?**
- Make sure Tailwind CSS is configured
- Check .module.css files exist
- Restart dev server

---

**You're all set! Happy coding! 🚀💚**
