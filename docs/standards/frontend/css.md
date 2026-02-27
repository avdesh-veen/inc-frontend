## CSS best practices

- **Consistent Methodology**: Apply and stick to the project's consistent CSS methodology (Tailwind, BEM, utility classes, CSS modules, etc.) across the entire project
- **Avoid Overriding Framework Styles**: Work with your framework's patterns rather than fighting against them with excessive overrides
- **Maintain Design System**: Establish and document design tokens (colors, spacing, typography) for consistency
- **Minimize Custom CSS**: Leverage framework utilities and components to reduce custom CSS maintenance burden
- **Performance Considerations**: Optimize for production with CSS purging/tree-shaking to remove unused styles

## Theme-Aware Styling

### Core Principles

**NEVER hardcode colors directly in components.** Always use semantic tokens and CSS variables defined in `app/globals.css` to ensure:

- Consistent theming across light and dark modes
- Easy color scheme changes without touching component code
- Maintainable and scalable styling system

### Rules for Color Usage

#### ❌ AVOID - Hardcoded Colors

```tsx
// BAD: Hardcoded Tailwind color classes
<div className="bg-violet-500/20 text-violet-300">
<div className="border-blue-400 bg-emerald-600">
<div className="text-gray-700 dark:text-gray-300">
<div className="text-white bg-white/[0.02] border-white/5">
<button className="bg-violet-500/20 text-violet-400 hover:bg-violet-500/30">
```

#### ✅ PREFER - Semantic Tokens

```tsx
// GOOD: Use semantic color tokens from globals.css
<div className="bg-primary/20 text-primary-foreground">
<div className="border-input bg-accent">
<div className="text-foreground">
<div className="text-foreground bg-card border-border-5">
<button className="bg-settings-active-bg text-settings-active-text hover:bg-settings-active-bg-hover">
```

#### Real-World Example: Skill Sets Card

```tsx
// ❌ BAD - Hardcoded colors
<div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
  <div className="w-10 h-10 bg-violet-500/20">
    <span className="text-violet-400 font-bold">8</span>
  </div>
  <p className="text-white">Credentialing</p>
  <p className="text-white/50">PSV • File Review</p>
  <button className="bg-white/5 text-white/60 hover:bg-white/10">
    Manage
  </button>
</div>

// ✅ GOOD - Theme variables
<div className="p-4 rounded-xl bg-card border border-border-5 hover:border-border-10">
  <div className="w-10 h-10 bg-settings-active-bg">
    <span className="text-settings-active-text font-bold">8</span>
  </div>
  <p className="text-foreground">Credentialing</p>
  <p className="text-text-50">PSV • File Review</p>
  <Button variant="ghost" className="text-text-50 hover:text-foreground">
    Manage
  </Button>
</div>
```

### Available Semantic Color Tokens

Always reference these tokens defined in `app/globals.css`:

**Base Colors:**

- `bg-background` / `text-foreground` - Main background and text
- `bg-card` / `text-card-foreground` - Card backgrounds
- `bg-popover` / `text-popover-foreground` - Popover/dropdown backgrounds

**Interactive Colors:**

- `bg-primary` / `text-primary-foreground` - Primary actions (buttons, links)
- `bg-secondary` / `text-secondary-foreground` - Secondary actions
- `bg-accent` / `text-accent-foreground` - Accent highlights
- `bg-muted` / `text-muted-foreground` - Muted/disabled states

**Functional Colors:**

- `bg-destructive` / `text-destructive` - Error/danger states
- `border-input` - Input field borders (also use for container borders)
- `border-border` - General borders
- `ring-ring` - Focus ring colors

**Text Opacity Variants:**

- `text-text-50` - 50% opacity text (muted secondary text)
- `text-text-70` - 70% opacity text (medium emphasis)
- `text-text-90` - 90% opacity text (high emphasis)

**Border Opacity Variants:**

- `border-border-5` - 5% opacity border (very subtle dividers)
- `border-border-10` - 10% opacity border (subtle dividers)

**Settings/Active States:**

- `bg-settings-active-bg` - Active state background (violet 10% opacity)
- `bg-settings-active-bg-hover` - Active state hover (violet 20% opacity)
- `text-settings-active-text` - Active state text (light violet)

**Glassmorphism:**

- `var(--glass-bg)` - Glass background (use with inline style)
- `var(--glass-border)` - Glass border color
- `var(--glass-blur)` - Glass blur amount

### Creating Custom Theme Colors

When you need custom colors (badges, status indicators, etc.), define them in `app/globals.css`:

```css
/* app/globals.css */
:root {
  /* Custom badge colors - light theme */
  --badge-success-bg: oklch(0.95 0.05 145);
  --badge-success-text: oklch(0.4 0.15 145);
  --badge-warning-bg: oklch(0.95 0.08 85);
  --badge-warning-text: oklch(0.45 0.15 85);
}

.dark {
  /* Custom badge colors - dark theme */
  --badge-success-bg: oklch(0.25 0.08 145);
  --badge-success-text: oklch(0.75 0.12 145);
  --badge-warning-bg: oklch(0.28 0.09 85);
  --badge-warning-text: oklch(0.8 0.13 85);
}

@theme {
  --color-badge-success-bg: var(--badge-success-bg);
  --color-badge-success-text: var(--badge-success-text);
  --color-badge-warning-bg: var(--badge-warning-bg);
  --color-badge-warning-text: var(--badge-warning-text);
}
```

Then use in components:

```tsx
<Badge className="bg-badge-success-bg text-badge-success-text">Active</Badge>
<Badge className="bg-badge-warning-bg text-badge-warning-text">Pending</Badge>
```

### Component-Specific Color Classes

For reusable color patterns, create utility classes in `app/globals.css`:

```css
@layer components {
  .status-badge-active {
    background: var(--badge-success-bg);
    color: var(--badge-success-text);
    border: 1px solid var(--badge-success-text);
  }

  .status-badge-pending {
    background: var(--badge-warning-bg);
    color: var(--badge-warning-text);
    border: 1px solid var(--badge-warning-text);
  }
}
```

Usage:

```tsx
<Badge className="status-badge-active">Active</Badge>
<Badge className="status-badge-pending">Pending</Badge>
```

### Theme-Aware Container Example

```tsx
// Full-screen form with glassmorphism
<div
  className="backdrop-blur-[40px] border border-input rounded-3xl"
  style={{ background: "var(--glass-bg)" }}
>
  {/* Content */}
</div>
```

### Testing Themes

**Always test both themes** before considering a component complete:

1. Switch between light and dark modes
2. Verify all colors have proper contrast
3. Check that borders are visible in both themes
4. Ensure interactive states (hover, focus) work correctly

### Migration Checklist

When refactoring existing components:

- [ ] Replace all hardcoded Tailwind colors (e.g., `bg-violet-500`) with semantic tokens
- [ ] Move custom color combinations to `app/globals.css`
- [ ] Define both `:root` (light) and `.dark` (dark) variants
- [ ] Add colors to `@theme` block for Tailwind usage
- [ ] Test in both light and dark modes
- [ ] Document any new color tokens in this file
