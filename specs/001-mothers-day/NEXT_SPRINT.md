# Next Sprint: Phase 5-7 (MessageForm → Deployment)

## 🎯 Goal: Complete MVP + Polish (2-3 hours remaining)

**CRITICAL FIXES JUST COMPLETED** ✅:
1. ✅ E2E tests for US1 Greeting (T024-T025) - Playwright tests created
2. ✅ E2E tests for US2 Gallery (T040-T043) - Playwright tests created  
3. ✅ Accessibility tests for US1 (T023) - axe-core tests created
4. ✅ Accessibility tests for US2 (T037-T039) - axe-core tests created
5. ✅ plan.md updated: CSS Modules + CSS @keyframes (removed Framer Motion references)
6. ✅ Performance task (T077) now includes specific Lighthouse config and 4G throttle settings

**Status**: Phase 3-4 now FULLY COMPLETE with all verification tests ✅
**Progress**: 56/90 tasks (62% complete - up from 54%)

---

## Phase 5: MessageForm Component (US3) - 3-4 hours

### What to Build
```
MessageForm Component
├── Text Input (max 500 chars)
├── Character Counter (e.g., "42 / 500")
├── Submit Button
├── Toggle Display Button
└── MessageDisplay (shows saved message)
```

### Quick Implementation Checklist

- [ ] **Create component files**
  ```bash
  # Create directory
  mkdir -p src/components/MessageForm
  
  # Files to create:
  # - MessageForm.tsx (main component)
  # - MessageDisplay.tsx (displays saved message)
  # - MessageForm.types.ts (TypeScript interfaces)
  # - MessageForm.module.css (styles)
  # - MessageForm.test.tsx (unit tests)
  ```

- [ ] **MessageForm.tsx structure**
  ```tsx
  export function MessageForm() {
    const [messageText, setMessageText] = useState('');
    const [isDisplaying, setIsDisplaying] = useState(false);
    
    const handleSubmit = () => {
      // Save message (state already holds it)
      setIsDisplaying(true);
      // Clear input if desired
    };
    
    const handleToggle = () => {
      setIsDisplaying(!isDisplaying);
    };
    
    return (
      <div>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value.slice(0, 500))}
          maxLength={500}
        />
        <span>{messageText.length} / 500</span>
        <button onClick={handleSubmit}>Submit Message</button>
        <button onClick={handleToggle}>
          {isDisplaying ? 'Hide' : 'Show'} Message
        </button>
        {isDisplaying && messageText && (
          <MessageDisplay
            message={messageText}
            onClose={() => setIsDisplaying(false)}
          />
        )}
      </div>
    );
  }
  ```

- [ ] **Styles to include** (MessageForm.module.css)
  - Input: `min-height: 44px`, `font-size: 16px`, focus outline
  - Counter: positioned below input, `font-size: 12px`
  - Buttons: `min-height: 44px`, clear hover states
  - Responsive: full width mobile, max-width 600px desktop

- [ ] **Write tests first** (TDD)
  - Renders input + counter + buttons
  - Character counter updates correctly
  - Max 500 chars enforced
  - Submit works
  - Toggle works
  - Accessibility (label, aria-live)

- [ ] **Integrate into MothersDayPage.tsx**
  ```tsx
  import { MessageForm } from '../MessageForm/MessageForm';
  
  // Add to MothersDayPage render:
  <section className={styles.section}>
    <h2 className={styles.sectionTitle}>Escribe un Mensaje</h2>
    <MessageForm />
  </section>
  ```

---

## Phase 6: Integration Testing (2-3 hours)

### Run E2E Tests with Playwright

```bash
# Test full user flow
npm run test:e2e

# Test cases to verify:
# 1. User lands → greeting animates
# 2. User scrolls to gallery → arrow keys work
# 3. User scrolls to message form → types + submits
# 4. All 3 components visible + working together
```

### Run Accessibility Audit

```bash
# Install axe-core if not already
npm install --save-dev @axe-core/playwright

# Run audit on full page
npm run test -- --reporter=verbose

# Manual keyboard test:
# - Tab through entire page
# - All interactive elements reachable
# - Focus indicators visible
# - Screen reader reads everything correctly
```

### Performance Check

```bash
# Build production
npm run build

# Check output size
ls -lh dist/

# Run Lighthouse
npm run lighthouse

# Target: 85+ score, LCP < 2.5s
```

---

## Phase 7: Polish & Documentation (2-3 hours)

### Documentation Files to Create

1. **README.md**
   - What it does (Mother's Day greeting website)
   - How to run (npm install, npm run dev)
   - Technologies (React, TypeScript, Vitest, Playwright)

2. **ARCHITECTURE.md**
   - Component hierarchy
   - Custom hooks
   - State management pattern
   - CSS structure

3. **TESTING.md**
   - How to run tests
   - Test coverage info
   - Adding new tests

### Final Quality Checks

```bash
# Code quality
npm run lint          # 0 errors, 0 warnings
npm run format        # All files formatted
npm run type-check    # 0 TypeScript errors

# Tests
npm run test          # All unit/integration pass
npm run test:e2e      # All E2E pass

# Build
npm run build         # No errors
# Check: dist/ < 100KB gzipped
```

---

## Success Criteria

- [x] Phase 1-4: Foundation + Greeting + Gallery
- [ ] Phase 5: MessageForm integrated and tested
- [ ] Phase 6: Full page E2E tests pass, accessibility audit clean
- [ ] Phase 7: All docs complete, 0 errors, ready to ship

---

## Time Breakdown

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 5 | Component implementation | 2-3 hrs | 🔄 Next |
| 5 | Integration into page | 30 mins | 🔄 Next |
| 6 | E2E testing | 1-2 hrs | 🔄 Then |
| 6 | Accessibility audit | 30 mins | 🔄 Then |
| 7 | Documentation | 1 hr | 🔄 Finally |
| 7 | Final quality checks | 1 hr | 🔄 Finally |
| **Total** | | **6-8 hrs** | |

---

## Commands Reference

```bash
# Development
npm install && npm run dev

# Testing
npm run test              # Unit tests
npm run test:e2e         # E2E tests

# Quality
npm run lint             # ESLint
npm run format           # Prettier
npm run type-check       # TypeScript

# Production
npm run build            # Build for production
npm run preview          # Preview production build
```

---

## Notes

- Component template pattern ensures consistency
- All components follow accessibility best practices
- Tests written first (TDD) reduce rework
- Each phase is independently deployable
- After Phase 6, MVP is ready to ship
- Phase 7 is polish/documentation (nice-to-have before launch)

**Current Status**: 49/90 tasks complete (54%)  
**Estimated to MVP**: 6-8 more hours  
**Total Project Time**: ~3-4 weeks solo development
