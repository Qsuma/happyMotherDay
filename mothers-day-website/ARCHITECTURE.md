# Architecture Guide

## Component Hierarchy

```
MothersDayPage (root container)
├── Header
├── Main
│   ├── GreetingAnimation (US1)
│   ├── Gallery (US2)
│   │   ├── GalleryImage (repeated)
│   │   └── Gallery controls
│   └── MessageForm (US3)
│       └── MessageDisplay (conditional)
└── Footer
```

## Components Overview

### 1. GreetingAnimation (US1)

**Purpose**: Display animated greeting on page load

**Location**: `src/components/GreetingAnimation/`

**Key Features**:
- CSS-based fade-in and slide animations
- Respects `prefers-reduced-motion` via `useAnimationPreference` hook
- Responsive typography (24px mobile → 48px desktop)
- No dependencies on other components

**Component Structure**:
```typescript
interface GreetingAnimationProps {
  text: string;           // Greeting text content
  subtitle?: string;      // Optional subtitle
  className?: string;     // Additional CSS classes
}

export function GreetingAnimation(props: GreetingAnimationProps) {
  const prefersReducedMotion = useAnimationPreference();
  // Conditional animation based on preference
}
```

**Styling**: CSS Modules with @keyframes
- `fadeIn`: Opacity 0 → 1
- `slideIn`: Transform translateY 20px → 0
- Animations controlled by CSS class application
- Prefers-reduced-motion support via media query

**Testing**:
- Unit tests: Rendering, animation application, reduced motion
- E2E tests: Load time, animation completion
- A11y tests: Color contrast, semantic HTML

---

### 2. Gallery (US2)

**Purpose**: Display curated gallery with keyboard navigation

**Location**: `src/components/Gallery/`

**Key Components**:
- `Gallery.tsx` - Main container with navigation logic
- `GalleryImage.tsx` - Individual image component
- `useGalleryNavigation` hook - Keyboard handling

**Features**:
- Responsive CSS Grid (1→4 columns)
- Keyboard navigation (arrow keys)
- Lazy loading (loading="lazy" attribute)
- Focus management with visual indicators
- Circular wrapping (last image → first on right arrow)

**Gallery Component**:
```typescript
interface GalleryProps {
  images: GalleryImage[];
  onImageChange?: (index: number) => void;
}

export function Gallery(props: GalleryProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const { handleKeyDown } = useGalleryNavigation(
    focusedIndex,
    setFocusedIndex,
    images.length
  );
  // Responsive grid rendering
}
```

**GalleryImage Component**:
```typescript
interface GalleryImageProps {
  imageUrl: string;
  altText: string;
  title: string;
  isSelected: boolean;
  isFocused: boolean;
  onClick: () => void;
}
```

**Grid Layout**:
```css
/* Mobile: 1 column */
@media (max-width: 767px) {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* Tablet: 2 columns */
@media (768px to 1023px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Desktop: 3-4 columns */
@media (1024px+) {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

**Navigation Logic**:
```typescript
// useGalleryNavigation hook
const handleKeyDown = (e: KeyboardEvent) => {
  switch(e.key) {
    case 'ArrowRight':
      setIndex((prev) => (prev + 1) % total);
      break;
    case 'ArrowLeft':
      setIndex((prev) => (prev - 1 + total) % total);
      break;
    case 'ArrowDown':
      setIndex((prev) => (prev + imagesPerRow) % total);
      break;
    case 'ArrowUp':
      setIndex((prev) => (prev - imagesPerRow + total) % total);
      break;
  }
};
```

---

### 3. MessageForm (US3)

**Purpose**: Collect personalized message from user

**Location**: `src/components/MessageForm/`

**Key Components**:
- `MessageForm.tsx` - Form with input and counter
- `MessageDisplay.tsx` - Display saved message

**MessageForm Features**:
- Controlled textarea input
- Real-time character counter
- Max 500 character limit
- Form submission and state management
- Toggle display functionality

**Component Structure**:
```typescript
interface MessageFormProps {
  initialMessage?: string;
  onMessageChange?: (message: string) => void;
  maxChars?: number;  // Default: 500
  className?: string;
}

export function MessageForm(props: MessageFormProps) {
  const [messageText, setMessageText] = useState('');
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const handleSubmit = () => {
    setSavedMessage(messageText);
    setMessageText('');
    setIsDisplaying(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="textarea" value={messageText} onChange={...} />
        <span aria-live="polite">{messageText.length} / 500</span>
        <button type="submit">Guardar Mensaje</button>
      </form>
      {isDisplaying && savedMessage && (
        <MessageDisplay
          message={savedMessage}
          onClose={() => setIsDisplaying(false)}
        />
      )}
    </>
  );
}
```

**Styling**:
- Input: min-height 44px, font-size 16px (iOS zoom prevention)
- Counter: aria-live region for accessibility
- Buttons: Touch-friendly 44px minimum

**Input Validation**:
```typescript
const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
  let value = e.target.value;
  if (value.length > maxChars) {
    value = value.slice(0, maxChars);
  }
  setMessageText(value);
};
```

---

## Custom Hooks

### useAnimationPreference

**Purpose**: Detect user's animation motion preferences

**Location**: `src/hooks/useAnimationPreference.ts`

```typescript
export function useAnimationPreference(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReduced;
}
```

**Usage**:
```typescript
const prefersReduced = useAnimationPreference();

return (
  <div className={prefersReduced ? styles.noAnimation : styles.animated}>
    {content}
  </div>
);
```

---

### useGalleryNavigation

**Purpose**: Manage keyboard navigation through gallery

**Location**: `src/hooks/useGalleryNavigation.ts`

```typescript
export function useGalleryNavigation(
  currentIndex: number,
  setIndex: (index: number) => void,
  totalImages: number,
  imagesPerRow: number = 3
) {
  const handleKeyDown = (e: KeyboardEvent) => {
    switch(e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setIndex((currentIndex + 1) % totalImages);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setIndex((currentIndex - 1 + totalImages) % totalImages);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setIndex((currentIndex + imagesPerRow) % totalImages);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setIndex((currentIndex - imagesPerRow + totalImages) % totalImages);
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalImages]);

  return { handleKeyDown };
}
```

---

## State Management

### State Architecture

**Pattern**: React Hooks (useState) - No Redux/Zustand

**Component States**:

1. **GreetingAnimation**: 
   - Local animation state (CSS-based, no React state)
   - Motion preference (from hook)

2. **Gallery**:
   - `focusedIndex`: Current selected image
   - `hoveredIndex`: Hovered image (CSS :hover)

3. **MessageForm**:
   - `messageText`: Current input value
   - `isDisplaying`: Show/hide message display
   - `savedMessage`: Stored message text

**Data Flow**:
```
User Input
    ↓
Component Handler (onChange, onClick)
    ↓
useState Update
    ↓
Re-render with new state
    ↓
User sees updated UI
```

---

## Styling Architecture

### CSS Modules

**File Structure**:
```
src/components/
├── GreetingAnimation/
│   ├── GreetingAnimation.tsx
│   ├── GreetingAnimation.module.css
│   └── ...
├── Gallery/
│   ├── Gallery.tsx
│   ├── Gallery.module.css
│   ├── GalleryImage.tsx
│   ├── GalleryImage.module.css
│   └── ...
```

**Scope**: All CSS modules are locally scoped, zero naming conflicts

**Responsive Design**: Mobile-first approach
```css
/* Mobile (320px) */
.container {
  width: 100%;
  padding: 16px;
  font-size: 14px;
}

/* Tablet (768px) */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    font-size: 16px;
  }
}

/* Desktop (1024px) */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    font-size: 18px;
  }
}
```

**Animations**: Pure CSS with @keyframes
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## Type Safety

### TypeScript Strategy

**Files Structure**:
```
component/
├── ComponentName.tsx      # Main component logic
├── ComponentName.types.ts # Interface definitions
└── ComponentName.module.css
```

**Type Definitions**:
```typescript
// ComponentName.types.ts
export interface ComponentNameProps {
  /** Primary text content */
  text: string;

  /** Optional callback when state changes */
  onChange?: (value: string) => void;

  /** Optional CSS class for styling */
  className?: string;
}

export interface InternalState {
  isLoading: boolean;
  error: Error | null;
}
```

**Strict Mode**:
- `strict: true` in tsconfig.json
- All implicit `any` types are errors
- Strict null checks enabled

---

## Performance Optimizations

### Bundle Size

- **Tree shaking**: Unused code removed in production
- **Code splitting**: Lazy loading components (if needed)
- **CSS modules**: Only imported styles included
- **Image optimization**: Lazy loading with `loading="lazy"`

### Runtime Performance

- **Memoization**: useCallback for stable handlers
- **Responsive images**: Serve appropriate sizes
- **Event delegation**: Minimize event listeners
- **CSS animations**: GPU-accelerated transforms

---

## Testing Architecture

See [TESTING.md](./TESTING.md) for detailed testing strategies.

**Test Organization**:
```
src/
├── components/
│   ├── ComponentName/
│   │   ├── ComponentName.tsx
│   │   ├── ComponentName.test.tsx       # Unit tests
│   │   ├── ComponentName.a11y.test.tsx  # A11y tests
│   │   └── ...
│   └── ...
└── hooks/
    ├── useHook.ts
    ├── useHook.test.ts
    └── ...

e2e/
├── component-name.e2e.spec.ts
└── ...
```

**Test Types**:
1. **Unit Tests** - Component logic in isolation
2. **Integration Tests** - Multiple components together
3. **E2E Tests** - Full user workflows
4. **A11y Tests** - WCAG compliance

---

## Deployment Considerations

- **Build output**: `dist/` folder (optimized and minified)
- **Environment variables**: `.env` for configuration
- **Source maps**: Enabled for debugging
- **Cache busting**: Vite handles file hashing automatically

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.
