# Specification: Core Layout & Navigation

## Goal

Build the foundational application shell with fixed sidebar navigation, top navigation bar, and glass morphism design system. Implement dark/light theme switching with persistent user preferences and establish the navigation structure for the entire platform.

## User Stories

- As a user, I want to navigate between different sections of the platform using a fixed sidebar menu so that I can quickly access my work, records, and settings
- As a user, I want to toggle between dark and light themes so that I can work comfortably in different lighting conditions with my preference persisted across sessions

## Specific Requirements

**App Shell Layout Structure**

- Fixed sidebar navigation (288px width) on desktop with collapsible functionality via toggle button
- Responsive behavior: collapsed/icon-only (72px) on tablet, hidden with hamburger menu overlay on mobile
- Sticky top navigation bar with glass morphism backdrop blur effect
- Main content area that adjusts width dynamically based on sidebar collapse state
- Full-height layout coordination between sidebar and content using CSS Grid or Flexbox
- Keyboard shortcut (Cmd/Ctrl+B) to toggle sidebar visibility

**Sidebar Navigation Hierarchy**

- Nine main navigation sections: MY WORK, WORK QUEUES, RECORDS, KNOWLEDGE BASE, ANALYTICS, OPERATIONS, QUALITY CONTROL, DEVELOPMENT, ADMINISTRATION
- Section headers styled with uppercase text (10px font), white/50 opacity, tracking-widest
- Collapsible menu groups with expand/collapse functionality for sections with multiple items
- Menu items include HugeIcons React icons (5x5 size), text labels, and optional badge counts
- Active state styling: emerald-500/15 background, emerald-300 text color, rounded-2xl with emerald glow
- Parent menu groups show active state when any child item is selected
- Smooth transitions (200ms ease-linear) for all hover, active, and collapse interactions
- Phase 2 items completely hidden (not rendered) until features are ready

**Brand Header Section**

- Logo display using `/public/logo.webp` at 44x44px with rounded-2xl corners and emerald shadow
- App title "InCredibly" with gradient text effect from emerald-300 to teal-200
- Version number display (e.g., "v1.0.0") in 10px font with white/50 opacity
- Optional info icon for phase legend toggle functionality
- Role indicator badge below brand showing current user's role
- Logo click navigation to dashboard route
- Proper spacing and alignment within sidebar header area

**User Profile Section**

- Positioned at bottom of sidebar with border separator from navigation area
- User avatar component with initials fallback or profile image display
- User name and role text display below avatar
- Dropdown toggle button for user menu expansion
- Avatar with gradient background styling when no image provided
- Dropdown menu for user switching (demo feature) with smooth animation

**Top Navigation Bar Components**

- Breadcrumb navigation component that updates dynamically based on current route
- Page title (h1) display aligned to left side of navigation bar
- Global search bar with command palette trigger (⌘K keyboard shortcut)
- Notification bell icon with badge count positioned in top-right area
- Dropdown panel for notifications list with glass morphism styling
- Theme toggle icon (sun/moon) directly visible in top-right corner, not nested in menu
- Sticky positioning with `bg-slate-900/60 backdrop-blur-xl` glass effect
- Proper spacing and alignment of all navigation bar elements

**Theme System Implementation**

- Dark theme as default initial theme with emerald-500 primary and teal accent colors
- Light theme with emerald-600 primary, proper contrast ratios for WCAG AA compliance
- Theme toggle component in top navigation bar as directly visible icon button
- System preference detection using `prefers-color-scheme` media query on initial load
- Zustand store for theme state management with actions for toggle and set theme
- localStorage persistence with key `theme-preference` to save user choice
- CSS custom properties for all theme-dependent values (colors, backgrounds, borders)
- Smooth theme transitions using CSS transitions on root element

**Glass Morphism Design System**

- Medium intensity backdrop blur effect (`blur(40px)`) applied consistently
- Glass styling on sidebar, top navigation bar, modals, cards, and panels throughout app
- Subtle borders with low opacity (white/5 for dark theme, slate-200 for light theme)
- Semi-transparent backgrounds using rgba values (e.g., `rgba(255,255,255,0.03)`)
- CSS custom properties for reusable glass effect values
- Theme-aware glass styling that adapts to dark/light mode
- Performance optimization using `will-change` sparingly on animated glass elements

**Color Palette Configuration**

- Dark theme: emerald-500 primary, teal-400/500 accents, slate-950/900 backgrounds, white with opacity variants (50%, 70%, 90%) for text
- Light theme: emerald-600 primary, teal-600 accents, white/slate-50 backgrounds, slate-900 with opacity variants for text
- Border colors: white/5 and white/10 for dark theme, slate-200/300 for light theme
- Badge colors: category-specific colors (emerald for work items, cyan for records, violet for analytics)
- Gradient text effects for brand header using emerald-300 to teal-200
- All colors defined as CSS custom properties in globals.css for theme switching

**Typography System Setup**

- Inter font family imported and applied globally via Tailwind CSS configuration
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Heading scale: h1 (text-2xl), h2 (text-xl), h3 (text-lg)
- Body text sizes: sm (14px) for default, xs (12px) for secondary text
- Section headers: 10px uppercase with tracking-widest letter-spacing
- Optimized line heights for readability (1.5 for body, 1.2 for headings)
- Consistent text color opacity levels across all components

**Navigation Behavior & Routing**

- Active page highlighting with emerald accent color and background
- Parent menu group auto-expansion when child item is active on page load
- URL-based routing integration using Next.js App Router with dynamic route detection
- Keyboard navigation support: Tab for focus, Enter to activate, Arrow keys for menu traversal
- Focus states with visible ring indicators for accessibility compliance
- Smooth scroll behavior when navigating to new pages
- Proper ARIA labels and roles for all navigation elements

**Responsive Breakpoint Behavior**

- Desktop (≥1024px): Full sidebar (288px) visible with collapsible toggle button
- Tablet (768px-1023px): Collapsed sidebar (72px icon-only) with expand on hover or click
- Mobile (<768px): Sidebar hidden by default with hamburger menu triggering overlay sheet
- Main content area width adjusts using CSS Grid or Flexbox based on sidebar state
- Touch-friendly tap targets on mobile (minimum 44x44px) for all interactive elements
- Sidebar state persistence in cookie for desktop collapse preference

## Visual Design

**`planning/visuals/my-work/dashboard.png`**

- Dark theme with slate-950/80 sidebar background and backdrop-blur-xl effect
- Sidebar width exactly 288px (w-72 in Tailwind) with fixed positioning
- Menu items use rounded-2xl with px-4 py-3 padding and 3-gap spacing between icon and text
- Badge counts displayed as small rounded pills with emerald, cyan, and violet color variants
- Top navigation bar with breadcrumb, search bar with ⌘K indicator, notification bell, and user profile
- Glass morphism cards in main content area with subtle borders and backdrop blur
- Brand header shows logo with gradient title and version number below

**`planning/visuals/user-roles.png`**

- Same navigation structure with "Users & Roles" active state highlighted in emerald
- Active menu item shows emerald-500/15 background with emerald-300 text color
- Parent "ADMINISTRATION" section expanded to show active child item
- Top navigation breadcrumb shows "Administration > Users & Roles" hierarchy
- Main content area displays data table with consistent glass card styling
- Role badges in table use same badge styling system as navigation counts

**`planning/visuals/workflows.png`**

- Settings/Configuration Center screen with left sidebar navigation active
- "Settings" menu item in ADMINISTRATION section highlighted with active state
- Secondary navigation in main content area for settings categories
- Glass card containers for work type categories and data tables
- Consistent spacing and typography throughout all navigation and content areas
- Badge system showing counts for different work type categories

## Existing Code to Leverage

**shadcn/ui Sidebar Component (`components/ui/sidebar.tsx`)**

- Complete sidebar implementation with SidebarProvider context for state management
- Built-in responsive behavior with mobile sheet overlay and desktop fixed positioning
- SidebarTrigger component for toggle button with keyboard shortcut support (Cmd/Ctrl+B)
- Cookie-based state persistence for sidebar collapse preference
- Sub-components: SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton
- Active state support via `isActive` prop and `data-active` attribute styling

**shadcn/ui Breadcrumb Component (`components/ui/breadcrumb.tsx`)**

- Breadcrumb navigation with BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage components
- Built-in separator component using HugeIcons ArrowRight01Icon
- Proper ARIA labels and semantic HTML structure
- Responsive text wrapping with gap spacing between items

**shadcn/ui Badge Component (`components/ui/badge.tsx`)**

- Badge variants: default, secondary, destructive, outline, ghost, link
- Customizable with className for category-specific colors (emerald, cyan, violet)
- Inline icon support with proper sizing and spacing
- Focus and accessibility states built-in

**shadcn/ui Avatar Component (`components/ui/avatar.tsx`)**

- Avatar with AvatarImage and AvatarFallback for user profile display
- Size variants: sm, default, lg for different use cases
- AvatarBadge component for status indicators
- Rounded styling with border overlay for visual polish

**shadcn/ui Dropdown Menu Component (`components/ui/dropdown-menu.tsx`)**

- Complete dropdown implementation for user menu and notifications
- DropdownMenuItem with destructive variant for logout actions
- DropdownMenuSeparator for visual grouping
- Keyboard navigation and focus management built-in
- Portal rendering for proper z-index layering

**shadcn/ui Button Component (`components/ui/button.tsx`)**

- Button variants: default, outline, secondary, ghost, destructive, link
- Size variants including icon-only sizes (icon, icon-sm, icon-lg)
- Focus states with ring indicators for accessibility
- Proper disabled and loading states

**useIsMobile Hook (`hooks/use-mobile.ts`)**

- React hook for detecting mobile breakpoint (768px)
- Returns boolean for responsive behavior logic
- Uses matchMedia API with change event listener
- Already integrated with sidebar component for responsive behavior

**Utility Function (`lib/utils.ts`)**

- `cn()` function combining clsx and tailwind-merge for className composition
- Use throughout all components for conditional styling
- Ensures proper Tailwind class merging and deduplication

**next-themes Package (in package.json)**

- Already installed for theme management functionality
- Provides ThemeProvider component and useTheme hook
- Handles system preference detection and localStorage persistence
- Supports dark/light/system theme modes

**Zustand State Management (in package.json)**

- Already installed for global state management
- Use for theme state store if next-themes is not sufficient
- Create stores in `lib/stores/` directory following project structure

## Out of Scope

- Actual search functionality and command palette search results (only UI shell)
- Notification system backend logic, data fetching, and real-time updates
- User authentication, session management, and login/logout functionality
- Role-based access control logic and permission checking for menu items
- Navigation analytics and tracking of user interactions
- Badge count calculations and API integration for dynamic counts
- Dashboard page content, data visualizations, and widgets
- Settings screens content and configuration forms
- User management screens and CRUD operations
- Any feature-specific page content beyond layout shell
- Multi-language support (i18n) and localization
- Custom theme creation by users beyond dark/light toggle
- Navigation customization, reordering, or pinning favorite items
- Recent pages history and navigation breadcrumb trails beyond current page
