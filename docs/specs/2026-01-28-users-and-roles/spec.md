# Specification: Users & Roles

## Goal

Build a comprehensive user management module with a three-tab interface for managing internal users, viewing internal role definitions, and viewing external client portal roles, using static data with reusable components following the established design system.

## User Stories

- As an administrator, I want to view, create, edit, and delete users so that I can manage platform access and role assignments
- As an administrator, I want to view predefined internal and external roles so that I understand the permission structure when assigning roles to users

## Specific Requirements

**Page Header and Tab Navigation**

- Page title "User Management" with subtitle "Manage users, roles, and permissions"
- Three-tab interface using shadcn/ui Tabs component: Users (default active), Role Definitions, External Roles
- "+ Add User" button in page header area that opens the user creation drawer
- Tabs should use the existing `variant="default"` styling from the Tabs component

**Users Tab - Statistics Cards**

- Four non-clickable statistics cards in a horizontal row: Total Users, Internal (Neolytix), External (Clients), Active Users
- Cards display count value with label, using subtle glass morphism styling
- Create reusable `StatsCard` component in `components/features/users-roles/components/`
- Static data values: 30 Total, 25 Internal, 5 External, 30 Active

**Users Tab - Filters and Search**

- Filter row with "All Types" dropdown (options: All Types, Internal, External)
- "All Roles" dropdown populated with role options from static data
- Search input with placeholder "Search users..."
- Filters are UI-only for Phase 1 (no actual filtering logic required, just the components)

**Users Tab - User Grid**

- Grid/list layout displaying user cards with columns: Avatar+Name+Email, Type badge, Role badge, Scope/Client, Location, Status badge, Edit action
- Create reusable `UserCard` component for each row item
- Avatar shows colored initials using existing Avatar component with colored background based on user name
- Type badges: "Internal" (neutral) and "External" (distinct color)
- Role badges with category-specific colors matching the mockup (Super Admin purple, Manager blue, Team Lead teal, etc.)
- Status badge showing "Active" in green
- Edit action as text link that opens the edit drawer with pre-populated form

**User Create/Edit Form Pages**

- Full-screen pages at `/administration/users-roles/new` and `/administration/users-roles/[id]/edit`
- Main container uses glassmorphism effect with theme-aware borders matching input field styling
- Container styling: `backdrop-blur-[40px]`, `border-input` class, `rounded-3xl`, `background: var(--glass-bg)`
- Border uses `border-input` to ensure consistent appearance with form inputs across light/dark themes
- Header with back arrow button, "Add New User"/"Edit User" title, and subtitle
- Form sections with colored icon headers matching mockup design
- Section 1 - Basic Information: Full Name (required), Email Address (required), Status dropdown (Active/Inactive)
- Section 2 - Role & Team Assignment: Role dropdown (required), Team dropdown, Reports To dropdown
- Section 3 - Location & Compliance: Work Location dropdown, Country (auto-display based on location), Onshore/Offshore indicator badge, Offshore Processing Restriction checkbox
- Section 4 - Skills & Capabilities: Checkbox grid (4 columns) with 17 skill options from mockup
- Section 5 - Compliance & Training: Date pickers for Background Check, HIPAA Training, Security Awareness, NDA Signed, Last Compliance Review; BG Check Status dropdown
- Footer with Cancel and Create/Save User buttons
- Use React Hook Form with Zod validation for form management
- Navigation: Cancel/back returns to `/administration/users-roles`, successful submission redirects to user list

**Role Definitions Tab - Internal Roles**

- Section header "Internal Roles (Neolytix Staff)" without create button (custom roles excluded)
- 2-column responsive grid of role cards
- Create reusable `RoleCard` component showing: icon with colored background, role name, category badge (Leadership/Operations/Quality), description text, permission summary badges (X Full Access, Y Limited), scope badge (All Clients/Assigned Scope), optional "Customizable" badge
- 7 pre-seeded roles with static data: Super Admin, Manager/Director, Team Lead, Case Analyst, Verification Coordinator, QC Analyst, Schema Analyst
- Role cards are read-only display (no edit functionality)

**External Roles Tab - Client Portal Roles**

- Section header "External Client Roles" with subtitle "Role templates for client portal users"
- 2-column responsive grid using same `RoleCard` component with variant for external roles
- External role cards show: icon, role name, category badge (Client Leadership/Client Operations/Client Finance/Provider), description, "Typical:" user types, capability badges (All Facilities/Assigned Only, Can Add Providers, Can Export)
- 6 pre-seeded roles: Client Admin, MSO Director, Facility Manager, CXO/Finance, Recruiter, Provider (Self-Service)
- All external roles are read-only templates

**Static Data Structure**

- Create `lib/constants/users-roles-data.ts` for all static mock data
- Define TypeScript interfaces in `components/features/users-roles/types/index.ts`
- Include 25+ mock users with variety of roles, types, locations, and scopes
- Include all 7 internal roles and 6 external roles with complete metadata

## Visual Design

**`planning/visuals/user-grid.png`**

- Dark theme with emerald/teal accent colors throughout
- Stats cards use subtle glass morphism with rounded corners and minimal borders
- User grid rows have hover states with subtle background change
- Type badges are small rounded pills with muted colors
- Role badges use distinct colors per role category
- Edit link styled as emerald text link

**`planning/visuals/create-user.png`**

- Sheet/drawer width approximately 600-700px on desktop
- Section headers use colored icons (purple for Basic Info, green for Role, cyan for Location, yellow for Skills, pink for Compliance)
- Form inputs use dark theme input styling with subtle borders
- Checkbox grid uses 4-column layout with proper spacing
- "Onshore Resource" indicator is a green success badge
- Footer buttons: Cancel (ghost/outline), Create User (emerald primary)

**`planning/visuals/internal-roles.png`**

- Role cards use glass morphism styling with subtle borders
- Icon backgrounds use role-specific colors (emerald for leadership roles, cyan for operations, etc.)
- Category badges are small uppercase labels below role name
- Permission badges use color coding: green for Full Access count, yellow/amber for Limited count
- Scope badges distinguish between "All Clients" and "Assigned Scope"
- "Customizable" badge appears on Team Lead and Case Analyst cards

**`planning/visuals/external-roles.png`**

- Same card styling as internal roles but with external-specific badge colors
- "Typical:" line shows common job titles in muted text
- Capability badges use teal/cyan colors for facility access, emerald for provider permissions, blue for export

## Existing Code to Leverage

**shadcn/ui Tabs Component (`components/ui/tabs.tsx`)**

- Use Tabs, TabsList, TabsTrigger, TabsContent for three-tab navigation
- Supports `variant="default"` for pill-style tabs matching mockup
- Active state styling already configured with proper colors

**shadcn/ui Sheet Component (`components/ui/sheet.tsx`)**

- Use Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription for user drawer
- Supports `side="right"` for right-side slide-out panel
- SheetFooter available for action buttons
- Customize width with className `sm:max-w-2xl`

**shadcn/ui Card Component (`components/ui/card.tsx`)**

- Use for stats cards and role cards
- Card, CardHeader, CardTitle, CardDescription, CardContent structure
- Supports `size="sm"` variant for compact cards
- Apply glass morphism styling via className

**shadcn/ui Form Components**

- Form, FormField, FormItem, FormLabel, FormControl, FormMessage for form structure
- Select, SelectTrigger, SelectContent, SelectItem for dropdowns
- Input for text fields
- Checkbox for skill selection and toggle options
- Use with React Hook Form integration already configured

**shadcn/ui Badge Component (`components/ui/badge.tsx`)**

- Use for role badges, type badges, status badges, permission counts
- Supports variants: default, secondary, destructive, outline
- Customize colors via className for role-specific styling

**Avatar Component (`components/ui/avatar.tsx`)**

- Avatar, AvatarImage, AvatarFallback for user avatars
- Use AvatarFallback with initials and colored background
- Supports size variants: sm, default, lg

**MainContent Layout (`components/layout/main-content.tsx`)**

- Wrap page content in MainContent component for consistent layout
- Provides proper spacing and scroll handling
- Integrates with TopNav automatically

## Out of Scope

- Custom role creation, editing, or deletion functionality
- Bulk actions, multi-select, and batch operations on users
- Table/list view toggle (grid view only for Phase 1)
- Dynamic data fetching and API integration
- Clickable stats cards for filtering
- Actual filter logic implementation (UI components only)
- User authentication and session management
- Role-based access control and permission checking
- User deletion confirmation modal implementation details
- Form validation error states beyond basic required field validation
- Responsive mobile-specific layouts (desktop-first for Phase 1)
- Search functionality implementation (UI only)
- Role detail modal/drawer for viewing full permission breakdown
- User activity history or audit logs
