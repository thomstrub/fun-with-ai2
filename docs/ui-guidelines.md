# TODO App - UI Guidelines

## Overview
This document outlines the core UI guidelines and design standards for the TODO application, ensuring consistency, accessibility, and a cohesive 90s-inspired aesthetic.

## Design Philosophy
The TODO app combines retro 90s aesthetics with modern Material Design principles and accessibility standards to create an engaging and inclusive user experience.

## Color Palette

### Primary Colors (90s Vibes)
- **Hot Pink**: `#FF1493` - Primary action color
- **Electric Purple**: `#9D4EDD` - Secondary accents
- **Lime Green**: `#39FF14` - Success and positive actions
- **Deep Magenta**: `#C71585` - Hover states and emphasis

### Neutral Colors
- **Off-White**: `#F5F5F5` - Background
- **Light Gray**: `#E0E0E0` - Secondary backgrounds
- **Dark Gray**: `#333333` - Text content
- **Black**: `#000000` - Text on light backgrounds

### Status Colors
- **Success Green**: `#39FF14` - Completed tasks
- **Warning Orange**: `#FF8C00` - Pending/attention needed
- **Error Red**: `#FF6B6B` - Errors and destructive actions

## Material Design Components

### Implementation
The TODO app utilizes Material Design components to ensure consistency and accessibility:
- Material UI (MUI) library for React components
- Material Icons for all iconography
- Consistent spacing using Material Design's 8px baseline grid
- Material Design typography scales

### Recommended Components
- **Buttons**: Material Button with custom styling
- **Input Fields**: Material TextField
- **Cards**: Material Card for task items
- **Checkboxes**: Material Checkbox for task completion
- **Date Pickers**: Material DatePicker for due dates
- **Dialogs**: Material Dialog for modals and confirmations
- **AppBar**: Material AppBar for header

## Button Styles

### Standard Button Guidelines
- **Border**: Solid 1px border using theme colors
- **Padding**: 12px horizontal, 8px vertical (Material standard)
- **Font Weight**: 600 (semi-bold)
- **Border Radius**: 4px (Material standard)
- **Transition**: All 0.3s ease for smooth interactions
- **Cursor**: Pointer on hover

### Button Variants

#### Primary Button
- **Background**: Hot Pink (`#FF1493`)
- **Border Color**: Deep Magenta (`#C71585`)
- **Text Color**: White (`#FFFFFF`)
- **Hover State**: Deep Magenta background with Hot Pink border
- **Focus State**: Outline with 2px focus ring in Electric Purple

#### Secondary Button
- **Background**: Off-White (`#F5F5F5`)
- **Border Color**: Electric Purple (`#9D4EDD`)
- **Text Color**: Dark Gray (`#333333`)
- **Hover State**: Light Gray background
- **Focus State**: Outline with 2px focus ring in Electric Purple

#### Success Button
- **Background**: Lime Green (`#39FF14`)
- **Border Color**: Electric Purple (`#9D4EDD`)
- **Text Color**: Dark Gray (`#333333`)
- **Hover State**: Darker green shade
- **Focus State**: Outline with 2px focus ring in Electric Purple

#### Danger Button
- **Background**: Error Red (`#FF6B6B`)
- **Border Color**: Dark Gray (`#333333`)
- **Text Color**: White (`#FFFFFF`)
- **Hover State**: Darker red shade
- **Focus State**: Outline with 2px focus ring in Electric Purple

### Button States
- **Active**: Darker background, maintained border
- **Disabled**: 50% opacity, cursor: not-allowed
- **Loading**: Spinner overlay, pointer: not-allowed

## Typography

### Font Family
- Primary: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif (Material default)
- Monospace: 'Courier New', monospace (for any code/technical content)

### Typographic Hierarchy
- **Heading 1 (h1)**: 32px, weight 700, color: Dark Gray
- **Heading 2 (h2)**: 28px, weight 700, color: Dark Gray
- **Heading 3 (h3)**: 24px, weight 600, color: Electric Purple
- **Body Text**: 16px, weight 400, line-height: 1.5, color: Dark Gray
- **Small Text**: 14px, weight 400, color: Light Gray
- **Button Text**: 14px, weight 600

## Spacing
Utilize Material Design's 8px baseline grid:
- **Extra Small**: 4px
- **Small**: 8px
- **Medium**: 16px
- **Large**: 24px
- **Extra Large**: 32px

## Accessibility Requirements

### WCAG 2.1 Compliance (Level AA)
The TODO app must meet WCAG 2.1 Level AA standards for accessibility.

### Color Contrast
- **Minimum Contrast Ratio**: 4.5:1 for normal text, 3:1 for large text
- **Testing**: Use tools like WebAIM Contrast Checker to verify all color combinations
- **Avoid Color-Only Information**: Always pair color with icons, text, or patterns

### Keyboard Navigation
- **Tab Order**: Logical and intuitive tab order through all interactive elements
- **Focus Indicators**: Clear, visible focus indicators (2px outline in Electric Purple)
- **Keyboard Shortcuts**: Provide keyboard alternatives for all mouse actions
- **Skip Links**: Include skip-to-content link for keyboard users

### Screen Readers
- **Semantic HTML**: Use proper semantic HTML5 elements (button, nav, main, etc.)
- **ARIA Labels**: Provide descriptive aria-label attributes where needed
- **Form Labels**: All form inputs must have associated labels
- **Role Attributes**: Use appropriate ARIA roles (checkbox, button, etc.)
- **Live Regions**: Use aria-live for dynamic content updates

### Text & Typography
- **Font Size**: Minimum 16px for body text
- **Line Spacing**: Minimum 1.5 line height for readability
- **Text Alignment**: Left-aligned text for optimal readability
- **Character Spacing**: Avoid excessive letter-spacing that impacts readability

### Images & Icons
- **Alt Text**: All images require descriptive alt text
- **Icon Labels**: Icons should have aria-label or title attributes
- **Decorative Elements**: Mark decorative elements with aria-hidden="true"

### Motion & Animation
- **Prefers Reduced Motion**: Respect the `prefers-reduced-motion` media query
- **Animation Duration**: Keep animations under 3 seconds
- **No Flashing**: Avoid content flashing more than 3 times per second

### Interactive Elements
- **Touch Targets**: Minimum 44x44 pixels for touch targets
- **Spacing**: At least 8px spacing between interactive elements
- **Hover States**: Visible and distinct from default state
- **Loading States**: Clear indication of loading/processing

### Form Accessibility
- **Labels**: Always associated with form controls
- **Required Fields**: Clearly marked with aria-required
- **Error Messages**: Associated with form fields using aria-describedby
- **Placeholder Text**: Should not be used as sole label (assistive technology may not read it)
- **Success Feedback**: Provide clear confirmation of successful actions

### Testing & Validation
- **Automated Testing**: Use axe, WAVE, or Lighthouse for accessibility audits
- **Manual Testing**: Test with keyboard navigation and screen readers (NVDA, JAWS, VoiceOver)
- **User Testing**: Include users with disabilities in testing
- **Continuous Monitoring**: Perform accessibility checks in CI/CD pipeline

## Component Composition

### Task Card Component
- **Background**: Off-White (`#F5F5F5`)
- **Border**: 1px solid Light Gray
- **Padding**: 16px
- **Border Radius**: 4px
- **Shadow**: Material elevation 1
- **Hover State**: Border color changes to Electric Purple

### Input Fields
- **Background**: White
- **Border**: 1px solid Light Gray
- **Border Radius**: 4px
- **Focus Border**: 2px solid Electric Purple
- **Padding**: 12px
- **Font Size**: 16px

### Checkbox
- **Checked**: Hot Pink background
- **Border**: 1px solid Electric Purple
- **Focus Ring**: 2px Electric Purple outline

## Responsive Design
- **Mobile First**: Design for mobile first, then scale up
- **Breakpoints**: 
  - Mobile: 0-599px
  - Tablet: 600-959px
  - Desktop: 960px+
- **Flexible Layouts**: Use flexbox and grid for responsive layouts
- **Touch Friendly**: Ensure touch targets are 44x44px minimum

## Brand Voice
- Modern yet nostalgic
- Playful with a professional edge
- Vibrant and energetic
- User-friendly and approachable
