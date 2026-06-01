# TODO

## Current Milestone

Move from local editor prototype to exportable project workflow: package exports, dashboard library management, and eventual backend/auth.

For broader non-binding product direction, see `PRODUCT_MAP.md`.

## Next

- Continue simplifying first-use UX with clearer primary actions and fewer visible controls by default.
- Improve the public landing page with stronger examples once generated/storefront visuals settle.
- Continue polishing storefront visuals so templates feel sellable, not just functional.
- Deepen mock storefront interactions beyond navigation/cart, including filter state and checkout step state.
- Add richer static export interactions beyond linked pages, such as optional lightweight cart JavaScript.
- Harden generated Next storefront output with an extracted fixture build check and closer parity with the live preview renderer.
- Polish the `/templates` dashboard for larger local template libraries.
- Add hosted/shareable preview URLs.
- Add richer controls for responsive layout variants beyond visibility.
- Improve account persistence polish with manual retry controls and last-synced timestamps.
- Improve image upload UX with compression, thumbnails, and explicit upload retry states.

## Soon

- Improve product image handling:
  - keep existing data URLs as legacy fallback
  - add storage cleanup for replaced/deleted R2 images
- Add navigation menu controls that can target page slugs.
- Add more section-level layout controls for storefront density and media emphasis where section-specific variants are still missing.

## Later

- Add hosted preview URLs.
- Add a stronger local-to-account import review flow for selecting which local templates to import.
- Expand auth from Clerk sign-in to user dashboards, account-owned templates, and team/org workflows.
- Add Shopify/WooCommerce export or mapping.
- Expand generated Next storefront projects toward production integrations.

## Open Decisions

- Editor state: keep React state for now, or introduce Zustand when section editing grows.
- Validation: introduce Zod before or after persistence.
- Database layer: Drizzle vs Prisma.
- Backend/storage: Drizzle or Prisma with Postgres, plus image storage such as R2/S3.
- Export target: static Next template first, Shopify first, or hosted storefront first.

## Known Gaps

- Templates sync to account storage when `DATABASE_URL` is configured, with localStorage as a local draft/fallback cache.
- Existing local product images may still be data URLs; new uploads use R2 when storage is configured.
- `/preview/[templateId]` is local-only and not shareable across devices yet.
- Saved template validation/migration exists and should grow with future schema versions.
