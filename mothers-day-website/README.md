# 🌸 Mother's Day Greeting Website

A beautiful, accessible, and performant Mother's Day web application built with React 18, TypeScript, and Vite.

## ✨ Features

### User Story 1: Animated Greeting (US1)
- **Beautiful landing animation** with fade-in and slide effects
- **Personalized greeting message** in Spanish: "¡Feliz Día de las Madres!"
- **Motion accessibility** - Respects `prefers-reduced-motion` setting
- **Responsive design** - Optimized for mobile (320px), tablet (768px), and desktop (1920px)
- **WCAG AA compliant** - Full accessibility support

### User Story 2: Image Gallery (US2)
- **Curated gallery** of high-quality Mother's Day images
- **Keyboard navigation** - Navigate with arrow keys (left/right)
- **Responsive grid layout**: 1-col mobile, 2-col tablet, 3-4 col desktop
- **Lazy loading** - Images load on demand for performance
- **Touch-friendly** - 44px minimum touch targets

### User Story 3: Personalized Message (US3)
- **Character counter** - Real-time character count (max 500 chars)
- **Input validation** - Enforces 500 character limit
- **Message display** - Shows saved message with toggle visibility
- **Full accessibility** - Keyboard navigation and screen reader support

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18.x + TypeScript 5.x |
| **Build Tool** | Vite 8.x |
| **Styling** | CSS Modules |
| **Testing** | Vitest + React Testing Library + Playwright |
| **Accessibility** | axe-core + jest-axe |
| **Code Quality** | ESLint + Prettier |

## 🚀 Quick Start

### Installation
```bash
npm install           # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing
```bash
npm run test         # Run all unit & integration tests
npm run test:e2e     # Run Playwright E2E tests
npm run test:watch   # Watch mode
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # TypeScript check
```

## 📊 Performance

- **Bundle Size**: 63 KB (gzipped) - well under 100 KB target
- **Core Web Vitals**: LCP < 2.5s, CLS < 0.1, INP < 200ms
- **Lighthouse Targets**: Performance ≥ 85, Accessibility ≥ 90

## ♿ Accessibility

- ✅ **WCAG 2.1 Level AA** - 0 axe violations
- ✅ **Keyboard Navigation** - Full support
- ✅ **Screen Reader Support** - Semantic HTML + ARIA
- ✅ **Motion Preferences** - Respects `prefers-reduced-motion`
- ✅ **Color Contrast** - 4.5:1 ratio (WCAG AA)

## 🧪 Test Coverage

- **Unit Tests**: 80+ tests
- **Integration Tests**: 14 tests
- **E2E Tests**: 11+ tests
- **Accessibility Tests**: 25+ tests (0 violations)
- **Total**: 130+ tests, 100% pass rate

## 📁 Project Structure

```
src/
├── components/
│   ├── GreetingAnimation/  # Landing animation (US1)
│   ├── Gallery/            # Image gallery (US2)
│   ├── MessageForm/        # Message form (US3)
│   └── MothersDayPage/     # Main composition
├── hooks/                  # useAnimationPreference, useGalleryNavigation
├── constants/              # greetingText, galleryImages, animations
└── test/                   # Test setup

e2e/                        # Playwright E2E tests
```

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Component design and patterns
- [TESTING.md](./TESTING.md) - Testing strategy and examples
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

## 🌐 Deployment

Ready for deployment to Vercel, Netlify, GitHub Pages, or any static host.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📄 License

Built with ❤️ for Mother's Day 2026
