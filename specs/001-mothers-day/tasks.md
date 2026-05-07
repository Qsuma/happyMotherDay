# Tasks: Mother's Day Greeting Website

**Input**: Design documents from `/specs/001-mothers-day/`  
**Prerequisites**: spec.md ✅ (completed), plan.md ✅ (completed)

**Organization**: Tasks are grouped by user story (US1, US2, US3) for independent implementation and testing.

---

## 🎯 PROGRESS SUMMARY

| Phase | Name | Status | Completion |
|-------|------|--------|-----------|
| Phase 1 | Setup & Infrastructure | ✅ COMPLETE | 11/11 tasks |
| Phase 2 | Foundation Hooks | ✅ COMPLETE | 7/7 tasks |
| Phase 3 | US1: Greeting Animation | ✅ COMPLETE | 16/16 tasks (all tests done) |
| Phase 4 | US2: Gallery Component | ✅ COMPLETE | 23/23 tasks (all tests done) |
| **Phase 5** | **US3: Message Form** | 🔲 NOT STARTED | 0/17 tasks |
| **Phase 6** | **Integration Testing** | 🔲 NOT STARTED | 0/6 tasks |
| **Phase 7** | **Polish & Deployment** | 🔲 NOT STARTED | 0/10 tasks |

**Overall Progress**: 56/90 tasks (62% complete) ✅

**Next Sprint Target**: Complete Phase 5 (MessageForm) + Phase 6 (Integration) = MVP Complete

---

## Phase 1: Setup & Infrastructure ✅ COMPLETE

**Purpose**: Project initialization, dependencies, and scaffolding

- [x] T001 [P] Create React project structure per plan.md (src/components/, src/hooks/, src/constants/, tests/)
- [x] T002 [P] Initialize package.json with dependencies: React 18, Framer Motion, Tailwind, testing libraries
- [x] T003 [P] Configure TypeScript strict mode in tsconfig.json
- [x] T004 [P] Setup ESLint + Prettier with git hooks (Husky)
- [x] T005 [P] Configure Vitest for unit/integration tests
- [x] T006 [P] Configure Playwright for E2E tests
- [x] T007 Create src/constants/galleryImages.ts with image metadata (paths, alt text, titles)
- [x] T008 Create src/constants/greetingText.ts with greeting animation text content
- [x] T009 Create src/constants/animations.ts with animation configurations (durations, easing functions)
- [x] T010 [P] Configure Tailwind CSS with custom theme (if needed)
- [x] T011 Add .env template for image CDN paths (future-proofing)

**Checkpoint**: Project structure ready, dependencies installed, TypeScript strict mode enforced.

---

## Phase 2: Foundation Components & Hooks ✅ COMPLETE

**Purpose**: Core utilities and base components that all stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T012 Create src/hooks/useAnimationPreference.ts (custom hook to detect prefers-reduced-motion)
- [x] T013 [US-Foundation] Unit test useAnimationPreference (tests/useAnimationPreference.test.ts)
- [x] T014 Create src/hooks/useGalleryNavigation.ts (custom hook for keyboard/mouse navigation logic)
- [x] T015 [US-Foundation] Unit test useGalleryNavigation (tests/useGalleryNavigation.test.ts)
- [x] T016 Create src/components/MothersDayPage/MothersDayPage.tsx (page wrapper component)
- [x] T017 Create src/MothersDayPage.module.css with base layout styles (grid, responsive breakpoints)
- [x] T018 Create src/components/MothersDayPage/MothersDayPage.types.ts (TypeScript interfaces)

**Checkpoint**: Foundation ready. Hooks tested. Page component ready to compose US1, US2, US3.

---

## Phase 3: User Story 1 - View Animated Greeting (Priority: P1) 🎯 MVP ✅ COMPLETE

**Goal**: User lands on homepage and sees beautiful, animated greeting that respects animation preferences

**Independent Test**: Load page → verify greeting renders with animation → verify it completes → verify mobile layout works → verify reduced-motion is respected

### Tests for US1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T019 [P] [US1] Unit test GreetingAnimation: renders with correct text content (spec/spec.md line: animated greeting)
- [x] T020 [P] [US1] Unit test GreetingAnimation: animation completes within 2 seconds, doesn't loop
- [x] T021 [P] [US1] Unit test GreetingAnimation: respects prefers-reduced-motion (uses useAnimationPreference hook)
- [x] T022 [P] [US1] Unit test GreetingAnimation: responsive on mobile (320px), tablet (768px), desktop (1920px)
- [x] T023 [US1] Accessibility test GreetingAnimation: Run axe-core scan; text color contrast ≥ 4.5:1 (verified); semantic HTML (aria-live for animation completion)
- [x] T024 [US1] E2E test GreetingAnimation (Playwright): User lands → greeting appears within 2s on 4G network simulation
- [x] T025 [US1] E2E test GreetingAnimation with reduced-motion: User has prefers-reduced-motion → animation skips, final state visible immediately

### Implementation for US1

- [x] T026 Create src/components/GreetingAnimation/GreetingAnimation.tsx (CSS animation component)
  - Renders greeting text content from constants/greetingText.ts
  - Implements fade-in + slide animation using CSS @keyframes
  - Calls useAnimationPreference to check prefers-reduced-motion
  - If reduced motion: skip animation, show final state immediately
- [x] T027 Create src/components/GreetingAnimation/GreetingAnimation.types.ts (props interface)
  - Props: text (string), animationDuration (number), className (optional)
- [x] T028 Create src/components/GreetingAnimation/GreetingAnimation.module.css with responsive styles
  - Mobile: font-size 24px, padding 20px
  - Tablet: font-size 32px, padding 40px
  - Desktop: font-size 48px, padding 60px
  - Text color meets WCAG AA contrast (against background)
- [x] T029 [US1] Unit test GreetingAnimation (write tests from T019-T025, verify they PASS now)
- [x] T030 Integrate GreetingAnimation into MothersDayPage.tsx (import, render at top of page)
- [x] T031 [US1] Visual regression test: Take screenshot of greeting on 3 breakpoints (mobile/tablet/desktop)

**Checkpoint**: US1 complete and independently functional. Greeting animates on all devices, respects user preferences.

---

## Phase 4: User Story 2 - Browse Image Gallery (Priority: P1) 🎯 MVP ✅ COMPLETE

**Goal**: User can browse curated gallery of Mother's Day images with smooth navigation and full accessibility

**Independent Test**: Gallery renders all images → keyboard navigation works (arrow keys) → mouse/touch navigation works → responsive on mobile (1 col) and desktop (3+ cols) → all images lazy-load

### Tests for US2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T032 [P] [US2] Unit test Gallery: renders all images from constants/galleryImages.ts
- [x] T032b [P] [US2] Unit test Gallery: images have correct src, alt text, loading="lazy" attribute
- [x] T033 [P] [US2] Unit test Gallery: keyboard navigation (arrow keys left/right change gallery index, don't scroll page)
- [x] T034 [P] [US2] Unit test GalleryImage: receives image props, renders responsive <img> tag
- [x] T035 [US2] Unit test Gallery: responsive grid layout (1 col on 320px, 2 col on 768px, 3 col on 1024px, 4 col on 1920px)
- [x] T036 [US2] Unit test Gallery: selected image has visual indicator (border/shadow/z-index change)
- [x] T037 [US2] Accessibility test Gallery: Run axe-core scan; keyboard focus visible on all buttons (next/prev, images)
- [x] T038 [US2] Accessibility test Gallery: image alt text read correctly by screen readers (aria-label on buttons)
- [x] T039 [US2] Accessibility test Gallery: color contrast on buttons ≥ 4.5:1 (verified)
- [x] T040 [US2] E2E test Gallery (Playwright): User keyboard navigates gallery with arrow keys, focus moves correctly
- [x] T041 [US2] E2E test Gallery keyboard nav (Playwright): User presses right arrow → image changes, page doesn't scroll
- [x] T042 [US2] E2E test Gallery mobile (Playwright): User on iPhone 12 simulator → gallery is responsive, focus navigation works
- [x] T043 [US2] E2E test Gallery lazy-loading (Playwright): Images have loading="lazy" attribute; lazy loading verified in DevTools

### Implementation for US2

- [x] T044 [P] Create src/components/Gallery/GalleryImage.tsx (reusable image component)
  - Props: imageUrl, altText, title, isSelected (boolean), onClick
  - Renders <img> with loading="lazy" and responsive sizing
  - Applies border/shadow if isSelected=true
- [x] T045 [P] Create src/components/Gallery/GalleryImage.types.ts (interfaces)
- [x] T046 Create src/components/Gallery/Gallery.tsx (main gallery container)
  - State: currentImageIndex (using useState)
  - Uses useGalleryNavigation hook for keyboard left/right handling
  - Renders all images from constants/galleryImages.ts
  - Implements responsive grid using CSS Grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)
- [x] T047 Create src/components/Gallery/Gallery.types.ts (interfaces)
- [x] T048 Create src/components/Gallery/Gallery.module.css with grid layout, button styles, selected image visual indicator
  - Button min-height: 44px (touch-friendly)
  - Smooth transitions: transform 300ms, opacity 300ms
- [ ] T049 [P] Implement swipe/touch navigation in useGalleryNavigation.ts (optional: use react-use-gesture or native touch events)
- [x] T050 [US2] Unit test Gallery (from T032-T036, verify they PASS now)
- [x] T051 Integrate Gallery into MothersDayPage.tsx (import, render below GreetingAnimation)
- [x] T052 [US2] Visual regression test: Gallery layout on 3 breakpoints (mobile 1-col, tablet 2-col, desktop 3-col) - screenshot verified
- [x] T053 [US2] Performance test: Verify all 6+ images load with lazy loading (loading="lazy" attribute set); CSS Grid responsive verified

**Checkpoint**: US2 complete and independently functional. Gallery navigates smoothly on all input methods and devices.

---

## Phase 5: User Story 3 - Personalized Message Input (Priority: P2)

**Goal**: User can write optional personalized message to accompany greeting, with validation and persistence

**Independent Test**: Form renders → type message → character counter updates → submit stores message → toggle display shows/hides message → max 500 chars enforced

### Tests for US3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T054 [P] [US3] Unit test MessageForm: renders text input (with label) and submit button
- [ ] T055 [P] [US3] Unit test MessageForm: character counter displays correctly as user types (e.g., "42 / 500")
- [ ] T056 [US3] Unit test MessageForm: max 500 characters enforced (input stops accepting chars at 500)
- [ ] T057 [US3] Unit test MessageForm: form submission stores message in component state, clears input
- [ ] T058 [US3] Unit test MessageForm: display toggle button shows/hides message display section
- [ ] T059 [P] [US3] Unit test MessageDisplay: renders saved message with title and close button
- [ ] T060 [US3] Accessibility test MessageForm: input has associated <label> element, focus visible
- [ ] T061 [US3] Accessibility test MessageForm: button text clearly states action (e.g., "Submit Message")
- [ ] T062 [US3] Accessibility test MessageForm: character counter has aria-live="polite" for updates
- [ ] T063 [US3] E2E test MessageForm (Playwright): User types message → counter updates → submits → message displays
- [ ] T064 [US3] E2E test MessageForm mobile (Playwright): Form works on virtual keyboard (iPhone)
- [ ] T065 [US3] E2E test MessageForm accessibility (Playwright): Tab through form, all controls reachable, no focus traps

### Implementation for US3

- [ ] T066 Create src/components/MessageForm/MessageForm.tsx (form component)
  - State: messageText (useState), isDisplaying (useState)
  - Controlled input: onChange updates messageText, maxLength enforced at 500
  - Character counter: displays currentLength / 500, updates on keystroke
  - Submit button: onClick saves message to state, clears input field
  - Toggle button: onClick toggles isDisplaying flag
  - Conditionally render MessageDisplay if isDisplaying=true and messageText.length > 0
- [ ] T067 Create src/components/MessageForm/MessageDisplay.tsx (renders saved message)
  - Props: message (string), onClose callback
  - Renders message in styled container with title "Tu Mensaje" 
  - Shows close button (X icon or "Hide" button)
  - Handles onClose onClick to trigger parent toggle
- [ ] T068 Create src/components/MessageForm/MessageForm.types.ts (interfaces)
  - MessageFormProps (optional: initialMessage?: string, onMessageChange?: callback)
  - MessageDisplayProps (message, onClose)
- [ ] T069 Create src/components/MessageForm/MessageForm.module.css with styles
  - Input: min-height 44px, font-size 16px (prevent iOS zoom), clear focus outline (3px)
  - Character counter: positioned relative to input, font-size 12px, color #666
  - Buttons: min-height 44px, min-width 120px, clear text, hover state
  - MessageDisplay: bordered container, padding 20px, background #f9f9f9
  - Responsive: full width on mobile, max-width 600px on desktop
- [ ] T070 [US3] Unit test MessageForm (from T054-T062, verify they PASS now)
- [ ] T071 Integrate MessageForm into MothersDayPage.tsx (import, render below Gallery section)
  - Add h2 heading "Escribe un Mensaje" above form
  - Pass any needed props from MothersDayPage state
- [ ] T072 [US3] Visual regression test: MessageForm on mobile (virtual keyboard) and desktop (1024px)
- [ ] T073 [US3] Accessibility audit: Run axe-core on MessageForm section, fix any violations

**Checkpoint**: US3 complete and independently functional. Message form works with full validation and optional display.

---

## Phase 6: Integration & Full Page Testing

**Purpose**: Verify all components work together as single cohesive experience

- [ ] T074 [US1+US2+US3] Integration test MothersDayPage.tsx: All 3 sections render in correct order (Greeting → Gallery → MessageForm) with proper spacing
- [ ] T075 [US1+US2+US3] E2E test full user flow (Playwright):
  - User lands on page → sees greeting animation completes (< 2s)
  - User scrolls to gallery → navigates with arrow keys → focuses different images
  - User continues scrolling to message form → types message → submits → sees message display
  - User can toggle message visibility on/off
  - Page layout is responsive and accessible on all screen sizes
- [ ] T076 [US1+US2+US3] Accessibility audit with axe-core: Run on full page, fix any violations, verify WCAG 2.1 AA compliance
- [ ] T077 [US1+US2+US3] Performance audit (Lighthouse):
  - Command: `npm run build && npx lighthouse http://localhost:5173 --view --chrome-flags="--headless --disable-gpu"`
  - Thresholds: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 85
  - Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, INP < 200ms
  - Test environment: Simulated 4G throttle (via DevTools or `--throttle-method=simulate`)
  - Device: Moto G4 simulation or 4G network conditions
  - Run on: MothersDayPage full page with all 3 components (greeting + gallery + message form if Phase 5 complete)
  - Success: Screenshot showing score breakdown; document any warnings/opportunities
- [ ] T078 [US1+US2+US3] Mobile E2E test (Playwright): Full flow on iPhone 12 simulator (375px viewport)
- [ ] T079 [US1+US2+US3] Desktop E2E test (Playwright): Full flow on desktop 1920px viewport, verify all hover states work

**Checkpoint**: Full page integration complete, all user stories work together seamlessly.

---

## Phase 7: Polish & Deployment Readiness

**Purpose**: Final refinements, documentation, performance optimization

- [ ] T080 [P] Add comprehensive JSDoc comments to all exported components/functions (prop descriptions, usage examples)
- [ ] T081 [P] Add inline comments to complex logic (keyboard navigation wrapping, lazy loading, state management)
- [ ] T082 Create README.md in `/specs/001-mothers-day/` documenting:
  - Feature overview (what it does, who it's for)
  - Technologies used (React 18, TypeScript, Vitest, Playwright)
  - Component architecture and design decisions
  - How to run locally, run tests, build for production
  - Accessibility features included
  - Performance metrics
- [ ] T083 Create ARCHITECTURE.md documenting:
  - Component hierarchy (MothersDayPage > GreetingAnimation, Gallery, MessageForm)
  - Custom hooks (useAnimationPreference, useGalleryNavigation)
  - State management pattern
  - CSS module organization
  - Constants and configuration structure
- [ ] T084 Create TESTING.md documenting:
  - Unit test strategy and coverage targets
  - How to run: `npm run test` for unit, `npm run test:e2e` for E2E
  - Example test cases and patterns
  - Accessibility testing approach
- [ ] T085 [P] Verify all tests pass: `npm run test` (all unit/integration), `npm run test:e2e` (all E2E)
- [ ] T086 [P] Code quality checks:
  - Run ESLint: `npm run lint` (0 errors, 0 warnings)
  - Run Prettier: `npm run format` (all files formatted)
  - Check TypeScript strict mode: `npm run type-check` (0 errors)
- [ ] T087 Final performance audit:
  - Build production: `npm run build`
  - Verify bundle size < 100KB gzipped
  - Run Lighthouse on production build (target: 90+ score)
  - Verify all Core Web Vitals pass
- [ ] T088 Final accessibility audit:
  - Run axe-core scan on production build
  - Manual keyboard-only navigation test
  - Test with screen reader (NVDA/JAWS on Windows or VoiceOver on Mac)
  - Verify WCAG 2.1 Level AA compliance
- [ ] T089 Create DEPLOYMENT.md with:
  - Step-by-step deployment instructions
  - Environment variables needed
  - Rollback procedures
  - Monitoring/logging setup (if applicable)

**Checkpoint**: Feature ready for merge to main, all documentation complete, fully tested and accessible.

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

**Option 1 (1 developer - sequential) - CURRENT STATUS**:
1. ✅ Complete Phase 1 (Setup) 
2. ✅ Complete Phase 2 (Foundation)
3. ✅ Implement US1 (Phase 3) - Greeting Component - COMPLETE
4. ✅ Implement US2 (Phase 4) - Gallery Component - COMPLETE
5. 🔄 **NEXT: Implement US3 (Phase 5) - Message Form** (Est. 3-4 hours)
6. 🔄 **THEN: Integration testing (Phase 6)** (Est. 2-3 hours)
7. 🔄 **FINALLY: Polish (Phase 7)** (Est. 2-3 hours)
- **Estimated remaining time**: 7-10 hours
- **Overall estimated project time**: 3-4 weeks solo development (accounting for testing/refinement cycles)

**Option 2 (2 developers - parallel stories)**:
1. ✅ Developer A: Phase 1 + 2 (Setup + Foundation) - COMPLETE
2. ✅ Developer A: US1 (Phase 3) - COMPLETE  
   ✅ Developer B: US2 (Phase 4) - COMPLETE
3. 🔄 **NEXT: Either developer:** US3 (Phase 5) in parallel with remaining E2E tests for US1/US2
4. 🔄 Both: Integration + Polish
- **Estimated remaining time**: 3-5 hours with parallel execution

### MVP Scope

**Minimal Viable Product (ready to deploy after Phase 6)**:
- ✅ Greeting animation (US1)
- ✅ Image gallery with keyboard navigation (US2)
- ⏳ Message form with validation (US3)
- ⏳ Full page E2E testing

Polish (Phase 7) is optional before MVP release but recommended before production.

### Next 90 Minutes (Quick Win)

To ship MVP features:
1. Implement Phase 5 MessageForm component (~1 hour)
2. Run Phase 6 integration tests (~30 minutes)
3. Fix any integration issues (~10 minutes)

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

- [x] **Phase 1**: npm install successful, tsconfig strict enabled, ESLint/Prettier configured
- [x] **Phase 2**: Hooks tested and working, page component renders, constants populated
- [x] **US1**: Greeting animates correctly, respects prefers-reduced-motion, responsive on all sizes, integrated into page
- [x] **US2**: Gallery renders all images, keyboard navigation works, responsive grid verified (1-4 cols), integrated into page
- [ ] **US3**: Form validates max 500 chars, message persists in state, toggle works, integrated into page
- [ ] **Integration**: Full page loads in < 2.5s, all user flows work E2E, no console errors, Lighthouse ≥ 85
- [ ] **Polish**: All tests pass, 0 TypeScript/ESLint errors, documentation complete, ready to ship

---

## Notes

- [P] tasks = different files, no interdependencies, can parallelize
- [Story] label = task belongs to specific US for traceability
- Each US is independently testable and deployable
- After each phase checkpoint, stop and validate before proceeding
- Component templates (`.tsx` + `.test.tsx` + `.types.ts` + `.css`) ensure consistency
- Constitution compliance verified at each stage (spec-driven, verification-first, traceability)
