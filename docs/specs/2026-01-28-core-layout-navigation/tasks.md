# Task Breakdown: Core Layout & Navigation

## Overview

Total Tasks: 60+ sub-tasks across 7 major task groups

## Task List

### Foundation: Theme System & Design Tokens

#### Task Group 1: Theme Infrastructure

**Dependencies:** None

- [x] 1.0 Complete theme system foundation
  - [x] 1.1 Write 2-8 focused tests for theme functionality
    - Test theme toggle between dark/light modes
    - Test localStorage persistence of theme preference
    - Test system preference detection on initial load
    - Test theme state synchronization across components
  - [x] 1.2 Extend `globals.css` with glass morphism design tokens
    - Add CSS custom properties for glass effects (backdrop blur, borders, backgrounds)
    - Define `--glass-bg`, `--glass-border`, `--glass-blur` variables for both themes
    - Add emerald/teal color palette tokens (emerald-500, teal-400/500/600)
    - Define text opacity variants (white/50, white/70, white/90 for dark theme)
    - Add gradient text effect tokens (emerald-300 to teal-200)
    - Configure border colors (white/5, white/10 for dark; slate-200/300 for light)
  - [x] 1.3 Create Zustand theme store (`lib/stores/theme-store.ts`)
    - Define theme state type: 'light' | 'dark' | 'system'
    - Implement `toggleTheme` action
    - Implement `setTheme` action with localStorage persistence
    - Add system preference detection using `prefers-color-scheme`
    - Sync with next-themes package for SSR compatibility
  - [x] 1.4 Create `useTheme` hook (`hooks/use-theme.ts`)
    - Wrap next-themes `useTheme` hook with Zustand store
    - Expose theme state and toggle function
    - Handle hydration and SSR edge cases
  - [x] 1.5 Update root layout with ThemeProvider
    - Import and configure next-themes `ThemeProvider`
    - Set default theme to 'dark'
    - Enable system preference detection
    - Add theme transition CSS to root element
  - [x] 1.6 Ensure theme tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify theme switching works correctly
    - Verify localStorage persistence

**Acceptance Criteria:**

- Theme system toggles between dark/light modes smoothly
- User preference persists across sessions
- System preference detected on initial load
- All 2-8 theme tests pass
- CSS variables properly defined for both themes

---

### Foundation: App Shell & Layout Structure

#### Task Group 2: Core Layout Components

**Dependencies:** Task Group 1

- [x] 2.0 Complete app shell and layout structure
  - [x] 2.1 Write 2-8 focused tests for layout components
    - Test sidebar collapse/expand functionality
    - Test responsive behavior (desktop/tablet/mobile)
    - Test keyboard shortcut (Cmd/Ctrl+B) for sidebar toggle
    - Test main content area width adjustment based on sidebar state
  - [x] 2.2 Create app shell layout (`app/(dashboard)/layout.tsx`)
    - Import and wrap with `SidebarProvider` from shadcn/ui
    - Set up CSS Grid or Flexbox for full-height layout
    - Configure sidebar state persistence via cookie
    - Add keyboard shortcut handler for sidebar toggle
    - Ensure proper z-index layering for sidebar and content
  - [x] 2.3 Create main content wrapper component (`components/layout/main-content.tsx`)
    - Use `SidebarInset` component for proper spacing
    - Implement dynamic width adjustment based on sidebar state
    - Add proper padding and scroll handling
    - Ensure responsive behavior across breakpoints
  - [x] 2.4 Configure responsive breakpoints
    - Desktop (≥1024px): Full sidebar (288px) with collapse toggle
    - Tablet (768px-1023px): Collapsed sidebar (72px icon-only)
    - Mobile (<768px): Hidden sidebar with hamburger menu overlay
    - Verify `useIsMobile` hook integration
  - [x] 2.5 Ensure layout tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify sidebar collapse/expand works
    - Verify responsive behavior

**Acceptance Criteria:**

- App shell renders with proper layout structure
- Sidebar collapses/expands on desktop
- Responsive behavior works across all breakpoints
- Keyboard shortcut (Cmd/Ctrl+B) toggles sidebar
- All 2-8 layout tests pass

---

### Feature: Sidebar Navigation Structure

#### Task Group 3: Navigation Menu Data & Components

**Dependencies:** Task Group 2

- [x] 3.0 Complete sidebar navigation menu structure
  - [x] 3.1 Write 2-8 focused tests for navigation components
    - Test navigation menu item rendering
    - Test active state highlighting
    - Test collapsible menu group expand/collapse
    - Test parent group active state when child is selected
    - Test badge count display
  - [x] 3.2 Define navigation menu data structure (`lib/constants/navigation.ts`)
    - Create TypeScript interface for navigation items
    - Define 9 main sections: MY WORK, WORK QUEUES, RECORDS, KNOWLEDGE BASE, ANALYTICS, OPERATIONS, QUALITY CONTROL, DEVELOPMENT, ADMINISTRATION
    - Add all menu items with icons, labels, routes, badge counts (optional)
    - Mark Phase 2 items with `phase: 2` property
    - Implement filtering logic to hide Phase 2 items
    - Add collapsible group support for sections with multiple items
  - [x] 3.3 Create sidebar navigation component (`components/layout/sidebar/app-sidebar.tsx`)
    - Use shadcn/ui `Sidebar` component as base
    - Implement `SidebarHeader`, `SidebarContent`, `SidebarFooter` structure
    - Add glass morphism styling (backdrop-blur-xl, bg-slate-950/80, border-white/5)
    - Set fixed width to 288px (w-72) on desktop
    - Ensure proper spacing and padding
  - [x] 3.4 Create sidebar section component (`components/layout/sidebar/sidebar-section.tsx`)
    - Use `SidebarGroup` and `SidebarGroupLabel` from shadcn/ui
    - Style section headers: uppercase, 10px font, white/50 opacity, tracking-widest
    - Implement collapsible functionality using `Collapsible` from shadcn/ui
    - Add expand/collapse icon with smooth transitions (200ms ease-linear)
  - [x] 3.5 Create sidebar menu item component (`components/layout/sidebar/sidebar-menu-item.tsx`)
    - Use `SidebarMenuItem` and `SidebarMenuButton` from shadcn/ui
    - Integrate HugeIcons React icons (5x5 size)
    - Add text labels with proper spacing (gap-3)
    - Implement active state styling: emerald-500/15 background, emerald-300 text, rounded-2xl
    - Add hover effects with smooth transitions
    - Support optional badge counts using `SidebarMenuBadge`
    - Integrate with Next.js Link for routing
  - [x] 3.6 Implement active page detection (`hooks/use-active-route.ts`)
    - Create hook using Next.js `usePathname`
    - Match current route to navigation items
    - Return active item ID and parent group ID
    - Handle nested routes and dynamic segments
  - [x] 3.7 Implement parent group active state logic
    - Detect when child item is active
    - Apply active styling to parent group
    - Auto-expand parent group on page load if child is active
  - [x] 3.8 Ensure navigation tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify menu items render correctly
    - Verify active states work

**Acceptance Criteria:**

- Navigation menu structure matches visual design
- All 9 sections render with correct items
- Phase 2 items are hidden
- Active state highlighting works correctly
- Parent groups show active state when child is selected
- Collapsible groups expand/collapse smoothly
- All 2-8 navigation tests pass

---

### Feature: Brand Header & User Profile

#### Task Group 4: Sidebar Header & Footer Components

**Dependencies:** Task Group 3

- [x] 4.0 Complete brand header and user profile sections
  - [x] 4.1 Write 2-8 focused tests for header/footer components
    - Test brand logo click navigation to dashboard
    - Test user profile dropdown menu
    - Test avatar fallback with initials
    - Test role badge display
  - [x] 4.2 Create brand header component (`components/layout/sidebar/sidebar-brand.tsx`)
    - Use `SidebarHeader` from shadcn/ui
    - Display logo from `/public/logo.webp` at 44x44px (w-11 h-11)
    - Apply rounded-2xl corners and emerald shadow (shadow-lg shadow-emerald-500/20)
    - Add app title "InCredibly" with gradient text effect (emerald-300 to teal-200)
    - Display version number (e.g., "v1.0.0") in 10px font with white/50 opacity
    - Add optional info icon for phase legend toggle
    - Implement logo click handler to navigate to dashboard
    - Add role indicator badge below brand
  - [x] 4.3 Create user profile section component (`components/layout/sidebar/sidebar-user.tsx`)
    - Use `SidebarFooter` from shadcn/ui
    - Add border separator from navigation area
    - Integrate shadcn/ui `Avatar` component with size variants
    - Display user name and role text below avatar
    - Implement avatar fallback with initials and gradient background
    - Add dropdown toggle button using `DropdownMenu` from shadcn/ui
  - [x] 4.4 Create user menu dropdown component (`components/layout/sidebar/user-menu.tsx`)
    - Use `DropdownMenu` components from shadcn/ui
    - Add user switching options (demo feature)
    - Include profile, settings, and logout menu items
    - Apply glass morphism styling to dropdown panel
    - Add smooth animation transitions
    - Implement keyboard navigation support
  - [x] 4.5 Ensure header/footer tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify brand logo navigation works
    - Verify user dropdown works

**Acceptance Criteria:**

- Brand header displays logo, title, and version correctly
- Logo click navigates to dashboard
- Gradient text effect applied to app title
- User profile section displays avatar and user info
- User dropdown menu opens and closes smoothly
- All 2-8 header/footer tests pass

---

### Feature: Top Navigation Bar

#### Task Group 5: Top Navigation Components

**Dependencies:** Task Group 2

- [x] 5.0 Complete top navigation bar
  - [x] 5.1 Write 2-8 focused tests for top nav components
    - Test breadcrumb navigation rendering
    - Test theme toggle functionality
    - Test notification bell badge count display
    - Test search bar command palette trigger (⌘K)
  - [x] 5.2 Create top navigation bar component (`components/layout/top-nav/top-nav.tsx`)
    - Create sticky header with glass morphism effect
    - Apply `bg-slate-900/60 backdrop-blur-xl` styling
    - Set proper z-index for layering above content
    - Implement flexbox layout for left/right sections
    - Add proper padding and spacing
  - [x] 5.3 Create breadcrumb navigation component (`components/layout/top-nav/breadcrumb-nav.tsx`)
    - Use shadcn/ui `Breadcrumb` components
    - Implement dynamic breadcrumb generation based on current route
    - Use HugeIcons ArrowRight01Icon for separators
    - Apply proper text sizing and color (text-sm, text-muted-foreground)
    - Handle nested routes and dynamic segments
  - [x] 5.4 Create page title component (`components/layout/top-nav/page-title.tsx`)
    - Display h1 heading aligned to left
    - Apply text-2xl sizing with proper font weight
    - Sync with current route/page name
    - Add proper spacing from breadcrumb
  - [x] 5.5 Create global search bar component (`components/layout/top-nav/search-bar.tsx`)
    - Create input with command palette trigger
    - Display ⌘K keyboard shortcut indicator
    - Add search icon from HugeIcons
    - Apply glass morphism styling
    - Add keyboard shortcut listener (Cmd/Ctrl+K)
    - Create placeholder UI (actual search functionality out of scope)
  - [x] 5.6 Create notification bell component (`components/layout/top-nav/notification-bell.tsx`)
    - Use HugeIcons bell icon
    - Add badge count indicator using shadcn/ui `Badge`
    - Create dropdown panel using `DropdownMenu`
    - Apply glass morphism styling to dropdown
    - Add notification list placeholder UI
    - Implement smooth animation transitions
  - [x] 5.7 Create theme toggle component (`components/layout/top-nav/theme-toggle.tsx`)
    - Use HugeIcons sun/moon icons
    - Create icon button with ghost variant
    - Integrate with theme store from Task Group 1
    - Add smooth icon transition animation
    - Position in top-right corner (not nested in menu)
    - Add tooltip showing current theme
  - [x] 5.8 Create sidebar trigger component integration
    - Use `SidebarTrigger` from shadcn/ui
    - Position in top-left corner of navigation bar
    - Style with ghost button variant
    - Ensure keyboard shortcut works (Cmd/Ctrl+B)
  - [x] 5.9 Ensure top nav tests pass
    - Run ONLY the 2-8 tests written in 5.1
    - Verify breadcrumb renders correctly
    - Verify theme toggle works

**Acceptance Criteria:**

- Top navigation bar sticky with glass morphism effect
- Breadcrumb navigation updates based on current route
- Page title displays correctly
- Search bar shows with ⌘K indicator
- Notification bell displays with badge count
- Theme toggle icon visible and functional
- Sidebar trigger button works
- All 2-8 top nav tests pass

---

### Polish: Styling & Accessibility

#### Task Group 6: Design System Refinement

**Dependencies:** Task Groups 1-5

- [x] 6.0 Complete design system refinement and accessibility
  - [x] 6.1 Write 2-8 focused tests for accessibility features
    - Test keyboard navigation (Tab, Enter, Arrow keys)
    - Test focus states visibility
    - Test ARIA labels and roles
    - Test screen reader announcements
    - Test color contrast ratios
  - [x] 6.2 Apply glass morphism styling consistently
    - Audit all components for glass effect application
    - Ensure backdrop-blur-xl applied to sidebar, top nav, modals, cards
    - Verify subtle borders (white/5 for dark, slate-200 for light)
    - Apply semi-transparent backgrounds consistently
    - Optimize performance with `will-change` sparingly
  - [x] 6.3 Refine typography system
    - Verify Inter font family loaded and applied globally
    - Check font weights (400, 500, 600, 700) used correctly
    - Audit heading scale (h1: text-2xl, h2: text-xl, h3: text-lg)
    - Verify body text sizes (sm: 14px, xs: 12px)
    - Check section headers (10px uppercase, tracking-widest)
    - Ensure consistent line heights (1.5 for body, 1.2 for headings)
  - [x] 6.4 Implement keyboard navigation support
    - Add Tab focus navigation through all interactive elements
    - Implement Enter key activation for menu items
    - Add Arrow key navigation for menu traversal
    - Ensure Escape key closes dropdowns and overlays
    - Add skip navigation link for keyboard users
  - [x] 6.5 Add focus states and ARIA attributes
    - Apply visible ring indicators on focus (ring-2 ring-ring)
    - Add ARIA labels to navigation regions
    - Add ARIA roles (navigation, main, complementary)
    - Add ARIA expanded/collapsed states for collapsible groups
    - Add ARIA current="page" for active menu items
    - Add screen reader only text for icon-only buttons
  - [x] 6.6 Verify color contrast compliance
    - Test dark theme contrast ratios (WCAG AA: 4.5:1 for normal text)
    - Test light theme contrast ratios
    - Verify emerald-500 primary color meets standards
    - Check text opacity variants for readability
    - Test active state colors for sufficient contrast
  - [x] 6.7 Optimize animations and transitions
    - Ensure smooth 200ms ease-linear transitions for all interactions
    - Add hover effects to interactive elements
    - Implement smooth theme transition on root element
    - Add loading states for async operations
    - Respect prefers-reduced-motion user preference
  - [x] 6.8 Ensure accessibility tests pass
    - Run ONLY the 2-8 tests written in 6.1
    - Verify keyboard navigation works
    - Verify focus states visible

**Acceptance Criteria:**

- Glass morphism applied consistently across all components
- Typography system matches design specifications
- Keyboard navigation works for all interactive elements
- Focus states visible and meet accessibility standards
- ARIA attributes properly implemented
- Color contrast meets WCAG AA compliance
- Animations smooth and respect user preferences
- All 2-8 accessibility tests pass

---

### Integration: Testing & Documentation

#### Task Group 7: Comprehensive Testing & Gap Analysis

**Dependencies:** Task Groups 1-6

- [x] 7.0 Review existing tests and fill critical gaps
  - [x] 7.1 Review tests from Task Groups 1-6
    - Total existing tests: approximately 12-48 tests (2-8 per group × 6 groups)
    - Audit test coverage for each task group
    - Identify redundant or overlapping tests
  - [x] 7.2 Analyze test coverage gaps for Core Layout & Navigation feature
    - Identify critical user workflows lacking test coverage
    - Focus on integration points between components
    - Identify edge cases not covered by unit tests
    - Check responsive behavior test coverage
    - Check theme switching integration test coverage
  - [x] 7.3 Write up to 10 additional strategic tests maximum
    - Add integration test for sidebar + top nav coordination
    - Add test for theme persistence across page navigation
    - Add test for active state propagation to parent groups
    - Add test for responsive sidebar behavior (desktop → mobile)
    - Add test for keyboard shortcut conflicts
    - Add test for breadcrumb generation from nested routes
    - Add test for glass morphism styling in both themes
    - Add end-to-end test for complete navigation workflow
    - Add test for sidebar state persistence via cookie
    - Add test for accessibility compliance (keyboard nav + screen reader)
  - [x] 7.4 Run feature-specific tests only
    - Run ONLY tests related to Core Layout & Navigation feature
    - Expected total: approximately 22-58 tests maximum (12-48 + up to 10)
    - Do NOT run the entire application test suite
    - Generate test coverage report for this feature only
  - [x] 7.5 Create component documentation
    - Document all reusable components in `components/layout/`
    - Add JSDoc comments for props and usage examples
    - Create Storybook stories for key components (optional)
    - Document theme system usage and customization
    - Document navigation menu data structure and extension
  - [x] 7.6 Update project README
    - Add section on layout and navigation structure
    - Document theme system and customization
    - Add keyboard shortcuts reference
    - Document responsive behavior breakpoints
    - Add accessibility features documentation

**Acceptance Criteria:**

- All feature-specific tests pass (22-58 tests maximum) ✅ 71 tests passing
- Critical user workflows covered by tests ✅
- Integration points between components tested ✅
- No more than 10 additional tests added ✅ 10 integration tests added
- Component documentation complete ✅ docs/components/layout-navigation.md created
- README updated with layout/navigation information ✅

---

## Execution Order

Recommended implementation sequence:

1. **Foundation: Theme System & Design Tokens (Task Group 1)**
   - Establish theme infrastructure first
   - Required by all subsequent components

2. **Foundation: App Shell & Layout Structure (Task Group 2)**
   - Build core layout structure
   - Required by sidebar and top nav

3. **Feature: Sidebar Navigation Structure (Task Group 3)**
   - Implement navigation menu system
   - Core feature for app navigation

4. **Feature: Brand Header & User Profile (Task Group 4)**
   - Complete sidebar header and footer
   - Depends on sidebar structure

5. **Feature: Top Navigation Bar (Task Group 5)**
   - Implement top navigation components
   - Depends on theme system and layout

6. **Polish: Styling & Accessibility (Task Group 6)**
   - Refine design system and accessibility
   - Applies to all components

7. **Integration: Testing & Documentation (Task Group 7)**
   - Comprehensive testing and documentation
   - Final validation of all features

---

## Key Technical Notes

### Component Reusability

All components in `components/layout/` should be built with reusability in mind:

- Use TypeScript interfaces for props
- Support className prop for customization
- Use composition over configuration
- Follow shadcn/ui patterns

### Performance Considerations

- Memoize navigation menu data structure
- Use React.memo for menu item components
- Optimize backdrop-blur with will-change sparingly
- Minimize theme transition layout shifts
- Use CSS containment for sidebar

### Accessibility Standards

- WCAG 2.1 Level AA compliance required
- Semantic HTML5 elements throughout
- ARIA labels for all navigation regions
- Keyboard navigation fully supported
- Focus visible styles on all interactive elements
- Screen reader tested

### Testing Strategy

- Focus on critical user workflows
- Test integration points between components
- Verify responsive behavior across breakpoints
- Test theme switching and persistence
- Test keyboard navigation and accessibility
- Limit to 2-8 tests per task group during development
- Add up to 10 strategic integration tests at the end

### Design System Tokens

All design tokens should be defined as CSS custom properties in `globals.css`:

- Color palette (emerald/teal primary, slate backgrounds)
- Glass morphism effects (backdrop blur, borders, backgrounds)
- Typography scale (font sizes, weights, line heights)
- Spacing system (padding, margins, gaps)
- Border radius tokens (rounded-2xl, etc.)
- Shadow utilities (emerald glow effects)

### Navigation Menu Data Structure

The navigation menu in `lib/constants/navigation.ts` should follow this structure:

```typescript
interface NavigationItem {
  id: string;
  label: string;
  icon: HugeiconsIcon;
  href: string;
  badge?: number;
  phase: 1 | 2;
}

interface NavigationSection {
  id: string;
  label: string;
  items: NavigationItem[];
  collapsible: boolean;
}

const navigationSections: NavigationSection[] = [
  // 9 sections as defined in spec
];
```

### Responsive Breakpoints

- Mobile: < 768px (sidebar hidden, hamburger menu)
- Tablet: 768px - 1023px (sidebar collapsed to 72px icon-only)
- Desktop: ≥ 1024px (sidebar full width 288px with collapse toggle)
- Use Tailwind's default breakpoints: md (768px), lg (1024px)

### Glass Morphism Styling Pattern

Apply consistently across components:

```css
backdrop-filter: blur(40px);
background: rgba(255, 255, 255, 0.03); /* dark theme */
border: 1px solid rgba(255, 255, 255, 0.05);
```

### Active State Styling Pattern

For navigation menu items:

```css
background: rgba(16, 185, 129, 0.15); /* emerald-500/15 */
color: rgb(110, 231, 183); /* emerald-300 */
border-radius: 1rem; /* rounded-2xl */
box-shadow: 0 0 20px rgba(16, 185, 129, 0.2); /* emerald glow */
```

---

## Phase 2 Items (Hidden in Phase 1)

The following navigation items should be marked with `phase: 2` and hidden:

- State Board Directory (KNOWLEDGE BASE)
- Document Templates (KNOWLEDGE BASE)
- Payer Library (KNOWLEDGE BASE)
- Schema Workspace (KNOWLEDGE BASE)
- NCQA Compliance (ANALYTICS)
- Compliance & Audit (ANALYTICS)
- All OPERATIONS section items
- Most QUALITY CONTROL section items (except First Pass Rate)
- Portal Configuration (ADMINISTRATION)
- Billing (ADMINISTRATION)

These items will be rendered when Phase 2 features are ready, without phase badges.
