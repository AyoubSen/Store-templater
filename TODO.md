# TODO

## Current Milestone

Move from local editor prototype to project-level workflow: dashboard, export/import, validation, and eventual backend/auth.

For broader non-binding product direction, see `PRODUCT_MAP.md`.

## Next

- Continue polishing storefront visuals so templates feel sellable, not just functional.
- Polish the `/templates` dashboard for larger local template libraries.
- Add hosted/shareable preview URLs.
- Add richer controls for responsive layout variants beyond visibility.

## Soon

- Improve product image handling:
  - replace data URLs with real upload storage later
- Add navigation menu controls that can target page slugs.
- Add more section-level layout controls for storefront density and media emphasis where section-specific variants are still missing.

## Later

- Add hosted preview URLs.
- Add database persistence.
- Add auth and user dashboards.
- Add Shopify/WooCommerce export or mapping.

## Open Decisions

- Editor state: keep React state for now, or introduce Zustand when section editing grows.
- Validation: introduce Zod before or after persistence.
- Database layer: Drizzle vs Prisma.
- Backend/auth/storage: Clerk + custom DB/storage, Supabase, or mixed Clerk + R2/Postgres.
- Export target: static Next template first, Shopify first, or hosted storefront first.

## Known Gaps

- Templates are localStorage-only.
- Product images are stored as data URLs locally, which is not suitable for production.
- `/preview/[templateId]` is local-only and not shareable across devices yet.
- Saved template validation/migration exists and should grow with future schema versions.
