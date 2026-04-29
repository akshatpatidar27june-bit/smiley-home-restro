# Design Brief

## Tone & Purpose
Warm, inviting home restaurant and catering service. Appetite-stimulating aesthetic emphasizing home-cooked comfort and family welcome.

## Palette

| Token | Light OKLCH | Dark OKLCH | Usage |
|-------|------------|-----------|-------|
| Primary | 0.55 0.15 45 | 0.68 0.18 45 | Burnt orange — buttons, CTAs, accents |
| Secondary | 0.72 0.16 50 | 0.62 0.14 50 | Warm amber — highlights, complementary accents |
| Accent | 0.68 0.18 45 | 0.72 0.16 50 | Amber — interactive states, hover effects |
| Background | 0.98 0.01 70 | 0.18 0.01 40 | Cream (light) / warm dark (dark) |
| Foreground | 0.25 0.02 40 | 0.92 0.01 70 | Chocolate brown (light) / off-white (dark) |
| Card | 0.99 0.01 60 | 0.22 0.01 40 | Menu items, sections |
| Muted | 0.92 0.02 70 | 0.26 0.01 40 | Secondary backgrounds, disabled states |
| Border | 0.9 0.01 70 | 0.32 0.01 40 | Subtle dividers between sections |

## Typography
- **Display**: Figtree — friendly, readable, playful energy for headings
- **Body**: DM Sans — clean, professional, high legibility for descriptions and content
- **Mono**: System monospace

## Structural Zones

| Zone | Background | Border | Depth |
|------|-----------|--------|-------|
| Hero | bg-background (cream) | none | flat, welcoming |
| Header/Nav | bg-card with border-b-border | subtle | elevated |
| Menu Sections | bg-card elevated via shadow-warm | rounded | card-based layout |
| Content Blocks | bg-muted/40 alternating | none | subtle depth via color shift |
| Footer | bg-muted with border-t-border | subtle | grounded |

## Shape Language
- Base radius: 12px (0.75rem) — rounded, warm, approachable
- Variation: 0px (structural), 6px (sm), 12px (lg), 24px (full) for intentional hierarchy

## Spacing & Rhythm
- Mobile-first responsive: `sm:`, `md:`, `lg:` breakpoints
- Generous whitespace for air, legibility
- 16px, 24px, 32px, 48px spacing scale

## Component Patterns
- Menu cards: elevated shadow-warm, rounded corners, hover state lifts accent color
- Buttons: primary (orange), secondary (amber), outlined variants
- Sections: alternating bg-card and bg-muted/40 for visual rhythm
- Photos/Videos: iframe embeds with rounded containers, soft shadows

## Motion
- Smooth transitions: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Hover states: accent color shift + shadow depth increase
- No bounce or playful motion — refined warmth only

## Signature Detail
Warm amber accent on interactive elements (buttons, links, hover states) creates consistent appetite-stimulating visual language. Subtle shadows (shadow-warm) reinforce card-based hierarchy without visual heaviness.

## Constraints
- No background images in hero section
- Maintain WCAG AA+ contrast throughout
- Light mode default; dark mode for accessibility choice
- All colors expressed as OKLCH tokens only
