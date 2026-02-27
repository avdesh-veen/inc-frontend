# Spec Requirements: Core Layout & Navigation

## Initial Description

Core Layout & Navigation - App shell with fixed sidebar navigation (72 width, dark slate theme), top navigation bar with user profile and notifications, glass morphism design system (backdrop blur, subtle borders), dark/light theme switcher with persistent user preference, dark theme implementation with emerald/teal accent colors, light theme implementation with proper contrast and accessibility, theme toggle component in navigation bar or user menu, system preference detection (prefers-color-scheme), theme state management and localStorage persistence, responsive sidebar with collapsible menu groups, navigation menu items with active states and hover effects, brand header with logo and version display, phase badge system for feature visibility (Phase 1/Phase 2), main content area with proper spacing and scroll handling, typography system using Inter font family, and color palette setup (emerald-500 primary, teal accents, slate grays for dark, appropriate light mode colors).

## Requirements Discussion

### First Round Questions

**Q1: Sidebar Width & Responsiveness**
I assume the sidebar should be 72px (icon-only) on mobile/tablet and expand to ~280px with labels on desktop. Should it be collapsible on desktop, or always expanded?

**Answer:** Collapsible on desktop

**Q2: Navigation Structure**
I'm thinking the sidebar should have collapsible menu groups like "Work Management" (Cases, Tasks, Work Orders), "Configuration" (Settings, Work Types), "Clients & Providers", and "Analytics" (Dashboard, Performance, FPR). Does this grouping align with how users think about the product?

**Answer:** Please refer to visuals in visuals folder for UI reference of how sidebar and navigation menu should look like

**Q3: User Menu Location**
I assume the user profile, notifications, and theme toggle should all live in the top navigation bar (top-right corner). Should the theme toggle be directly visible as an icon, or nested inside the user dropdown menu?

**Answer:** Theme toggle should be directly visible as an icon in the top right corner of the navigation bar

**Q4: Phase Badge Visibility**
For the Phase 1/Phase 2 badge system, should these badges appear next to navigation menu items to indicate feature maturity, or should Phase 2 items be hidden entirely until they're ready?

**Answer:** Phase 2 items should be hidden entirely until they're ready

**Q5: Brand Header**
I'm assuming the brand header in the sidebar should show the InCredibly logo and a version number (e.g., "v1.0.0"). Should clicking the logo navigate to the dashboard, or stay on the current page?

**Answer:** Navigate to the dashboard. For logo use the logo in the public folder at /public/logo.webp

**Q6: Glass Morphism Intensity**
For the glass morphism design (backdrop blur, subtle borders), should this apply to the sidebar, top nav, modals, and cards throughout the app, or be more selective? What level of blur feels right (light/medium/heavy)?

**Answer:** Apply to the sidebar, top nav, modals, and cards throughout the app using theme variables. It should be medium blur.

**Q7: Active Navigation States**
I assume navigation items should show active states with the emerald-500 accent color (left border indicator + icon/text color change). Should parent menu groups also show an active state when a child item is selected?

**Answer:** Yes, parent menu groups should also show active states

**Q8: Notification System**
The top nav includes notifications. Should this be a bell icon with a badge count that opens a dropdown panel, or something more prominent? What types of notifications should appear here (SLA breaches, task assignments, system alerts)?

**Answer:** Bell icon with a badge count that opens a dropdown panel

### Existing Code to Reference

No reference available since this is the 1st feature.

### Follow-up Questions

No follow-up questions needed. Visual assets and HTML reference provide comprehensive UI patterns.

## Visual Assets

### Files Provided:

Visual assets were verified via bash command in the visuals folder:

- `dashboard.png`: Shows the main dashboard layout with sidebar navigation, top header, and content area. Features dark theme with emerald/teal accents, glass morphism cards, and comprehensive data visualizations.

- `user-roles.png`: Displays the Users & Roles management screen with the same navigation structure. Shows table layout with role badges, status indicators, and action buttons.

- `workflows.png`: Shows the Settings/Configuration Center screen with left sidebar navigation for settings categories and main content area displaying work type categories and work types table.

### Visual Insights:

**Navigation Structure (from visuals):**
The sidebar contains the following hierarchical menu groups:

1. **MY WORK**
   - Dashboard
   - My Tasks (with badge count)
   - Case Inbox
   - Email Inbox (with badge count)

2. **WORK QUEUES**
   - All Work Orders (with badge count)

3. **RECORDS**
   - Clients (with badge count)
   - Providers
   - Payers
   - Business Entities

4. **KNOWLEDGE BASE**
   - Payer Guides
   - State Board Directory (Phase 2)
   - Document Templates (Phase 2)
   - Payer Library (Phase 2)
   - Schema Workspace (Phase 2)

5. **ANALYTICS**
   - Performance
   - Client Insights
   - NCQA Compliance (Phase 2)
   - Compliance & Audit (Phase 2)

6. **OPERATIONS** (Phase 2 section)
   - Client Intake (Phase 2)
   - Decision Queue (Phase 2)
   - Payer Requests (Phase 2)

7. **QUALITY CONTROL** (Phase 2 section)
   - QC Dashboard (Phase 2)
   - Audit Queue (Phase 2)
   - Audit Sheets (Phase 2)
   - Sampling Config (Phase 2)
   - Analyst Scorecard (Phase 2)
   - Training Needs (Phase 2)
   - First Pass Rate

8. **DEVELOPMENT**
   - Portal Preview

9. **ADMINISTRATION**
   - Users & Roles
   - Settings
   - Portal Configuration (Phase 2)
   - Billing (Phase 2)

**Design Patterns Identified:**

- **Sidebar Width**: 288px (w-72 in Tailwind) fixed width on desktop
- **Sidebar Background**: `bg-slate-950/80 backdrop-blur-xl border-r border-white/5`
- **Menu Item Styling**:
  - Default: `text-white/50 hover:text-white`
  - Active: `bg-emerald-500/15 text-emerald-300` with emerald glow
  - Rounded: `rounded-2xl` with `px-4 py-3` padding
  - Icons: 5x5 (w-5 h-5) with 3-gap spacing
- **Section Headers**: Uppercase, 10px font, white/50 opacity, tracking-widest
- **Badge Counts**: Small rounded pills with category-specific colors (emerald, cyan, violet)
- **Phase 2 Badges**: Orange gradient background with border, 9px font, uppercase
- **Glass Cards**: `backdrop-filter: blur(40px)`, `rgba(255,255,255,0.03)` background, subtle borders
- **Top Navigation**:
  - Sticky positioning with `bg-slate-900/60 backdrop-blur-xl`
  - Breadcrumb navigation
  - Search bar with command palette (⌘K)
  - Notification bell icon
  - User profile dropdown
  - Theme toggle icon
- **Brand Header**:
  - Logo: 44px (w-11 h-11) rounded-2xl with emerald shadow
  - Title: Gradient text from emerald-300 to teal-200
  - Version: 10px font with info icon for phase legend
  - Role indicator badge below brand
- **User Profile Section** (bottom of sidebar):
  - Avatar with gradient background
  - User name and role display
  - Dropdown for user switching (demo feature)
- **Typography**: Inter font family throughout
- **Color Palette**:
  - Primary: emerald-500 (#10b981)
  - Accent: teal shades
  - Background: slate-950, slate-900
  - Text: white with varying opacity (white/50, white/70, white/90)
  - Borders: white/5, white/10

**Fidelity Level:** High-fidelity mockup with production-ready design specifications

## Requirements Summary

### Functional Requirements

**Core Layout Structure:**

- Fixed sidebar navigation (288px width) on desktop with collapsible functionality
- Responsive behavior: collapsed/icon-only on mobile/tablet, expandable on desktop
- Sticky top navigation bar with backdrop blur
- Main content area with proper spacing and scroll handling
- Full-height layout with sidebar and content coordination

**Sidebar Navigation:**

- Hierarchical menu structure with 9 main sections (see Visual Insights for complete list)
- Collapsible menu groups with expand/collapse icons
- Section headers with uppercase styling and reduced opacity
- Menu items with icons (HugeIcons React), labels, and optional badge counts
- Active state indicators (emerald background + text color)
- Parent group active states when child is selected
- Smooth transitions and hover effects
- Phase 2 items hidden by default (not rendered until feature is ready)

**Brand Header (Sidebar Top):**

- Logo display using `/public/logo.webp` (44x44px, rounded-2xl)
- App title "InCredibly" with gradient text effect
- Version number display (e.g., "v1.0.0")
- Optional info icon for phase legend toggle
- Role indicator badge
- Click logo to navigate to dashboard

**User Profile Section (Sidebar Bottom):**

- User avatar with initials or profile image
- User name and role display
- Dropdown toggle for user menu
- Border separator from navigation area

**Top Navigation Bar:**

- Breadcrumb navigation (dynamic based on current page)
- Page title (h1)
- Global search bar with command palette trigger (⌘K shortcut)
- Notification bell icon with badge count
- Dropdown panel for notifications list
- Theme toggle icon (sun/moon) - directly visible, not nested
- User profile menu (optional duplicate for UX)
- Sticky positioning with glass morphism effect

**Theme System:**

- Dark theme as default/initial theme
- Light theme implementation with proper contrast
- Theme toggle component in top navigation bar (directly visible icon)
- System preference detection using `prefers-color-scheme`
- Theme state management (Zustand store)
- localStorage persistence for user preference
- CSS variables for theme values
- Smooth theme transitions

**Glass Morphism Design System:**

- Backdrop blur effect (medium intensity: `blur(40px)`)
- Applied to: sidebar, top nav, modals, cards, and panels
- Subtle borders with low opacity (white/5, white/10)
- Semi-transparent backgrounds
- Theme variables for consistent application
- CSS custom properties for reusability

**Color Palette:**

- **Dark Theme:**
  - Primary: emerald-500 (#10b981)
  - Accent: teal-400, teal-500
  - Background: slate-950, slate-900
  - Surface: slate-800
  - Text: white with opacity variants (50%, 70%, 90%)
  - Borders: white/5, white/10
- **Light Theme:**
  - Primary: emerald-600
  - Accent: teal-600
  - Background: white, slate-50
  - Surface: white
  - Text: slate-900 with opacity variants
  - Borders: slate-200, slate-300
  - Proper contrast ratios for WCAG AA compliance

**Typography System:**

- Font family: Inter (imported from Google Fonts or self-hosted)
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Heading scale: h1 (2xl), h2 (xl), h3 (lg)
- Body text: sm (14px) and xs (12px)
- Section headers: 10px uppercase with letter-spacing
- Line heights optimized for readability

**Phase Badge System:**

- Phase 2 items completely hidden (not rendered) until ready
- When Phase 2 items become available, they should render without badges
- Phase legend panel (optional, toggleable) to explain phase system
- No visual badges on menu items in Phase 1

**Navigation Behavior:**

- Active page highlighting with emerald accent
- Parent menu group expansion when child is active
- Smooth transitions for expand/collapse
- Keyboard navigation support (Tab, Enter, Arrow keys)
- Focus states visible for accessibility
- URL-based routing integration (Next.js App Router)

**Responsive Behavior:**

- Desktop (≥1024px): Full sidebar (288px) with collapsible toggle
- Tablet (768px-1023px): Collapsed sidebar (72px icon-only) with expand on hover/click
- Mobile (<768px): Hidden sidebar with hamburger menu overlay
- Main content area adjusts width based on sidebar state
- Touch-friendly tap targets on mobile (minimum 44x44px)

**Accessibility Requirements:**

- Semantic HTML (nav, aside, main, header)
- ARIA labels for navigation regions
- Keyboard navigation support
- Focus management for sidebar toggle and menu items
- Screen reader announcements for page changes
- Color contrast meeting WCAG AA standards
- Skip navigation link for keyboard users

**Performance Considerations:**

- Lazy load navigation icons where possible
- Optimize backdrop blur for performance (use will-change sparingly)
- Minimize layout shifts during theme transitions
- Efficient re-renders for theme changes (memoization)
- Smooth 60fps animations for menu interactions

### Reusability Opportunities

Since this is the first feature, there are no existing components to reference. However, the following components should be built with reusability in mind:

**Reusable Components to Create:**

- `AppShell` - Main layout wrapper
- `Sidebar` - Navigation sidebar container
- `SidebarSection` - Menu section with header
- `SidebarMenuItem` - Individual menu item with icon, label, badge
- `TopNav` - Top navigation bar
- `Breadcrumb` - Breadcrumb navigation component
- `ThemeToggle` - Theme switcher button
- `NotificationBell` - Notification icon with dropdown
- `UserMenu` - User profile dropdown
- `Badge` - Count badge component
- `GlassCard` - Glass morphism card component
- `CommandPalette` - Global search/command interface

**Reusable Hooks:**

- `useTheme` - Theme state and toggle functionality
- `useNavigation` - Navigation state and active page detection
- `useSidebar` - Sidebar collapse/expand state
- `useMediaQuery` - Responsive breakpoint detection

**Reusable Utilities:**

- Theme CSS variables configuration
- Color palette tokens
- Typography scale definitions
- Spacing system
- Border radius tokens
- Shadow utilities

### Scope Boundaries

**In Scope:**

1. **Layout Structure:**
   - App shell with sidebar and main content area
   - Fixed sidebar navigation (288px desktop, collapsible)
   - Sticky top navigation bar
   - Responsive layout behavior
   - Main content container with proper spacing

2. **Sidebar Navigation:**
   - Complete navigation menu structure (9 sections as defined)
   - Menu items with icons, labels, and badge counts
   - Active state indicators
   - Collapsible menu groups
   - Brand header with logo and version
   - User profile section at bottom
   - Phase 2 items hidden by default

3. **Top Navigation:**
   - Breadcrumb navigation
   - Page title display
   - Global search bar (UI only, search functionality separate)
   - Notification bell with badge count (UI only, notification system separate)
   - Theme toggle icon
   - User profile menu (optional)

4. **Theme System:**
   - Dark theme implementation (default)
   - Light theme implementation
   - Theme toggle component
   - System preference detection
   - Theme state management (Zustand)
   - localStorage persistence
   - CSS variables for theme values
   - Smooth transitions

5. **Design System Foundation:**
   - Glass morphism styling (backdrop blur, borders)
   - Color palette setup (emerald/teal for dark, appropriate light colors)
   - Typography system (Inter font family)
   - Spacing and sizing tokens
   - Component styling patterns

6. **Accessibility:**
   - Semantic HTML structure
   - ARIA labels and roles
   - Keyboard navigation
   - Focus states
   - Screen reader support
   - Color contrast compliance

7. **Responsive Behavior:**
   - Desktop: full sidebar with collapse toggle
   - Tablet: collapsed sidebar (icon-only)
   - Mobile: hidden sidebar with hamburger menu

**Out of Scope:**

1. **Functional Features:**
   - Actual search functionality (only UI shell)
   - Notification system logic and data fetching
   - User authentication and session management
   - Role-based access control logic
   - Navigation analytics/tracking
   - Command palette search results

2. **Content Pages:**
   - Dashboard page content
   - Settings screens
   - User management screens
   - Any feature-specific page content
   - Data tables and lists
   - Forms and inputs

3. **Data Integration:**
   - API integration for navigation data
   - Badge count calculations from backend
   - User profile data fetching
   - Notification data fetching
   - Real-time updates

4. **Advanced Features:**
   - Multi-language support (i18n)
   - Custom theme creation by users
   - Navigation customization/reordering
   - Pinned/favorite menu items
   - Recent pages history
   - Keyboard shortcuts beyond basic navigation

5. **Phase 2 Features:**
   - Phase 2 menu items (will be added later)
   - Phase 2 sections (Operations, parts of Quality Control)
   - Phase badge display system (not needed in Phase 1)

6. **Backend:**
   - User preferences API
   - Navigation configuration API
   - Notification backend
   - Analytics tracking

### Technical Considerations

**Technology Stack:**

- Next.js 16.1.5 (App Router)
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui components (Radix UI primitives)
- HugeIcons React for icons
- Zustand 5.0.10 for theme state management

**Integration Points:**

- Next.js App Router for page navigation
- Zustand store for global theme state
- localStorage for theme persistence
- CSS custom properties for theme variables
- Tailwind CSS configuration for design tokens

**File Structure Recommendations:**

```
app/
  layout.tsx                    # Root layout with AppShell
  (dashboard)/                  # Route group with navigation
    layout.tsx                  # Layout with Sidebar + TopNav
    page.tsx                    # Dashboard page

components/
  layout/
    app-shell.tsx              # Main layout wrapper
    sidebar/
      sidebar.tsx              # Sidebar container
      sidebar-section.tsx      # Menu section
      sidebar-menu-item.tsx    # Menu item
      sidebar-brand.tsx        # Brand header
      sidebar-user.tsx         # User profile section
    top-nav/
      top-nav.tsx              # Top navigation bar
      breadcrumb.tsx           # Breadcrumb component
      search-bar.tsx           # Search input
      notification-bell.tsx    # Notification icon
      theme-toggle.tsx         # Theme switcher
      user-menu.tsx            # User dropdown
  ui/
    badge.tsx                  # Badge component
    glass-card.tsx             # Glass morphism card

lib/
  stores/
    theme-store.ts             # Zustand theme store
  hooks/
    use-theme.ts               # Theme hook
    use-navigation.ts          # Navigation hook
    use-sidebar.ts             # Sidebar state hook
    use-media-query.ts         # Responsive hook
  constants/
    navigation.ts              # Navigation menu structure
    theme.ts                   # Theme configuration

styles/
  globals.css                  # Global styles and CSS variables
```

**State Management:**

- Theme state: Zustand store with localStorage persistence
- Sidebar collapse state: Local component state or Zustand
- Active page: Derived from Next.js router
- User session: Separate auth context (out of scope)

**Styling Approach:**

- Tailwind CSS utility classes for most styling
- CSS custom properties for theme variables
- CSS modules for component-specific styles if needed
- Glass morphism via Tailwind backdrop-blur utilities

**Performance Optimizations:**

- Memoize navigation menu structure
- Lazy load icons if bundle size is concern
- Use CSS containment for sidebar
- Optimize backdrop-blur (use sparingly, consider will-change)
- Minimize theme transition layout shifts

**Accessibility Standards:**

- WCAG 2.1 Level AA compliance
- Semantic HTML5 elements
- ARIA labels for navigation regions
- Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Focus visible styles
- Screen reader tested
- Color contrast ratios: 4.5:1 for normal text, 3:1 for large text

**Browser Support:**

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Backdrop-blur fallback for older browsers
- CSS Grid and Flexbox for layout
- CSS custom properties support required

**Testing Considerations:**

- Component unit tests (Jest + React Testing Library)
- Accessibility tests (jest-axe)
- Visual regression tests (optional)
- Keyboard navigation tests
- Theme switching tests
- Responsive behavior tests

**HTML Reference File:**
The `incredibly-platform-v119.html` file at the project root contains production-ready HTML/CSS patterns that should be referenced for:

- Exact class names and styling patterns
- Glass morphism implementation
- Navigation menu structure
- Active state styling
- Badge and phase badge styling
- Responsive behavior
- Accessibility attributes
- User switcher dropdown pattern

**Logo Asset:**

- File: `/public/logo.webp`
- Size: 44x44px (w-11 h-11 in Tailwind)
- Styling: rounded-2xl with emerald shadow (`shadow-lg shadow-emerald-500/20`)
- Fallback: Gradient background with checkmark icon if image fails to load

**Version Display:**

- Format: "v1.0.0" or similar semantic versioning
- Location: Below brand title in sidebar
- Font size: 10px
- Color: white/50 opacity
- Optional info icon to toggle phase legend

**Navigation Menu Data Structure:**
The navigation menu should be defined as a data structure (TypeScript) that can be easily maintained and filtered. Structure should include:

- Section name
- Section items array
- Item properties: id, label, icon, href, badge count (optional), phase (1 or 2)
- Collapsible group support
- Role-based visibility (future enhancement)

**Theme CSS Variables:**
Define CSS custom properties for theme values:

```css
:root {
  --color-primary: theme("colors.emerald.500");
  --color-accent: theme("colors.teal.500");
  --bg-sidebar: rgba(2, 6, 23, 0.8);
  --bg-nav: rgba(15, 23, 42, 0.6);
  --text-primary: rgba(255, 255, 255, 0.9);
  --text-secondary: rgba(255, 255, 255, 0.5);
  --border-subtle: rgba(255, 255, 255, 0.05);
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.06);
  --blur-amount: 40px;
}

[data-theme="light"] {
  /* Light theme overrides */
}
```

**Responsive Breakpoints:**

- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px
- Large Desktop: ≥ 1440px

Use Tailwind's default breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
