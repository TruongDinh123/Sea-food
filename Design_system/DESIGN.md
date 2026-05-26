# Hải Sản Cà Mau — Style Reference
> Fresh Seafood + Refined Vietnamese Coast Minimal

**Theme:** light

Hải Sản Cà Mau presents as an authentic, high-quality seafood portal that connects customers directly to the pristine seas of Ca Mau. Its visual system relies on a fresh and modern palette dominated by Ocean Blue and Forest Green, acting as a natural backdrop for premium seafood photography. Typography is clear and readable, utilizing the `Be Vietnam Pro` typeface for native Vietnamese styling. Surfaces are clean and structured with subtle borders, encouraging confidence and trust in the fresh seafood products.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ocean Blue | `#0D6EFD` | `--color-ocean-500` | Primary brand color, conveying freshness and maritime trust. Used for active navigation, main CTA buttons, and brand highlights. |
| Ocean Hover | `#0b5ed7` | `--color-ocean-600` | State changes for primary interactive items. |
| Forest Green | `#198754` | `--color-forest-500` | Secondary brand color, symbolizing fresh-catch, quality certification, and ecological harmony. Used for status indicators and badges like "Tươi sống". |
| Slate Light | `#f8f9fa` | `--color-slate-50` | Default application background, maintaining a light, airy, and clean layout. |
| Slate Border | `#e9ecef` | `--color-slate-200` | Subtle borders, dividers, and component outlines. |
| Slate Ink | `#212529` | `--color-slate-900` | Primary text and headings. |
| Pure White | `#ffffff` | `--color-pure-white` | Card backgrounds, input surfaces, and text on dark backgrounds. |

## Tokens — Typography

### Be Vietnam Pro — The primary typeface, imported from Google Fonts for flawless Vietnamese typography and modern visual balance. · `--font-sans`
- **Substitute:** system-ui, sans-serif
- **Weights:** 300, 400, 500, 600, 700
- **Role:** Main text elements, body, headings, and CTA labels.

### JetBrains Mono — Used for prices, stats, codes. · `--font-mono`
- **Substitute:** monospace

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.44 | 2.22px | `--text-caption` |
| body | 14px | 1.44 | -0.2px | `--text-body` |
| subheading | 18px | 1.33 | -0.32px | `--text-subheading` |
| heading-sm | 22px | 1.33 | -0.35px | `--text-heading-sm` |
| heading | 32px | 1.3 | -0.51px | `--text-heading` |
| heading-lg | 48px | 1.3 | -0.77px | `--text-heading-lg` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 14 | 14px | `--spacing-14` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 36 | 36px | `--spacing-36` |
| 45 | 45px | `--spacing-45` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 81 | 81px | `--spacing-81` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value | Shorthand |
|---------|-------|-----------|
| cards | 12px / 0.75rem | `rounded-cards` |
| inputs | 8px / 0.5rem | `rounded-inputs` |
| buttons | 8px / 0.5rem | `rounded-buttons` |
| navigation | 4px / 0.25rem | `rounded-navigation` |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)` | `--shadow-md` |

---

## Do's and Don'ts

### Do
- Use Ocean Blue (`#0D6EFD`) for buttons, active navigation, and primary links.
- Use Slate Light (`#f8f9fa`) as the default background for general content.
- Use Forest Green (`#198754`) to label fresh catches and premium quality badges.
- Apply consistent 8px border radius on buttons and inputs for a modern, approachable feel.
- Enforce the `Be Vietnam Pro` font family for all text elements.

### Don't
- Do not introduce dark theme layouts as primary; focus on a clean, light beachside feel.
- Do not use old Arc deepwater colors (e.g. `#031e25`) for major layouts.
- Do not hardcode hex colors; always use the mapped CSS variables.
- Do not use proprietary fonts such as `Soehne`.

---

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Slate Background | `#f8f9fa` | Muted background for layout wrappers. |
| 1 | Pure Surface | `#ffffff` | Card containers, navigation background, content sections. |
| 2 | Input Fill | `#ffffff` | Text fields (usually white surface with slate-200 border). |

---

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors - Primitive */
  --color-ocean-500: #0D6EFD;
  --color-ocean-600: #0b5ed7;
  --color-ocean-700: #0a58ca;
  --color-forest-500: #198754;
  --color-forest-600: #157347;
  --color-slate-50:  #f8f9fa;
  --color-slate-100: #f1f3f5;
  --color-slate-200: #e9ecef;
  --color-slate-500: #6c757d;
  --color-slate-900: #212529;

  /* Colors - Semantic */
  --color-primary: var(--color-ocean-500);
  --color-primary-hover: var(--color-ocean-600);
  --color-secondary: var(--color-forest-500);
  --color-bg: var(--color-slate-50);
  --color-surface: #ffffff;
  --color-border: var(--color-slate-200);
  --color-text-base: var(--color-slate-900);
  --color-text-muted: var(--color-slate-500);

  /* Typography */
  --font-sans: 'Be Vietnam Pro', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Radius */
  --radius-cards: 12px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-navigation: 4px;
}
```
