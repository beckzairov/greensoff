# Greensoff

Independent adaptation of the Nihol website for a Hazera seed distributor with shops in Uzbekistan. English and Russian content; responsive layouts and interactive agricultural models.

## Run locally

```sh
npm ci
npm run dev -- --port 3002
```

Production: `npm run build` then `npm run start -- --port 3002`.

## Content and configuration

Editorial copy: `app/content/site.js`. Add verified shop addresses, hours and contact details before launch. No shop locations, staff totals or founding date have been invented. Catalogue is a seed-range introduction, not a stock listing.

Newsletter needs this brand's own EMAIL_USER and EMAIL_PASS environment variables. No Nihol credentials were copied.
