---
name: ChainVigil AI
colors:
  surface: '#16181D'
  surface-dim: '#13131b'
  surface-bright: '#393841'
  surface-container-lowest: '#0d0d15'
  surface-container-low: '#1b1b23'
  surface-container: '#1f1f27'
  surface-container-high: '#292932'
  surface-container-highest: '#34343d'
  on-surface: '#e4e1ed'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e4e1ed'
  inverse-on-surface: '#303038'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#ffb783'
  on-tertiary: '#4f2500'
  tertiary-container: '#d97721'
  on-tertiary-container: '#452000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#0A0B0F'
  on-background: '#e4e1ed'
  surface-variant: '#34343d'
  border: '#262932'
  status-block: '#EF4444'
  status-high: '#F97316'
  status-medium: '#F59E0B'
  status-trial: '#06B6D4'
  status-low: '#10B981'
  status-unknown: '#6B7280'
  accent-vp: '#EAB308'
  text-primary: '#F9FAFB'
  text-secondary: '#9CA3AF'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  code-sm:
    fontFamily: monospace
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system is built on a foundation of **Professionalism, Vigilance, and Objective Clarity**. It positions itself as a sober security utility, intentionally distancing itself from the speculative "casino" or "hype" aesthetics common in Web3. The brand personality is that of a "Security Guard"—calm, authoritative, and evidence-based.

The chosen style is **Modern Corporate / Web3 Dark Mode**. It utilizes:
- **High-Contrast Information Layering:** Clear separation of concerns using card-based modules.
- **Subtle AI Infusion:** The use of blue-purple gradients and "scanning" effects to denote AI-driven intelligence without overwhelming the functional utility.
- **Safety-First Interaction:** A "Read-then-Write" philosophy where connection is only required for action (Revoke/Clean), never for information (Scan/Report).
- **Human-Centric Clarity:** Translating complex smart contract logic into "human-readable" explanations, ensuring users always know the "why" behind a risk score.

## Colors

This design system uses a high-contrast dark palette to prioritize legibility and status communication. 

- **Primary & Secondary:** An AI-themed gradient ranging from `#6366F1` (Indigo) to `#A855F7` (Purple) is used for active states, scanning animations, and primary CTA accents.
- **Risk Semantic Palette:** A strict 6-tier system for risk levels. Use these colors only for status indicators, badges, and relevant alerts to maintain their communicative power. Avoid large washes of red or green to prevent "alarm fatigue" or false senses of security.
- **Neutral Palette:** The background is a deep navy-black (`#0A0B0F`). Surfaces (cards/panels) use a slightly lighter `#16181D` to create depth.
- **VP Accent:** A distinct Gold/Purple-Gold (`#EAB308`) is reserved exclusively for the Vigil Points system to separate gamified rewards from security risks.

## Typography

The typography system prioritizes technical precision and readable hierarchy. 

- **English Headlines:** Use **Geist** for its technical, modern, and developer-friendly character.
- **Body & Labels:** Use **Inter** for maximum legibility across data-heavy reports.
- **Chinese Support:** Fallback to **PingFang SC** or **Source Han Sans** for localized interfaces, maintaining consistent weight and spacing.
- **Layout Logic:** Large display titles are reserved for the Landing Hero ("Before buying, check CA"). Data tables and risk reports prioritize density and clarity over stylistic flair. Contract addresses (CA) and hashes should always use monospaced formatting to prevent character confusion (e.g., 0 vs O).

## Layout & Spacing

This design system follows a **Fixed-Grid philosophy** for desktop (1280px max-width) and a **Fluid-Stack philosophy** for mobile/Telegram.

- **Grid:** Use a 12-column grid for the Dashboard and Report pages. Content is organized into modular cards that can span 4, 6, or 12 columns depending on information density.
- **Vertical Rhythm:** Use a base-8 spacing system. Consistent gaps between sections (32px) and within card elements (16px) ensure a structured, professional feel.
- **Mobile First:** Given the heavy usage within Telegram and X, layouts must remain single-column on mobile. Inputs for CA scanning should be "thumb-friendly" with a minimum height of 56px and generous horizontal padding.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layering** and **Subtle Low-Contrast Outlines**.

- **Surfaces:** Use a two-tier system. The base background is the darkest layer. Cards and containers are elevated using a slightly lighter fill (`#16181D`) and a subtle 1px border (`#262932`).
- **AI Glow:** Primary surfaces (like the AI Conclusion card) may use a very low-opacity backdrop-glow of the primary blue-purple gradient to signify "active intelligence."
- **Shadows:** Avoid heavy, realistic shadows. Use small, sharp, low-opacity ambient shadows only for floating elements like Modals or Tooltips to maintain a "flat but layered" technical aesthetic.
- **Scanning State:** During the 3–10 second analysis window, use a subtle "scanning line" or pulse effect across the relevant card to provide visual feedback without creating anxiety.

## Shapes

The shape language is **Rounded (0.5rem)**, striking a balance between the friendliness of modern SaaS and the structural rigidity of security software.

- **Cards & Inputs:** Use the base 0.5rem (8px) radius for a modern, balanced look.
- **Risk Badges:** Use **Pill-shaped** (rounded-full) geometry to make them instantly recognizable as status labels.
- **CTA Buttons:** Maintain the 0.5rem radius to align with input fields, creating a cohesive "search bar" unit on the landing page.

## Components

- **CA Search Input:** The centerpiece of the landing page. Large, high-contrast, with an integrated "Scan" button. Must include auto-detection indicators for chains (e.g., ETH, Base logos).
- **Risk Badges:** Color-coded according to the semantic palette. Text should be concise (e.g., "BLOCK," "HIGH RISK").
- **AI Conclusion Card:** A specialized container at the top of every report. It includes the AI Summary, high-level reasoning, and a clear "Human-Readable" explanation.
- **Evidence Panels:** Collapsible sections containing technical chain data. High-risk evidence (e.g., "Honeypot Detected") is expanded by default; low-risk or neutral data is collapsed.
- **Action Buttons:**
    - **Primary:** Gradient-filled (AI Scan).
    - **Danger:** Solid Red (Revoke/Block actions).
    - **Secondary/Ghost:** Outlined for "Check Wallet" or "Share Report."
- **VP Tracker:** A small, persistent component showing the user's "Vigil Points" with a gold-purple accent, emphasizing growth and contribution.
- **Modals:** Used exclusively for transaction signing or revoking confirmation. They must be high-contrast with a clear summary of what the user is about to sign.