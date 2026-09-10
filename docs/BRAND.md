# Nihol identity

The emblem shows a rising sun above four cultivated field rows. The rows widen
toward the foreground, giving a direct agricultural reference. A custom lowercase wordmark gives the identity
a quieter, approachable character. All lettering is outlined geometry, so there
are no font-loading or font-licensing dependencies in the finished logo.

The artwork contains no people, animals, or other living beings.

## Files

- `public/brand/nihol-logo.svg`: forest-green primary logo for light backgrounds.
- `public/brand/nihol-logo-light.svg`: lime emblem and ivory lettering for dark backgrounds.
- `public/brand/nihol-logo-white.svg`: single-color white version.
- `public/brand/nihol-mark.svg` and `nihol-mark-light.svg`: standalone emblems.
- `public/brand/nihol-logo.png`: transparent high-resolution export.
- `public/brand/nihol-brand-preview.png`: light/dark and small-size comparison.
- `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png`: matching browser and Apple icons.

The header and footer use the inverse logo. The previous public SVG filenames
also resolve to the new artwork for compatibility. The existing 2016 label stays
separate from the wordmark in the navigation.

## Usage

Forest: `#172B20`. Lime: `#D7ED9A`. Ivory: `#F4F3EB`.

Preserve the 232:64 aspect ratio. Allow clear space of at least one wordmark stroke
around the artwork. Use the full logo at 120px wide or larger; use the emblem for
small square placements. Do not stretch, recolor with CSS filters, or add shadows.

Regenerate SVGs, PNGs, and icons with `node scripts/build-brand.cjs`. This script
is the single source of the shared geometry and color variants.

## Visual research

References informed the use of simple field geometry, restrained color, and
readable type. No third-party artwork was copied into the logo or website.

- [Kultive — Branding & Visual Identity, Behance](https://www.behance.net/gallery/230154575/Kultive-Branding-Visual-Identity)
- [Agricultural logo reference, Pinterest](https://www.pinterest.com/pin/9640586697560915/)
- [Ten Four Ag — Boundary Agency](https://boundaryagency.com.au/works/ten-four-ag)

The Pinterest board page was unavailable directly; the Pinterest reference was
reviewed through indexed image-search results.
