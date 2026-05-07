# Mother's Day Greeting Website - Spec-Driven Development Guide

## 🎉 What We Built (Documentation)

You now have a **complete specification and plan** for a Mother's Day greeting website. This follows **Spec-Driven Development** best practices:

### 📋 Three Key Documents Created

1. **`spec.md`** - The "What"
   - 3 prioritized user stories (US1: Greeting, US2: Gallery, US3: Message)
   - Acceptance criteria for each story
   - Success metrics (Lighthouse ≥ 85, LCP < 2.5s, etc.)
   - Edge cases and assumptions documented

2. **`plan.md`** - The "How"
   - Technical stack (React 18 + TypeScript + Framer Motion + Tailwind)
   - Component architecture (folder structure, template patterns)
   - Constitution alignment (verified all React/testing requirements)
   - Testing strategy (unit + integration + E2E + accessibility)

3. **`tasks.md`** - The "Work Breakdown"
   - 86 specific tasks organized by phase and user story
   - Each task has a unique ID (T001, T002, etc.)
   - Tasks are parallelizable where possible [P]
   - Clear checkpoints between phases

---

## 🚀 How to Execute This (Next Steps)

### Step 1: Project Setup (Phase 1 - 1-2 hours)

```bash
# Navigate to your project
cd /Users/qsuma/holaMundo

# Read the tasks to understand what needs setup
# Tasks: T001-T011 (Phase 1)

# Install dependencies (from plan.md)
npm install react react-dom framer-motion clsx
npm install --save-dev typescript tailwindcss prettier eslint husky vitest @testing-library/react @axe-core/react playwright

# Create project structure manually or use the scaffolding from plan.md
mkdir -p src/components/{GreetingAnimation,Gallery,MessageForm,MothersDayPage}
mkdir -p src/hooks src/constants src/assets/images
mkdir -p tests/{unit,integration,e2e}

# Initialize TypeScript strict mode in tsconfig.json
# Initialize ESLint, Prettier, Tailwind
```

### Step 2: Foundation (Phase 2 - 2-3 hours)

Create the reusable hooks and base components:

- **`src/hooks/useAnimationPreference.ts`** → Detects user's motion preference
- **`src/hooks/useGalleryNavigation.ts`** → Handles keyboard/mouse navigation logic
- **`src/components/MothersDayPage/MothersDayPage.tsx`** → Page wrapper

✅ **Write tests FIRST** for these hooks (T012-T017)

### Step 3: Build US1 - Animated Greeting (Phase 3 - 4-6 hours)

Components:
- **`src/components/GreetingAnimation/GreetingAnimation.tsx`** → Framer Motion animation

Test-Driven Development:
1. Write failing tests (T019-T025)
2. Implement component
3. Tests pass
4. Add accessibility tests
5. Add E2E tests (Playwright)

### Step 4: Build US2 - Image Gallery (Phase 4 - 6-8 hours)

Components:
- **`src/components/Gallery/Gallery.tsx`** → Main gallery container
- **`src/components/Gallery/GalleryImage.tsx`** → Reusable image component

Test-Driven Development:
1. Write failing tests (T032-T043)
2. Implement components
3. Tests pass
4. Keyboard navigation, touch support, lazy loading
5. E2E tests

### Step 5: Build US3 - Message Form (Phase 5 - 3-4 hours)

Components:
- **`src/components/MessageForm/MessageForm.tsx`** → Form with validation
- **`src/components/MessageForm/MessageDisplay.tsx`** → Message display

Test-Driven Development:
1. Write failing tests (T054-T063)
2. Implement components
3. Tests pass
4. Character counter, validation, persistence

### Step 6: Integration & Polish (Phase 6-7 - 2-3 hours)

- Verify all components work together
- Run Lighthouse audit
- Run accessibility audit (axe-core)
- Document the feature

---

## 📚 Spec-Driven Development Best Practices (What You're Learning)

### ✅ The Right Way (What We Did)

1. **Write the spec FIRST** ← You define the problem before solving it
2. **Get buy-in** ← Review spec with stakeholders
3. **Write tests from the spec** ← Tests are executable spec
4. **Implement to pass tests** ← Code is secondary to spec
5. **Verify against spec** ← Did we build what was asked?

### ❌ The Wrong Way (What We Avoided)

- ❌ "Just start coding" → No shared understanding
- ❌ "Figure out tests later" → Tests become afterthought
- ❌ "Scope creep" → No clear acceptance criteria
- ❌ "Over-engineer" → No complexity tracking

---

## 🏗️ Architecture You're Building

```
MothersDayPage (Main Page)
├── GreetingAnimation (US1)
│   └── uses: useAnimationPreference hook
├── Gallery (US2)
│   ├── GalleryImage (reusable component)
│   └── uses: useGalleryNavigation hook
└── MessageForm (US3)
    └── MessageDisplay (sub-component)
```

### Why This Structure?

✅ **Components by feature** (not by type)  
✅ **Template pattern** (each `.tsx` has paired `.test.tsx` + `.types.ts`)  
✅ **Custom hooks** (reusable logic, testable independently)  
✅ **Constants centralized** (easy to i18n, modify, reuse)  
✅ **Independent stories** (can deploy US1 without US2)  

---

## ✨ Key Features You'll Implement

### 1. Animated Greeting (US1)
- Framer Motion animation (fade-in + slide)
- Respects `prefers-reduced-motion`
- Responsive on all devices
- Accessibility: ARIA labels, color contrast, semantic HTML

### 2. Image Gallery (US2)
- Responsive grid (1 column mobile → 4 columns desktop)
- Keyboard navigation (arrow keys)
- Touch/swipe support
- Lazy image loading
- Accessibility: keyboard focus visible, alt text, ARIA labels

### 3. Personalized Message (US3)
- Form validation (max 500 characters)
- Character counter
- Submit stores message
- Toggle display
- Accessibility: labels, semantic forms, aria-live updates

---

## 📊 Quality Standards (From Constitution)

Before you merge this feature, verify:

- [ ] **Lighthouse score ≥ 85** (performance, accessibility, best practices)
- [ ] **Core Web Vitals pass** (LCP < 2.5s, CLS < 0.1)
- [ ] **0 accessibility violations** (axe-core scan)
- [ ] **80% test coverage minimum** (unit + integration)
- [ ] **1 E2E test per P1 story** (full user flow)
- [ ] **TypeScript strict mode** (no `any` types)
- [ ] **ESLint + Prettier passing** (code quality)
- [ ] **All user stories testable independently** (not coupled)

---

## 🔄 How to Make This Reusable

Once you build this feature, it's designed to be reusable:

### Easy Customizations

1. **Change greeting text** → Edit `src/constants/greetingText.ts`
2. **Add more images** → Edit `src/constants/galleryImages.ts`
3. **Change colors/fonts** → Edit Tailwind config or `.module.css`
4. **Change animations** → Edit `src/constants/animations.ts`
5. **Add i18n** → Move strings to i18n library (already in constants)

### Future Extensions

- Add backend storage for messages (currently sessionStorage)
- Add i18n support (strings are already centralized)
- Add image upload (currently static images)
- Add QR code sharing
- Add email sending

---

## 📖 Files You Now Have

```
specs/001-mothers-day/
├── spec.md          ← Feature specification (complete)
├── plan.md          ← Technical plan (complete)
├── tasks.md         ← Work breakdown (86 tasks, ready to execute)
└── README.md        ← This file
```

---

## 🎯 Your Learning Checklist

As you build this feature, verify you understand:

- [ ] Why each user story is prioritized (P1 vs P2)
- [ ] How to write acceptance criteria (Given-When-Then)
- [ ] Why tests come BEFORE implementation (TDD)
- [ ] How components follow the template pattern
- [ ] Why components are organized by feature, not by type
- [ ] How custom hooks reduce component complexity
- [ ] How to ensure accessibility (WCAG 2.1 AA)
- [ ] How to verify performance (Lighthouse, Core Web Vitals)
- [ ] Why independent user stories reduce deployment risk
- [ ] How to scale this to multiple features

---

## 🚨 Pro Tips

1. **Don't skip Phase 2 (Foundation)** → Hooks are reused by all stories
2. **Write tests first, watch them fail** → This verifies your understanding
3. **Implement to pass tests, not to "feel done"** → Tests are your spec
4. **Don't add features not in spec** → Scope creep kills projects
5. **Accessibility isn't optional** → Build it in, don't add it later
6. **Performance isn't optional** → Bundle size matters
7. **Documentation isn't optional** → Future you will thank present you

---

## 📞 Questions to Ask While Building

- Does this component do one thing well?
- Can I test this independently?
- Is this text/image in a constant (for i18n)?
- Does this respect accessibility standards?
- Does this pass ESLint + Prettier?
- Does this pass TypeScript strict mode?
- Could someone else understand my code?
- Could this be reused elsewhere?

---

## 🎓 What You're Learning

This project teaches you:

✅ **Spec-Driven Development** (define requirements first)  
✅ **Test-Driven Development** (tests guide implementation)  
✅ **Component Architecture** (organize by feature + templates)  
✅ **React Best Practices** (hooks, composition, props)  
✅ **TypeScript** (strict types, interfaces)  
✅ **Testing Strategy** (unit + integration + E2E + a11y)  
✅ **Accessibility** (WCAG 2.1 AA compliance)  
✅ **Performance** (Lighthouse, Web Vitals, code splitting)  
✅ **Reusability** (design for future extensions)  

---

## 🎬 Ready to Start?

1. **Read** the spec.md to understand what you're building
2. **Review** the plan.md to understand how you'll build it
3. **Open** tasks.md and start with Phase 1 setup
4. **Build** incrementally, testing as you go
5. **Learn** why each decision was made

**This is a real-world project structure. Use it as a template for all your future features!**

---

Good luck! 🚀 Happy coding, and happy Mother's Day to your mom! 💚
