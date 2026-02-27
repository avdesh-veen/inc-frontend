## Accessibility Standards

### Core Principles

#### WCAG Compliance

- Follow WCAG 2.1 Level AA standards as minimum
- Aim for Level AAA where possible
- Test with screen readers and keyboard navigation
- Ensure color contrast meets requirements

### Semantic HTML

#### Proper Element Usage

- Use semantic HTML elements: `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`
- Use appropriate heading hierarchy (h1-h6)
- Use `<button>` for actions, not `<div>` with onClick
- Use `<a>` for navigation links
- Use form elements properly: `<form>`, `<input>`, `<label>`, `<select>`

### Keyboard Navigation

#### Focus Management

- All interactive elements must be keyboard accessible
- Provide visible focus indicators
- Maintain logical tab order
- Handle keyboard events: Enter, Space, Arrow keys, Escape

#### Focus Indicators

- Use Tailwind focus utilities for focus styles
- Ensure focus indicators are visible and clear
- Don't remove default focus styles without providing alternatives

#### Skip Links

- Provide skip navigation links
- Allow users to skip repetitive content
- Make skip links visible on focus

### ARIA Attributes

#### When to Use ARIA

- Use ARIA when semantic HTML isn't sufficient
- Don't use ARIA to fix bad HTML
- Prefer semantic HTML over ARIA

#### Common ARIA Patterns

- Use `aria-label` for elements without visible labels
- Use `aria-live` regions for dynamic content announcements
- Use `aria-expanded` for collapsible content
- Use `aria-controls` to associate controls with content
- Use `role` attributes when semantic HTML isn't available

### Form Accessibility

#### Label Association

- Always associate labels with form inputs using `htmlFor` and `id`
- Use `aria-label` or `aria-labelledby` when labels aren't visible
- Use `FormLabel` and `FormMessage` from shadcn/ui

#### Error Messages

- Associate error messages with inputs using `aria-describedby`
- Use `aria-invalid` to indicate invalid fields
- Announce errors to screen readers with `role="alert"`
- Provide clear, actionable error messages

### Color and Contrast

#### Color Contrast

- Minimum contrast ratio: 4.5:1 for normal text
- Minimum contrast ratio: 3:1 for large text
- Don't rely solely on color to convey information
- Test with color blindness simulators

#### Color Independence

- Always provide additional indicators beyond color (icons, text, patterns)
- Use `aria-label` to describe color-coded information
- Ensure information is accessible without color perception

### Images and Media

#### Alt Text

- Provide descriptive alt text for images
- Use empty alt (`alt=""`) for decorative images
- Describe the purpose, not just the content
- Keep alt text concise but meaningful

### Dynamic Content

#### Live Regions

- Use ARIA live regions for dynamic content updates
- Choose appropriate politeness level: `polite` or `assertive`
- Use `aria-atomic` to control what gets announced

#### Loading States

- Announce loading states to screen readers
- Use `aria-busy` for elements that are loading
- Provide loading text or aria-labels
- Update aria-label based on loading state

### Modal and Dialog Accessibility

#### Dialog Patterns

- Use proper dialog components (shadcn/ui Dialog)
- Trap focus within dialogs
- Return focus to trigger element on close
- Provide close mechanism (button or Escape key)
- Include DialogTitle and DialogDescription

### Testing Accessibility

#### Manual Testing

- Test with keyboard navigation (Tab, Enter, Space, Arrow keys)
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Test with browser zoom (200%)
- Test color contrast with tools

#### Automated Testing

- Use axe DevTools or similar tools
- Run accessibility tests in CI/CD
- Use React Testing Library for accessibility queries
- Test with `jest-axe` for automated accessibility testing

### Best Practices

#### Progressive Enhancement

- Build accessible foundation first
- Enhance with JavaScript progressively
- Ensure core functionality works without JavaScript

#### User Testing

- Include users with disabilities in testing
- Gather feedback on accessibility
- Iterate based on user feedback

#### Documentation

- Document accessibility features
- Include accessibility notes in component documentation
- Share accessibility guidelines with team

### Common Patterns

#### Accessible Button

- Use semantic `<button>` element
- Provide `aria-label` for icon-only buttons
- Use `aria-hidden="true"` for decorative icons inside buttons
- Ensure visible focus indicators

#### Accessible Form

- Associate labels with inputs
- Use `aria-required` for required fields
- Use `aria-invalid` and `aria-describedby` for error states
- Provide clear error messages

#### Accessible Navigation

- Use semantic `<nav>` element
- Use `aria-label` for navigation regions
- Use `aria-current="page"` for current page links
- Ensure keyboard navigation works
