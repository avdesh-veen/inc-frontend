# InCredibly Platform

A modern credentialing and provider enrollment management platform built with Next.js 16, React 19, and TypeScript.

## Overview

InCredibly is a comprehensive platform for managing healthcare provider credentialing, enrollment, and compliance workflows. The application features a sophisticated layout system with glass morphism design, dark/light theme switching, and full accessibility support.

## Tech Stack

- **Framework:** Next.js 16.1.5 (App Router)
- **React:** 19.2.3
- **TypeScript:** 5.x (strict mode)
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Icons:** HugeIcons React
- **State Management:** Zustand 5.0.10
- **Forms:** React Hook Form + Zod validation
- **Server State:** TanStack Query
- **Testing:** Jest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm test         # Run test suite
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript compiler check
```

## Layout & Navigation

### Application Shell

The application uses a fixed sidebar navigation layout with:

- **Sidebar:** 288px width on desktop, collapsible with Cmd/Ctrl+B
- **Top Navigation:** Sticky header with breadcrumbs, search, notifications, and theme toggle
- **Responsive Behavior:**
  - Desktop (≥1024px): Full sidebar with collapse toggle
  - Tablet (768px-1023px): Collapsed sidebar (72px icon-only)
  - Mobile (<768px): Hidden sidebar with hamburger menu overlay

### Navigation Structure

The sidebar contains 9 main sections:

1. **MY WORK** - Dashboard, My Tasks, Case Inbox, Email Inbox
2. **WORK QUEUES** - All Work Orders
3. **RECORDS** - Clients, Providers, Payers, Business Entities
4. **KNOWLEDGE BASE** - Payer Guides
5. **ANALYTICS** - Performance, Client Insights
6. **OPERATIONS** - (Phase 2)
7. **QUALITY CONTROL** - First Pass Rate
8. **DEVELOPMENT** - Portal Preview
9. **ADMINISTRATION** - Users & Roles, Settings

### Theme System

The application supports dark and light themes with:

- **Default Theme:** Dark mode
- **Theme Toggle:** Directly accessible in top navigation
- **System Preference Detection:** Automatically detects OS theme preference
- **Persistence:** Theme preference saved to localStorage
- **Smooth Transitions:** 200ms ease-linear transitions

**Keyboard Shortcuts:**

- `Cmd/Ctrl+B` - Toggle sidebar
- `Cmd/Ctrl+K` - Focus search bar

## Design System

### Glass Morphism

The application features a glass morphism design system with:

- **Backdrop Blur:** Medium intensity (40px)
- **Semi-transparent Backgrounds:** rgba values for depth
- **Subtle Borders:** Low opacity (white/5 for dark, slate-200 for light)
- **Applied To:** Sidebar, top nav, modals, cards, dropdowns

### Color Palette

**Dark Theme:**

- Primary: emerald-500 (#10b981)
- Accent: teal-400, teal-500
- Background: slate-950, slate-900
- Text: white with opacity variants (50%, 70%, 90%)
- Borders: white/5, white/10

**Light Theme:**

- Primary: emerald-600
- Accent: teal-600
- Background: white, slate-50
- Text: slate-900 with opacity variants
- Borders: slate-200, slate-300

### Typography

- **Font Family:** Inter (Google Fonts)
- **Font Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Heading Scale:** h1 (2xl), h2 (xl), h3 (lg)
- **Body Text:** sm (14px), xs (12px)
- **Section Headers:** 10px uppercase with tracking-widest

## Accessibility

The application meets WCAG 2.1 Level AA compliance with:

### Keyboard Navigation

- **Tab:** Navigate through interactive elements
- **Enter:** Activate menu items and buttons
- **Escape:** Close dropdowns and modals
- **Arrow Keys:** Navigate within menus
- **Cmd/Ctrl+B:** Toggle sidebar
- **Cmd/Ctrl+K:** Focus search bar

### ARIA Support

- Proper semantic HTML5 structure
- ARIA labels for all navigation regions
- ARIA roles (navigation, main, banner, complementary)
- ARIA current="page" for active menu items
- ARIA expanded/collapsed states for collapsible sections
- Screen reader announcements for state changes

### Focus Management

- Visible focus indicators (ring-2 ring-ring)
- Logical tab order
- Focus trap in modals and dropdowns
- Skip navigation link for keyboard users

### Color Contrast

All text meets WCAG AA standards:

- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Active states: Enhanced contrast with emerald-300

## Testing

### Test Coverage

The application includes comprehensive test coverage:

- **Theme System:** 6 tests
- **Layout Components:** 6 tests
- **Navigation:** 4 test suites
- **Header/Footer:** 6 tests
- **Top Navigation:** 4 tests
- **Accessibility:** 14 tests
- **Integration:** 10 tests

**Total: 71 tests**

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with coverage
pnpm test -- --coverage

# Run specific test file
pnpm test __tests__/theme.test.tsx
```

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **Component Documentation:** `docs/components/layout-navigation.md`
- **Product Roadmap:** `docs/product/roadmap.md`
- **Specifications:** `docs/specs/`
- **Standards:** `docs/standards/frontend/`

## Project Structure

```
incredibly/
├── app/                      # Next.js App Router
│   ├── (dashboard)/         # Route group with layout
│   ├── globals.css          # Global styles & CSS variables
│   └── layout.tsx           # Root layout
│
├── components/
│   ├── layout/              # Layout & navigation components
│   │   ├── sidebar/         # Sidebar components
│   │   └── top-nav/         # Top navigation components
│   └── ui/                  # shadcn/ui components
│
├── hooks/                   # Custom React hooks
│   ├── use-theme.ts        # Theme management
│   ├── use-active-route.ts # Active route detection
│   └── use-mobile.ts       # Mobile breakpoint detection
│
├── lib/
│   ├── constants/          # Application constants
│   │   └── navigation.ts   # Navigation menu structure
│   ├── stores/             # Zustand stores
│   │   └── theme-store.ts  # Theme state management
│   └── utils.ts            # Utility functions
│
├── __tests__/              # Test files
│   ├── theme.test.tsx
│   ├── layout.test.tsx
│   ├── navigation.test.tsx
│   ├── accessibility.test.tsx
│   └── integration.test.tsx
│
└── docs/                   # Documentation
    ├── components/         # Component docs
    ├── product/           # Product documentation
    ├── specs/             # Feature specifications
    └── standards/         # Coding standards
```

## Customization

### Adding Navigation Items

Edit `lib/constants/navigation.ts`:

```typescript
{
  id: 'new-feature',
  label: 'New Feature',
  icon: NewFeatureIcon,
  href: '/new-feature',
  badge: 3,
  phase: 1
}
```

### Customizing Theme Colors

Update CSS variables in `app/globals.css`:

```css
:root {
  --color-primary: theme("colors.emerald.500");
  --color-accent: theme("colors.teal.500");
}
```

### Adjusting Responsive Breakpoints

Modify `tailwind.config.ts`:

```typescript
theme: {
  screens: {
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  }
}
```

## Contributing

Please follow the coding standards documented in `docs/standards/frontend/` when contributing to this project.

## License

Proprietary - All rights reserved

## Support

For questions or issues, please contact the development team.
