# Implementation Plan: Mother's Day Greeting Website

**Branch**: `001-mothers-day` | **Date**: 2026-05-07 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/001-mothers-day/spec.md`

## Summary

Build an animated Mother's Day greeting website featuring:
- **US1 (P1)**: Animated greeting that loads on homepage (Framer Motion for smooth animations)
- **US2 (P1)**: Responsive image gallery with keyboard/touch navigation (React grid component)
- **US3 (P2)**: Optional personalized message form (React form with character counter)

All components follow React template-based architecture with TypeScript, co-located tests, and full accessibility compliance per constitution.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x, Node.js 18 LTS  
**Primary Dependencies**: React 18, React Router v6, Framer Motion (animations), TailwindCSS (styling)  
**Storage**: Browser sessionStorage for user messages (no backend required for MVP)  
**Testing**: Vitest + React Testing Library (unit/integration), Playwright (E2E), axe-core (accessibility)  
**Target Platform**: Modern web browsers (desktop + mobile, iOS Safari 12+, Android Chrome latest 2 versions)  
**Project Type**: Single-page React web application (can be integrated into larger app later)  
**Performance Goals**: 
- Lighthouse ≥ 85
- LCP < 2.5s, CLS < 0.1 (Core Web Vitals)
- Bundle size < 100 KB gzipped for this feature
**Constraints**: 
- Animations must respect `prefers-reduced-motion` 
- Images must be optimized (lazy-loaded)
- No external API calls (static content)
**Scale/Scope**: 
- Single homepage + gallery layout
- 6-10 greeting images
- Future-ready for i18n (strings in constants)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Spec-Driven Delivery**: ✅ Spec defines 3 user stories, measurable success criteria, assumptions documented. Plan derived from spec requirements.
- [x] **Independent Value Slices**: ✅ US1 (greeting) delivers value alone. US2 (gallery) adds value independently. US3 (message) optional enhancement. Each testable in isolation.
- [x] **Verification-First**: ✅ Will use React Testing Library + Playwright E2E + axe-core for accessibility. 80%+ coverage target. See Testing Strategy below.
- [x] **Traceability by Default**: ✅ All FR-### requirements map to user stories. Task structure will reference requirements by ID.
- [x] **Simplicity and Change Discipline**: ✅ Using standard React patterns (no over-engineering). Framer Motion chosen over custom animations (reduces complexity). Single page app, no state management complexity beyond React Context.

**Additional Checks specific to React Web stack**:
- [x] **Technology Stack**: React 18 + TypeScript strict mode. ESLint + Prettier enforced. No controversial dependencies.
- [x] **Component Architecture**: Components organized by feature (`src/components/GreetingAnimation/`, `src/components/Gallery/`, etc). Templates follow standard `.tsx` + `.test.tsx` + `.types.ts`.
- [x] **Testing Requirements**: Unit + integration + E2E + accessibility tests. Test library is React Testing Library (not enzyme).
- [x] **Performance & Accessibility**: Lighthouse ≥ 85. WCAG 2.1 AA. Core Web Vitals targets met. Image optimization with lazy loading.

**GATE RESULT**: ✅ PASS - All principles satisfied. Proceed to design.

## Project Structure

### Documentation (this feature)

```text
specs/001-mothers-day/
├── spec.md              # Feature specification (THIS IS COMPLETED)
├── plan.md              # Technical plan (THIS FILE)
├── research.md          # Phase 0 research (TO BE CREATED if needed)
├── data-model.md        # Data structures (MINIMAL - see below)
├── quickstart.md        # How to run/test (TO BE CREATED)
└── tasks.md             # Work breakdown (TO BE CREATED)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── GreetingAnimation/
│   │   ├── GreetingAnimation.tsx      # Main greeting component
│   │   ├── GreetingAnimation.test.tsx  # Tests
│   │   ├── GreetingAnimation.module.css # Styles (or Tailwind)
│   │   └── GreetingAnimation.types.ts  # TypeScript interfaces
│   │
│   ├── Gallery/
│   │   ├── Gallery.tsx
│   │   ├── Gallery.test.tsx
│   │   ├── GalleryImage.tsx            # Reusable image component
│   │   ├── GalleryImage.test.tsx
│   │   ├── Gallery.module.css
│   │   └── Gallery.types.ts
│   │
│   ├── MessageForm/
│   │   ├── MessageForm.tsx
│   │   ├── MessageForm.test.tsx
│   │   ├── MessageForm.module.css
│   │   └── MessageForm.types.ts
│   │
│   └── MothersDayPage/               # Page component that composes all above
│       ├── MothersDayPage.tsx
│       ├── MothersDayPage.test.tsx
│       └── MothersDayPage.module.css
│
├── hooks/
│   ├── useGalleryNavigation.ts         # Custom hook for gallery keyboard/mouse nav
│   ├── useGalleryNavigation.test.ts
│   ├── useAnimationPreference.ts       # Custom hook for prefers-reduced-motion
│   └── useAnimationPreference.test.ts
│
├── constants/
│   ├── galleryImages.ts                # Array of gallery image paths/metadata
│   ├── greetingText.ts                 # Greeting animation text content
│   └── animations.ts                   # Animation configurations (durations, easing)
│
├── assets/
│   └── images/
│       ├── greeting-01.webp
│       ├── greeting-02.webp
│       └── ... (6+ optimized Mother's Day images)
│
└── App.tsx                             # Main app file with routing

tests/
├── integration/
│   ├── MothersDayPage.integration.test.tsx  # Full page flow: load greeting → view gallery → add message
│   └── Gallery.integration.test.tsx          # Gallery navigation + image display
│
└── e2e/
    ├── mothers-day.e2e.spec.ts         # Playwright: landing → gallery → message flow
    └── gallery-navigation.e2e.spec.ts  # Playwright: keyboard nav, swipe, responsive layouts
```

**Structure Decision**: Single-page feature within larger app structure. Components are isolated by feature (not by type), enabling independent testing and future reuse in other pages/contexts.

## Complexity Tracking

No additional complexity beyond standard React best practices:

| Aspect | Decision | Why Simple | Alternatives Rejected |
|--------|----------|-----------|----------------------|
| Animations | Framer Motion + CSS | Proven library, handles `prefers-reduced-motion` out of box | Custom canvas/SVG animations (overkill for greeting) |
| Styling | TailwindCSS (constitution-defined) | Utility-first, low overhead | CSS-in-JS would add bundle size |
| State Management | React Context API | Single feature, minimal state (message text + gallery index) | Redux/Zustand unnecessary at this scale |
| Image Gallery | CSS Grid + React hooks | Native CSS Grid is responsive and fast | Carousel library would add unnecessary dependency |
| Form Validation | React hook + controlled inputs | Lightweight, transparent | Form library (React Hook Form) overkill for 1 text field |
| Testing | React Testing Library + Playwright | Constitution requirement, industry standard | Enzyme/Shallow rendering violates constitution |

**Result**: ✅ No unjustified complexity. Architecture is maintainable and aligned with constitution.

## Testing Strategy

### Unit & Integration Tests (Vitest + React Testing Library)

- **GreetingAnimation**: Verify animation renders, respects `prefers-reduced-motion`, completes in < 2s
- **Gallery**: Verify grid renders, keyboard navigation (arrow keys), mouse clicks, image lazy-loading
- **GalleryImage**: Verify image renders with correct `alt` text, lazy loading attribute
- **MessageForm**: Verify character counter, validation (max 500 chars), form submission stores message
- **Hooks**: Test `useGalleryNavigation` (left/right key handling), `useAnimationPreference` (media query)
- **MothersDayPage**: Integration test: all components render, interact correctly together

**Coverage Target**: 80% overall, 100% for critical paths (animation completion, form submission, gallery navigation)

### E2E Tests (Playwright)

1. **Happy path**: User lands → sees greeting → scrolls to gallery → clicks next → adds message → message displays
2. **Keyboard navigation**: User lands → presses arrow keys in gallery → gallery responds
3. **Accessibility**: User with reduced motion → animations skip, page still works
4. **Mobile**: User on iPhone 12 → responsive layout works, touch gestures work
5. **Performance**: Page loads in < 2.5s LCP on 4G network

### Accessibility Tests (axe-core)

- Run in every unit test (jest-axe or @axe-core/react)
- Manual WCAG 2.1 AA spot-check:
  - Keyboard navigation (Tab through all interactive elements)
  - Color contrast verification
  - Screen reader testing (1 story per component)

## Deployment & Delivery

This feature is designed to be:
- **Merged to main**: When all tests pass + Lighthouse ≥ 85 + 0 a11y violations
- **Deployed independently**: Can ship US1+US2 without US3 (message form)
- **Extended later**: Can add i18n, animations library upgrades, or message backend without breaking existing code

## Dependencies & Tools

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "framer-motion": "^10.16.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "vitest": "^0.34.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@axe-core/react": "^4.7.0",
    "playwright": "^1.40.0",
    "typescript": "^5.1.0",
    "eslint": "latest",
    "prettier": "latest"
  }
}
```

No controversial dependencies. All libraries are industry-standard and actively maintained.
