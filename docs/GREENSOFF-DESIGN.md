# Greensoff design direction

Greensoff is presented as an editorial seed catalogue: warm paper, olive ink, terracotta accents, expressive serif headings, fine rules and seed-packet graphics. Its homepage has an independent composition and does not use Nihol's landscape hero, solution cards or soil-model tabs.

## References and interpretation

- [Burpee Seeds & Plants by Alexander Isley](https://alexanderisley.com/work/burpee-seeds-plants/): editorial hierarchy and seed packets treated as small posters.
- [Agro Seeds on Behance](https://www.behance.net/gallery/243001961/Brand-identity-Agro-Seeds): natural colors and clear agricultural identity.
- [Piccolo Seeds reference collection](https://www.brandingwebsite.com/projects/piccolo-seeds): seed packaging as a starting point for a distinctive visual system.

The page design, seed geometry, packet artwork, field illustration and shopfront are original code. The decorative packet and storefront are conceptual brand illustrations, not photographs of actual products or premises. No AI images of people or animals were generated.

## Implementation

- `app/components/GreensoffHome.jsx`: homepage, scroll progress, section reveals, seed packet, seasonal guide, Hazera feature and shop illustration.
- `app/components/SeedStage.jsx`: lazy initialization, motion preferences and seed arrangement control.
- `app/lib/seedSculpture.js`: procedural Three.js seeds, pointer response, gathered-to-row transition, visibility scheduling and GPU cleanup.
- `app/content/experience.js`: English and Russian editorial copy.
- `app/greensoff.css`: visual design, responsive behavior and motion fallbacks.

Motion pauses when requested by the visitor or operating system. The 3D render loop stops offscreen and in background tabs. A CSS seed arrangement remains available if WebGL cannot initialize. No scroll hijacking or custom cursor is used.

Shop addresses and opening hours still require verified business data. The existing catalogue, product details and subscription integration are retained. This change does not deploy the site or modify Nihol.
