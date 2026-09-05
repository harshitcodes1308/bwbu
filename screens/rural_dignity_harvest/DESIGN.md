---
name: Rural Dignity & Harvest
colors:
  surface: '#fff8f5'
  surface-dim: '#e5d7d1'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ea'
  surface-container: '#f9ebe5'
  surface-container-high: '#f3e5df'
  surface-container-highest: '#ede0d9'
  on-surface: '#211a16'
  on-surface-variant: '#51443d'
  inverse-surface: '#362f2b'
  inverse-on-surface: '#fceee7'
  outline: '#83746c'
  outline-variant: '#d5c3b9'
  surface-tint: '#805437'
  primary: '#502c12'
  on-primary: '#ffffff'
  primary-container: '#6b4226'
  on-primary-container: '#e9b08c'
  inverse-primary: '#f4ba96'
  secondary: '#695e37'
  on-secondary: '#ffffff'
  secondary-container: '#f3e2b1'
  on-secondary-container: '#70643c'
  tertiary: '#123e0a'
  on-tertiary: '#ffffff'
  tertiary-container: '#2a561f'
  on-tertiary-container: '#98ca86'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbc7'
  primary-fixed-dim: '#f4ba96'
  on-primary-fixed: '#311300'
  on-primary-fixed-variant: '#653d22'
  secondary-fixed: '#f3e2b1'
  secondary-fixed-dim: '#d6c697'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#514622'
  tertiary-fixed: '#bcf1a9'
  tertiary-fixed-dim: '#a1d48f'
  on-tertiary-fixed: '#012200'
  on-tertiary-fixed-variant: '#24501a'
  background: '#fff8f5'
  on-background: '#211a16'
  surface-variant: '#ede0d9'
  soil-brown: '#6B4226'
  soil-brown-hover: '#56341E'
  wheat-surface: '#FDFBF7'
  wheat-tint: '#F4E3B2'
  wheat-border: '#E5CF97'
  leaf-green: '#4C7A3F'
  leaf-green-tint: '#EDF5EC'
  sun-amber: '#E8912D'
  sun-amber-tint: '#FDF3E7'
  terracotta-red: '#B5482C'
  terracotta-red-tint: '#FAEDE9'
  ink: '#2B2420'
  ink-muted: '#635852'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 52px
    letterSpacing: -0.01em
  display-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 40px
  display-md:
    fontFamily: Noto Serif
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 38px
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  headline-sm:
    fontFamily: Noto Serif
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-md:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2: 0.125rem
  space-4: 0.25rem
  space-8: 0.5rem
  space-12: 0.75rem
  space-16: 1rem
  space-24: 1.5rem
  space-32: 2rem
  space-48: 3rem
  space-64: 4rem
  margin-mobile: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  gutter: 1rem
---

## Brand & Style

This design system reimagines rural public service delivery into an experience defined by dignity, transparency, and grounded warmth. Created specifically for wage-seeking rural workers, the aesthetic departs completely from cold, punitive bureaucratic software. It reflects the atmosphere of harvest at golden hour: honest physical labor, fertile soil, and communal respect.

The aesthetic fuses **Tactile Warmth** and **Contemporary Editorial Clarity**:
- **Dignified & Human-Centered:** Interfaces communicate assurance rather than bureaucratic intimidation. Text is set with generous hierarchy and organic warmth, treating every worker's entitlement with honor.
- **Earthy & Grounded:** High contrast without synthetic harshness. Surfaces leverage sunlit wheat tones, rich loam soils, and natural pigment dyes.
- **Calm, High-Clarity Legibility:** Designed to bridge multilingual rural contexts and varied digital literacy levels through tactile affordances, generous tap areas, and unequivocal status indications.

## Colors

The palette is strictly semantic and inspired by the natural elements of land and seasonal labor. Pure black (`#000000`) and sterile digital blues are strictly forbidden.

- **Primary (`soil-brown` / `#6B4226`):** The grounding shade of fertile earth. Anchors high-emphasis actions, primary interactive buttons, prominent progress bars, and authoritative section headers.
- **Secondary / Base Surface (`wheat-tint` / `#F4E3B2` and `wheat-surface` / `#FDFBF7`):** Evokes golden harvest grain. Used for application-wide backing, subtle badges, and non-intrusive container backgrounds to eliminate eye fatigue under direct sunlight.
- **Neutral (`ink` / `#2B2420` & `ink-muted` / `#635852`):** A warm, deep organic ink for all primary typography. Ensures crisp AA/AAA contrast ratios against wheat and light parchment surfaces while remaining gentle.
- **Semantic State Trio:**
  - **Leaf Green (`#4C7A3F`):** Dedicated exclusively to verified statuses: completed work days, fulfilled muster rolls, and successful bank payments.
  - **Sun Amber (`#E8912D`):** Applied solely to work in progress, active verification cycles, and pending allocations.
  - **Terracotta Red (`#B5482C`):** Denotes delayed disbursements, required documentation updates, or administrative blocks. Modeled after fired brick to inform with care, never triggering shrill anxiety.

## Typography

The type system pairs an authentic editorial serif with an ultra-legible humanist sans-serif. In native bilingual or Hindi deployments, font stacks map seamlessly:
- **Display & Emotional Headings:** `Tiro Devanagari Hindi` / `Noto Serif`. Used for civic mottos, daily wage totals, worker greeting panels, and milestone celebrations. The serif quality evokes trust, print craftsmanship, and permanent constitutional guarantees.
- **UI, Figures, & Functional Labels:** `Noto Sans Devanagari` / `Inter`. Used for numerical day allocations, bank account identifiers, muster roll tables, and interactive touch controls.
- Optical sizing guarantees high legibility even on low-cost Android displays under bright daylight outdoors.

## Layout & Spacing

The layout employs an uncompromising **8px rhythmic spatial grid**. Every layout dimension, inner padding value, and vertical gap is a strict multiple of 8px (with 4px reserved only for tight label offsets).

- **Mobile First Focus (320px - 640px):** Single-column stack with `16px` outer horizontal margins. Minimum touch targets are enforced at `48px` vertically to support coarse outdoor touch conditions.
- **Tablet Reflow (641px - 1024px):** 8-column layout with `24px` margins and `16px` gutters. Work attendance and payment breakdown cards group into balanced dual-column groupings.
- **Desktop (1025px+):** Max layout container bounded at `1120px` with a 12-column grid, allowing generous whitespace that preserves an unhurried, reassuring civic portal feel.

## Elevation & Depth

To remain honest to physical soil and paper materials, elevation avoids deep synthetic blurs or sterile grey drop shadows.

- **Surface Tiers:**
  - `Base`: Canvas layer finished in warm eggshell wheat (`#FDFBF7`).
  - `Card / Tile`: Raised crisp surface (`#FFFFFF`) with a subtle 1px border colored in warm wheat boundary (`#E5CF97`).
  - `Hover / Pressed`: Interactive cards lift using an ambient warm shadow tinted with warm umber: `0 4px 14px rgba(43, 36, 32, 0.08)`.
- **Modals & Bottom Drawers:** Grounded by a heavy, semi-transparent umber scrim `rgba(43, 36, 32, 0.5)` with a top border radius of 16px.

## Shapes

The interface maintains a disciplined two-tier radius hierarchy:
- **Small Radius (8px):** Applied strictly to interactive, compact components—action buttons, input text fields, status badges, chips, and table cells.
- **Large Radius (16px):** Applied to broad surfaces, cards, scheme summary tiles, bottom sheets, and modal containers.

This balance prevents the interface from feeling like a whimsical toy while eliminating sharp, intimidating bureaucratic edges.

## Components

### Buttons
- **Primary:** Solid Soil Brown (`#6B4226`) background with pure white typography, 8px border-radius, minimum 48px height, and `16px 24px` padding. State changes transition gracefully to `#56341E`.
- **Secondary:** Transparent fill with a 1.5px solid Soil Brown border (`#6B4226`) and `#6B4226` label text.
- **Tertiary / Utility:** Ghost button in warm Ink (`#2B2420`), no border, subtle Wheat highlight on press.

### Status Chips & Badges
- Strict badge semantic pairing:
  - **Completed / Paid:** Leaf green background tint (`#EDF5EC`), leaf green text (`#4C7A3F`), subtle border (`#D4E5D1`).
  - **In Progress / Demanded:** Sun amber background tint (`#FDF3E7`), sun amber text (`#E8912D`), subtle border (`#F9DEC0`).
  - **Needs Attention / Delayed:** Terracotta red background tint (`#FAEDE9`), terracotta red text (`#B5482C`), subtle border (`#F2CDC3`).
- All chips maintain an 8px radius and small uppercase tracking (`label-sm`).

### Cards & Work Containers
- White interior with 16px corner radius, framed by a soft `1px solid #E5CF97` border.
- Features generous 20px internal padding, pairing a Serif title with tabular figures displaying wage days, job card numbers, and payment status.

### Form Inputs
- 48px height, 8px border radius, with a 1.5px `#E5CF97` border.
- Active focus displays a 2px outline in Soil Brown (`#6B4226`). Helper text and floating labels are rendered in Ink Muted (`#635852`).

### Specialized Domain Components
- **Job Card Passbook Strip:** A specialized progress ledger visualising guaranteed 100 days of work. Utilizes Soil Brown blocks for completed days, Sun Amber dashes for days requested, and Leaf Green markers for processed direct bank transfers.
- **Audio Assistant Assist-Bar:** Fixed bottom dock containing an approachable audio prompt button that reads aloud the passbook status in regional dialects.