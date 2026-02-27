# Spec Requirements: Users & Roles

## Initial Description

Need to implement Users & Roles module as mentioned in roadmap after core layout. This includes a three-tab interface for managing users, internal role definitions, and external client roles.

## Requirements Discussion

### First Round Questions

**Q1:** I assume the three-tab interface (Users, Role Definitions, External Roles) should use the existing tab component pattern from your design system. Is that correct, or do you have a specific tab layout in mind?
**Answer:** Use existing tab component available in the codebase as shadCN UI component.

**Q2:** For the Users Tab, I'm thinking the user list should default to a table view (more data-dense for admin tasks) with an optional grid/card toggle. Should we support both views, or focus on table-only for Phase 1?
**Answer:** Focus only on the grid view for now.

**Q3:** I assume user creation should be a slide-out panel/drawer rather than a separate page, keeping context of the user list visible. Is that correct, or would you prefer a full-page form or modal?
**Answer:** Use slide-out panel/drawer.

**Q4:** For Role Definitions, the roadmap mentions "Create custom role functionality." I assume custom roles should copy permissions from an existing role as a starting template. Is that correct, or should custom roles start with blank permissions?
**Answer:** No custom role functionality needed for this implementation.

**Q5:** I'm assuming the permission system uses a module-based structure (e.g., "Users: View/Edit/Delete", "Cases: View/Edit"). Should permissions be granular per-action, or grouped by access level (None/View/Full)?
**Answer:** Yes, it will follow module-based structure as mentioned.

**Q6:** For user statistics cards (Total Users, Internal Users, External Clients, Active Users), I assume these should be clickable to filter the list below. Is that correct?
**Answer:** No, stats are not clickable - they are just display cards.

**Q7:** I assume bulk actions (status changes) should require confirmation before applying. Should we also support bulk role assignment, or just status changes for Phase 1?
**Answer:** No bulk actions. Only single item actions are allowed. Grid will not have any checkboxes for selection and actions.

**Q8:** Is there anything that should explicitly be excluded from Phase 1 scope that might seem implied by the roadmap description?
**Answer:** Everything mentioned in roadmap is needed for users and roles module.

### Existing Code to Reference

**Similar Features Identified:**

- Existing shadcn UI components in the codebase
- Existing hooks available in codebase

**Implementation Note:** Use only static data for the time being. Dynamic data and API calls will be implemented later.

### Follow-up Questions

None required - user provided comprehensive answers and visual assets.

## Visual Assets

### Files Provided:

- `user-grid.png`: Main Users tab showing the user management interface with grid view, stats cards, filters, and user list
- `create-user.png`: Slide-out drawer/panel for creating a new user with multi-section form
- `internal-roles.png`: Role Definitions tab showing internal role cards in a 2-column grid layout
- `external-roles.png`: External Roles tab showing client portal role cards in a 2-column grid layout

### Visual Insights:

#### user-grid.png - Users Tab

- Page header: "Users & Roles" with breadcrumb navigation
- Section header: "User Management" with subtitle "Manage users, roles, and permissions"
- Three tabs: Users (active), Role Definitions, External Roles
- Stats cards row (4 cards):
  - Total Users (30)
  - Internal (Neolytix) (25)
  - External (Clients) (5)
  - Active Users (30)
- Filter row: "All Types" dropdown, "All Roles" dropdown, Search input
- User grid/list with columns:
  - USER: Avatar (colored initials) + Full Name + Email
  - TYPE: Badge (Internal/External)
  - ROLE: Colored badge (Super Admin, Manager, Team Lead, Case Analyst, etc.)
  - SCOPE / CLIENT: Text (All Clients, Assigned, specific client names)
  - LOCATION: Text (USA - Onshore, India - Offshore, etc.)
  - STATUS: Badge (Active)
  - ACTIONS: "Edit" link
- "+ Add User" button (emerald green) in top-right area

#### create-user.png - Add User Drawer

- Back arrow with "Add New User" title
- Subtitle: "Create a new user with role, location, and skill assignments"
- Form sections with colored headers:
  1. **BASIC INFORMATION** (purple icon):
     - Full Name\* (text input)
     - Email Address\* (text input)
     - Status (dropdown: Active)
  2. **ROLE & TEAM ASSIGNMENT** (green icon):
     - Role\* (dropdown)
     - Team (dropdown: -- No Team --)
     - Reports To (dropdown: -- Select Manager --)
  3. **LOCATION & COMPLIANCE** (cyan icon):
     - Work Location\* (dropdown: USA - Onshore)
     - Country (auto-filled based on location)
     - "Onshore Resource" indicator badge (green)
     - Offshore Processing Restriction checkbox with helper text
  4. **SKILLS & CAPABILITIES** (yellow icon):
     - Checkbox grid (4 columns) with skills:
       - Primary Source Verification, Document Verification, File Review, Committee Preparation
       - Initial Enrollment, Enrollment Follow-up, Payer Research, Medicare Enrollment
       - License Applications, License Renewals, Supervisory Agreements, CAQH Management
       - Data Entry, Portal Navigation, Quality Review, Training & Mentorship
       - Escalation Handling
  5. **COMPLIANCE & TRAINING** (pink icon):
     - Background Check Date (date picker)
     - BG Check Status (dropdown)
     - HIPAA Training Date (date picker)
     - HIPAA Training Expiry (date picker)
     - Security Awareness Date (date picker)
     - NDA Signed Date (date picker)
     - Last Compliance Review (date picker)
- Footer: Cancel button, "Create User" button (emerald)

#### internal-roles.png - Role Definitions Tab

- Section header: "Internal Roles (Neolytix Staff)"
- Note: "+ Create Custom Role" button visible in mockup but **excluded from scope per user requirements**
- 2-column card grid with 7 pre-seeded roles:
  1. **Super Admin** - Leadership
     - Description: "Full platform control with all permissions"
     - Badges: 23 Full Access, 0 Limited, All Clients
  2. **Manager/Director** - Leadership
     - Description: "Operations leadership with team oversight and reporting"
     - Badges: 20 Full Access, 3 Limited, All Clients
  3. **Team Lead** - Leadership, "Customizable" badge
     - Description: "Team supervision with assigned client access"
     - Badges: 10 Full Access, 10 Limited, Assigned Scope
  4. **Case Analyst** - Operations, "Customizable" badge
     - Description: "Core credentialing work with customizable scope restrictions"
     - Badges: 1 Full Access, 11 Limited, Assigned Scope
  5. **Verification Coordinator** - Operations
     - Description: "PSV specialist focused on document verification"
     - Badges: 4 Full Access, 7 Limited, All Clients
  6. **QC Analyst** - Quality
     - Description: "Quality control specialist for audits, sampling, and first-pass rate tracking"
     - Badges: 10 Full Access, 7 Limited, All Clients
  7. **Schema Analyst** - Operations
     - Description: "Manages all Knowledge Base resources: Payer Playbooks, State Board Library, Templates, Checklists, Taxonomy Crosswalk, SOPs. Edits require manager approval."
     - Badges: 8 Full Access, 3 Limited, Assigned Scope
- Card design: Icon with colored background, role name, category badge, description, permission summary badges

#### external-roles.png - External Roles Tab

- Section header: "External Client Roles"
- Subtitle: "Role templates for client portal users"
- 2-column card grid with 6 pre-seeded roles (read-only):
  1. **Client Admin** - Client Leadership
     - Description: "Full organizational access with user management for their org"
     - Typical: Credentialing Director, VP Medical Staff
     - Badges: All Facilities, Can Add Providers, Can Export
  2. **MSO Director** - Client Leadership
     - Description: "Medical Staff Office - provider rostering, credentialing oversight, scheduling coordination"
     - Typical: Medical Staff Office Director, Credentialing Manager, VP Medical Affairs
     - Badges: All Facilities, Can Add Providers, Can Export
  3. **Facility Manager** - Client Operations
     - Description: "Single or multi-facility access for practice managers"
     - Typical: Practice Manager, Office Manager
     - Badges: Assigned Only, Can Add Providers
  4. **CXO / Finance** - Client Finance
     - Description: "Executive oversight with financial and pipeline visibility"
     - Typical: CEO, CFO, COO, Controller, VP Operations
     - Badges: All Facilities, Can Export
  5. **Recruiter** - Client Operations
     - Description: "Provider onboarding with limited view access"
     - Typical: HR Recruiter, Talent Acquisition
     - Badges: All Facilities, Can Add Providers
  6. **Provider (Self-Service)** - Provider
     - Description: "Individual provider tracking their own credentialing"
     - Typical: Physician, NP, PA, Individual Provider
     - Badges: Assigned Only

### Design System Observations:

- Dark theme with slate/gray backgrounds
- Emerald/teal accent colors for primary actions and highlights
- Glass morphism elements with subtle borders
- Colored badges for roles, status, and permissions
- Avatar initials with colored backgrounds
- Section headers with colored icons
- Consistent spacing and typography (Inter font family)
- Fidelity level: High-fidelity mockups - exact design specifications

## Requirements Summary

### Functional Requirements

**Users Tab:**

- Display user statistics in 4 non-clickable cards (Total Users, Internal, External, Active)
- Filter users by Type (All Types dropdown)
- Filter users by Role (All Roles dropdown)
- Search users by name/email
- Display users in grid/list format with: Avatar, Name, Email, Type badge, Role badge, Scope/Client, Location, Status, Edit action
- Create new user via slide-out drawer with sections:
  - Basic Information (name, email, status)
  - Role & Team Assignment (role, team, reports to)
  - Location & Compliance (work location, country, offshore restriction)
  - Skills & Capabilities (checkbox grid of skills)
  - Compliance & Training (date fields for various compliance items)
- Edit user functionality (same drawer, pre-populated)
- User detail view/modal
- User deletion with confirmation
- No bulk actions - single item actions only

**Role Definitions Tab (Internal Roles):**

- Display 7 pre-seeded internal roles in 2-column card grid
- Each card shows: Icon, Role name, Category badge, Description, Permission summary (Full Access count, Limited count), Scope badge, Customizable badge (where applicable)
- Roles: Super Admin, Manager/Director, Team Lead, Case Analyst, Verification Coordinator, QC Analyst, Schema Analyst
- Role detail view showing full permission breakdown
- **No custom role creation** (excluded from scope)

**External Roles Tab:**

- Display 6 pre-seeded external roles in 2-column card grid
- Each card shows: Icon, Role name, Category badge, Description, Typical users, Capability badges
- Roles: Client Admin, MSO Director, Facility Manager, CXO/Finance, Recruiter, Provider (Self-Service)
- Read-only display (no edit capability)

### Reusability Opportunities

- Use existing shadcn/ui Tab component
- Use existing shadcn/ui Drawer/Sheet component for slide-out panel
- Use existing shadcn/ui Select, Input, Checkbox, Badge components
- Use existing shadcn/ui Card component for stats and role cards
- Create reusable UserCard component for the user grid
- Create reusable RoleCard component for both internal and external roles
- Create reusable StatsCard component for statistics display
- Create reusable form section components with colored headers

### Scope Boundaries

**In Scope:**

- Users tab with grid view, stats, filters, search
- User CRUD operations (Create via drawer, Read, Update via drawer, Delete with confirmation)
- Role Definitions tab with pre-seeded internal role cards
- External Roles tab with pre-seeded external role cards (read-only)
- Role detail view for permission breakdown
- Static data implementation (no API calls)
- Reusable components following codebase standards

**Out of Scope:**

- Custom role creation functionality
- Bulk actions and multi-select
- Table/list view toggle (grid only)
- Dynamic data / API integration (to be implemented later)
- Clickable stats cards for filtering

### Technical Considerations

- Use existing shadcn/ui components from codebase
- Use existing hooks from codebase
- Follow codebase standards and best practices
- Implement with static/mock data
- Create reusable, well-structured components
- Follow dark theme design with emerald/teal accents
- Ensure proper TypeScript typing
- Follow feature-based folder structure
