---
name: Academic Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#454654'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757686'
  outline-variant: '#c5c5d7'
  surface-tint: '#3b4fd2'
  primary: '#2036bd'
  on-primary: '#ffffff'
  primary-container: '#3e52d5'
  on-primary-container: '#d7daff'
  inverse-primary: '#bbc3ff'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#7e3100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44200'
  on-tertiary-container: '#ffd3bf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dfe0ff'
  primary-fixed-dim: '#bbc3ff'
  on-primary-fixed: '#000d60'
  on-primary-fixed-variant: '#1d34ba'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb694'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7a2f00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  h1:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2.5rem
  2xl: 4rem
  gutter: 1.5rem
  margin: 2rem
---

## Brand & Style

This design system is anchored in the concept of "Digital Zen for Educators." It prioritizes focus and cognitive ease, stripping away unnecessary visual noise to allow content and tasks to take center stage. The style is a refined **Minimalism** with a heavy emphasis on intentional whitespace and structural clarity. It evokes a sense of organized calm, positioning the platform as a reliable, quiet partner in a teacher's busy day. The aesthetic is sophisticated and institutional yet modern, avoiding the "toy-like" appearance of many educational tools in favor of a professional, tool-like efficiency similar to high-end productivity software.

## Colors

The palette is intentionally restrained to prevent overstimulation. 
- **Primary:** A scholarly "Indigo" used sparingly for primary actions, active states, and critical highlights.
- **Neutrals:** A sophisticated range of slates and grays. The background is a "Paper White" (not pure #FFF) to reduce eye strain, while text utilizes deep slates for high readability without the harshness of pure black.
- **Accents:** Feedback colors (success, error) should be desaturated to maintain the system's calm demeanor.

## Typography

The design system utilizes **Inter** for its exceptional legibility and neutral, utilitarian character. 
- **Hierarchy:** Established through weight shifts rather than dramatic size changes. 
- **Readability:** Body text uses a generous 1.6 line-height to ensure long-form educational content is easy to digest.
- **Letter Spacing:** Headlines utilize slight negative tracking for a tighter, more professional "editorial" feel, while labels use positive tracking for clarity at small sizes.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy for primary content containers to maintain focus, while utilizing a fluid 12-column structure within those containers. 
- **Whitespace:** Use the `xl` and `2xl` spacing tokens between major sections to prevent the UI from feeling "crowded."
- **Rhythm:** All spacing must be a multiple of the 4px base unit. 
- **Density:** Provide "Comfortable" (default) and "Compact" (data-heavy) views, though the system defaults to generous padding to reduce cognitive load.

## Elevation & Depth

Depth is communicated through **Tonal Layering** and **Low-contrast Outlines** rather than heavy shadows.
- **Layers:** Use subtle background shifts (e.g., a slightly darker gray for the sidebar vs. a white main canvas) to define zones.
- **Borders:** 1px borders in `border_color_hex` are the primary method of separation.
- **Shadows:** Only used for "floating" elements like dropdowns or modals. These should be "Ambient Shadows"—extremely diffused, low-opacity (5-8%), and with a slight vertical offset to simulate a natural light source.

## Shapes

The shape language is "Soft Professional." 
- **Radii:** A consistent `0.25rem` (4px) corner radius provides a modern touch without appearing overly playful or "bubbly." 
- **Consistency:** All interactive elements—buttons, inputs, and tags—should share this radius to maintain a unified visual language. 
- **Larger Elements:** Modals and cards can scale up to `0.5rem` to feel more structural.

## Components

- **Buttons:** Primary buttons use a solid fill of the accent color with white text. Secondary buttons use a ghost style with a subtle border.
- **Inputs:** Clean, 1px bordered fields that highlight the border in the accent color upon focus. Labels should always be visible above the field in `label-sm`.
- **Cards:** Use a white surface with a 1px border. Avoid shadows unless the card is being dragged or is an active modal.
- **Lists:** High-density lists (for gradebooks or rosters) should use subtle zebra-striping or thin horizontal dividers to maintain row integrity without clutter.
- **Chips/Status:** Small, low-saturation backgrounds with high-contrast text for status indicators (e.g., "Submitted," "Graded").
- **Specialized Components:** "Focus Mode" toggles (collapsing all sidebars) and "Quick Action" bars (CMD+K style) are recommended to enhance the "fast usability" requirement.
