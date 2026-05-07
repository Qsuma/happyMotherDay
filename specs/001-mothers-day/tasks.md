# Tasks: Mother's Day Greeting Website

**Input**: Design documents from `/specs/001-mothers-day/`  
**Prerequisites**: spec.md ✅ (completed), plan.md ✅ (completed)

**Organization**: Tasks are grouped by user story (US1, US2, US3) for independent implementation and testing.

## Phase 1: Setup & Infrastructure

**Purpose**: Project initialization, dependencies, and scaffolding

- [ ] T001 [P] Create React project structure per plan.md (src/components/, src/hooks/, src/constants/, tests/)
- [ ] T002 [P] Initialize package.json with dependencies: React 18, Framer Motion, Tailwind, testing libraries
- [ ] T003 [P] Configure TypeScript strict mode in tsconfig.json
- [ ] T004 [P] Setup ESLint + Prettier with git hooks (Husky)
- [ ] T005 [P] Configure Vitest for unit/integration tests
- [ ] T006 [P] Configure Playwright for E2E tests
- [ ] T007 Create src/constants/galleryImages.ts with image metadata (paths, alt text, titles)
- [ ] T008 Create src/constants/greetingText.ts with greeting animation text content
- [ ] T009 Create src/constants/animations.ts with animation configurations (durations, easing functions)
- [ ] T010 [P] Configure Tailwind CSS with custom theme (if needed)
- [ ] T011 Add .env template for image CDN paths (future-proofing)

**Checkpoint**: Project structure ready, dependencies installed, TypeScript strict mode enforced.

---

## Phase 2: Foundation Components & Hooks

**Purpose**: Core utilities and base components that all stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T012 Create src/hooks/useAnimationPreference.ts (custom hook to detect prefers-reduced-motion)
- [ ] T013 [US-Foundation] Unit test useAnimationPreference (tests/useAnimationPreference.test.ts)
- [ ] T014 Create src/hooks/useGalleryNavigation.ts (custom hook for keyboard/mouse navigation logic)
- [ ] T015 [US-Foundation] Unit test useGalleryNavigation (tests/useGalleryNavigation.test.ts)
- [ ] T016 Create src/components/MothersDayPage/MothersDayPage.tsx (page wrapper component)
- [ ] T017 Create src/MothersDayPage.module.css with base layout styles (grid, responsive breakpoints)
- [ ] T018 Create src/components/MothersDayPage/MothersDayPage.types.ts (TypeScript interfaces)

**Checkpoint**: Foundation ready. Hooks tested. Page component ready to compose US1, US2, US3.

---

## Phase 3: User Story 1 - View Animated Greeting (Priority: P1) 🎯 MVP

**Goal**: User lands on homepage and sees beautiful, animated greeting that respects animation preferences

**Independent Test**: Load page → verify greeting renders with animation → verify it completes → verify mobile layout works → verify reduced-motion is respected

### Tests for US1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T019 [P] [US1] Unit test GreetingAnimation: renders with correct text content (spec/spec.md line: animated greeting)
- [ ] T020 [P] [US1] Unit test GreetingAnimation: animation completes within 2 seconds, doesn't loop
- [ ] T021 [P] [US1] Unit test GreetingAnimation: respects prefers-reduced-motion (uses useAnimationPreference hook)
- [ ] T022 [P] [US1] Unit test GreetingAnimation: responsive on mobile (320px), tablet (768px), desktop (1920px)
- [ ] T023 [US1] Accessibility test GreetingAnimation: text color contrast ≥ 4.5:1, semantic HTML (aria-live for animation completion)
- [ ] T024 [US1] E2E test GreetingAnimation (Playwright): User lands → greeting appears within 2s on 4G network simulation
- [ ] T025 [US1] E2E test GreetingAnimation with reduced-motion: User has prefers-reduced-motion → animation skips, final state visible immediately

### Implementation for US1

- [ ] T026 Create src/components/GreetingAnimation/GreetingAnimation.tsx (Framer Motion component)
  - Renders greeting text content from constants/greetingText.ts
  - Implements fade-in + slide animation using Framer Motion
  - Calls useAnimationPreference to check prefers-reduced-motion
  - If reduced motion: skip animation, show final state immediately
- [ ] T027 Create src/components/GreetingAnimation/GreetingAnimation.types.ts (props interface)
  - Props: text (string), animationDuration (number), className (optional)
- [ ] T028 Create src/components/GreetingAnimation/GreetingAnimation.module.css with responsive styles
  - Mobile: font-size 24px, padding 20px
  - Tablet: font-size 32px, padding 40px
  - Desktop: font-size 48px, padding 60px
  - Text color meets WCAG AA contrast (against background)
- [ ] T029 [US1] Unit test GreetingAnimation (write tests from T019-T025, verify they PASS now)
- [ ] T030 Integrate GreetingAnimation into MothersDayPage.tsx (import, render at top of page)
- [ ] T031 [US1] Visual regression test: Take screenshot of greeting on 3 breakpoints (mobile/tablet/desktop)

**Checkpoint**: US1 complete and independently functional. Greeting animates on all devices, respects user preferences.

---

## Phase 4: User Story 2 - Browse Image Gallery (Priority: P1) 🎯 MVP

**Goal**: User can browse curated gallery of Mother's Day images with smooth navigation and full accessibility

**Independent Test**: Gallery renders all images → keyboard navigation works (arrow keys) → mouse/touch navigation works → responsive on mobile (1 col) and desktop (3+ cols) → all images lazy-load

### Tests for US2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T032 [P] [US2] Unit test Gallery: renders all images from constants/galleryImages.ts
- [ ] T032b [P] [US2] Unit test Gallery: images have correct src, alt text, loading="lazy" attribute
- [ ] T033 [P] [US2] Unit test Gallery: keyboard navigation (arrow keys left/right change gallery index, don't scroll page)
- [ ] T034 [P] [US2] Unit test GalleryImage: receives image props, renders responsive <img> tag
- [ ] T035 [US2] Unit test Gallery: responsive grid layout (1 col on 320px, 2 col on 768px, 3 col on 1024px, 4 col on 1920px)
- [ ] T036 [US2] Unit test Gallery: selected image has visual indicator (border/shadow/z-index change)
- [ ] T037 [US2] Accessibility test Gallery: keyboard focus visible on all buttons (next/prev, images)
- [ ] T038 [US2] Accessibility test Gallery: image alt text read correctly by screen readers (aria-label on buttons)
- [ ] T039 [US2] Accessibility test Gallery: color contrast on buttons ≥ 4.5:1
- [ ] T040 [US2] E2E test Gallery (Playwright): User clicks next → gallery transitions smoothly, focus moves to new image
- [ ] T041 [US2] E2E test Gallery keyboard nav (Playwright): User presses right arrow → image changes, page doesn't scroll
- [ ] T042 [US2] E2E test Gallery mobile (Playwright): User on iPhone 12 → gallery is 1 column, touch buttons work
- [ ] T043 [US2] E2E test Gallery lazy-loading (Playwright): Scroll down → new images load only when visible (Intersection Observer)

### Implementation for US2

- [ ] T044 [P] Create src/components/Gallery/GalleryImage.tsx (reusable image component)
  - Props: imageUrl, altText, title, isSelected (boolean), onClick
  - Renders <img> with loading="lazy" and responsive srcSet (WebP + fallback)
  - Applies border/shadow if isSelected=true
- [ ] T045 [P] Create src/components/Gallery/GalleryImage.types.ts (interfaces)
- [ ] T046 Create src/components/Gallery/Gallery.tsx (main gallery container)
  - State: currentImageIndex (using useState)
  - Uses useGalleryNavigation hook for keyboard left/right handling
  - Renders all images from constants/galleryImages.ts
  - Renders prev/next buttons with onClick handlers
  - Implements responsive grid using Tailwind (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)
- [ ] T047 Create src/components/Gallery/Gallery.types.ts (interfaces)
- [ ] T048 Create src/components/Gallery/Gallery.module.css with grid layout, button styles, selected image visual indicator
  - Button min-height: 44px (touch-friendly)
  - Smooth transitions: transform 300ms, opacity 300ms
- [ ] T049 [P] Implement swipe/touch navigation in useGalleryNavigation.ts (optional: use react-use-gesture or native touch events)
- [ ] T050 [US2] Unit test Gallery (from T032-T043, verify they PASS now)
- [ ] T051 Integrate Gallery into MothersDayPage.tsx (import, render below GreetingAnimation)
- [ ] T052 [US2] Visual regression test: Gallery layout on 3 breakpoints (mobile 1-col, tablet 2-col, desktop 3-col)
- [ ] T053 [US2] Performance test: Verify all 6+ images load with lazy loading, LCP < 2.5s, CLS < 0.1

**Checkpoint**: US2 complete and independently functional. Gallery navigates smoothly on all input methods and devices.

---

## Phase 5: User Story 3 - Personalized Message Input (Priority: P2)

**Goal**: User can write optional personalized message to accompany greeting, with validation and persistence

**Independent Test**: Form renders → type message → character counter updates → submit stores message → toggle display shows/hides message → max 500 chars enforced

### Tests for US3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T054 [P] [US3] Unit test MessageForm: renders text input and submit button
- [ ] T055 [P] [US3] Unit test MessageForm: character counter displays correctly as user types (e.g., "42 / 500")
- [ ] T056 [US3] Unit test MessageForm: max 500 characters enforced (input stops accepting chars at 500)
- [ ] T057 [US3] Unit test MessageForm: form submission stores message in component state, clears input
- [ ] T058 [US3] Unit test MessageForm: display toggle button shows/hides message
- [ ] T059 [US3] Accessibility test MessageForm: input has associated <label> element
- [ ] T060 [US3] Accessibility test MessageForm: button text clearly states action (e.g., "Submit Message", "Hide Message")
- [ ] T061 [US3] Accessibility test MessageForm: form has aria-live region for character counter updates
- [ ] T062 [US3] E2E test MessageForm (Playwright): User types message → counter updates → submits → message displays
- [ ] T063 [US3] E2E test MessageForm mobile (Playwright): Form is accessible on small keyboard (virtual keyboard on iPhone)

### Implementation for US3

- [ ] T064 Create src/components/MessageForm/MessageForm.tsx (form component)
  - State: messageText, isVisible (using useState)
  - Controlled input: onChange updates messageText, prevents input at 500 chars
  - Character counter: displays current / max count
  - Submit button: onClick saves message to state, clears input
  - Toggle button: onClick shows/hides message display
  - Renders MessageDisplay subcomponent if isVisible=true
- [ ] T065 Create src/components/MessageForm/MessageDisplay.tsx (renders saved message)
  - Props: message (string), onHide callback
  - Simple paragraph display with border/background styling
- [ ] T066 Create src/components/MessageForm/MessageForm.types.ts (interfaces)
- [ ] T067 Create src/components/MessageForm/MessageForm.module.css with input/button/counter styles
  - Input: min-height 44px, accessible font size (16px+), clear focus outline
  - Button: min-height 44px, clear label text
  - Counter: positioned near input, aria-live region
- [ ] T068 [US3] Unit test MessageForm (from T054-T063, verify they PASS now)
- [ ] T069 Integrate MessageForm into MothersDayPage.tsx (import, render below Gallery)
- [ ] T070 [US3] Visual regression test: MessageForm on mobile (keyboard visible) and desktop

**Checkpoint**: US3 complete and independently functional. Message form works with full validation and optional display.

---

## Phase 6: Integration & Full Page Testing

**Purpose**: Verify all components work together as single cohesive experience

- [ ] T071 [US1+US2+US3] Integration test MothersDayPage.tsx: All 3 components render in correct order
- [ ] T072 [US1+US2+US3] E2E test full user flow (Playwright):
  - User lands on page → sees greeting animation
  - User scrolls to gallery → navigates with keyboard
  - User scrolls to message form → types message → toggles display
  - User sees complete page with greeting + gallery + message together
- [ ] T073 [US1+US2+US3] Accessibility audit: Run axe-core on full page, fix any violations
- [ ] T074 [US1+US2+US3] Performance audit: Lighthouse score ≥ 85, Core Web Vitals all pass
- [ ] T075 [US1+US2+US3] Mobile E2E test: Full flow on iPhone 12 simulator (Playwright)
- [ ] T076 [US1+US2+US3] Desktop E2E test: Full flow on desktop browser (Playwright)

**Checkpoint**: Full page integration complete, all user stories work together seamlessly.

---

## Phase 7: Polish & Deployment Readiness

**Purpose**: Final refinements, documentation, performance optimization

- [ ] T077 Create src/MothersDayPage/quickstart.md with:
  - How to run locally: `npm install && npm run dev`
  - How to run tests: `npm run test` (unit), `npm run test:e2e` (E2E)
  - How to build: `npm run build`
  - Browser compatibility notes
- [ ] T078 [P] Update .env.example with image CDN variables (future-proofing)
- [ ] T079 [P] Add comments to all components explaining architectural decisions (why template, why hooks, etc.)
- [ ] T080 Add JSDoc comments to all exported functions/components with @param, @returns, @example
- [ ] T081 [P] Optimize images: convert to WebP, create responsive srcSet, verify gzip sizes
- [ ] T082 Run final Lighthouse audit, fix any remaining issues (bundle size, LCP, CLS)
- [ ] T083 Run final axe-core scan, ensure 0 automated violations
- [ ] T084 Code review: Check all TypeScript strict mode compliance, ESLint/Prettier formatting
- [ ] T085 Create DESIGN.md documenting component architecture, hooks, and design decisions for future developers
- [ ] T086 Add README for Mother's Day feature: what it does, who maintains it, how to extend (i18n, add images, etc.)

**Checkpoint**: Feature ready for merge to main, all documentation complete.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundation (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundation completion - can start immediately after
- **US2 (Phase 4)**: Depends on Foundation completion - can run in parallel with US1
- **US3 (Phase 5)**: Depends on Foundation completion - can run in parallel with US1/US2
- **Integration (Phase 6)**: Depends on US1 + US2 + US3 completion
- **Polish (Phase 7)**: Depends on Integration completion

### Parallel Opportunities

- All Phase 1 tasks [P] can run in parallel (npm install, config files, etc.)
- All Foundation Phase 2 tasks can run in parallel (hooks are independent)
- **US1, US2, US3 can be implemented in parallel by different developers once Foundation is done**
- All tests [P] within each US can run in parallel (different files, no conflicts)
- E2E tests T040-T043 (US2) can run in parallel once integration complete

### Team Execution Strategy (if 1-3 developers)

**Option 1 (1 developer - sequential)**:
1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundation)
3. Implement US1 (Phase 3) - deliver, review, merge
4. Implement US2 (Phase 4) - deliver, review, merge
5. Implement US3 (Phase 5) - deliver, review, merge
6. Integration testing (Phase 6)
7. Polish (Phase 7)
- **Estimated time**: 3-4 weeks solo development

**Option 2 (2 developers - parallel stories)**:
1. Developer A: Phase 1 + 2 (Setup + Foundation)
2. Developer A: US1 (Phase 3)  
   Developer B: US2 (Phase 4)
3. Developer A: US3 (Phase 5)
4. Both: Integration + Polish
- **Estimated time**: 2-3 weeks with pair work

### Within Each User Story

- Tests written FIRST (TDD): T019-T025 for US1
- Tests MUST FAIL before implementation starts
- Implement component (T026-T031)
- Unit tests should PASS
- E2E tests should PASS
- Visual regression tests completed
- Story marked complete, ready for review

---

## Success Criteria - Verification Checklist

Use this to verify each phase is complete before moving to next:

- [ ] **Phase 1**: npm install successful, tsconfig strict, ESLint config applied, no config errors
- [ ] **Phase 2**: Hooks tested, page component renders without error, constants populated
- [ ] **US1**: Greeting renders, animation completes in < 2s, works on 3 screen sizes, 0 a11y violations
- [ ] **US2**: Gallery renders all 6+ images, keyboard nav works, responsive grid verified, Core Web Vitals pass
- [ ] **US3**: Form validates 500 chars max, message persists, display toggle works
- [ ] **Integration**: Full page loads in < 2.5s, Lighthouse ≥ 85, all user flows work E2E
- [ ] **Polish**: All tests pass, 0 TypeScript errors, 0 ESLint errors, documentation complete, ready to ship

---

## Notes

- [P] tasks = different files, no interdependencies, can parallelize
- [Story] label = task belongs to specific US for traceability
- Each US is independently testable and deployable
- After each phase checkpoint, stop and validate before proceeding
- Component templates (`.tsx` + `.test.tsx` + `.types.ts` + `.css`) ensure consistency
- Constitution compliance verified at each stage (spec-driven, verification-first, traceability)
