# TODO

## Current Milestone

Move from local editor prototype to project-level workflow: dashboard, export/import, validation, and eventual backend/auth.

For broader non-binding product direction, see `PRODUCT_MAP.md`.

## Next

- Improve the storefront visual design so templates feel sellable, not just functional.
- Add richer section controls for product count, media layout, and visibility rules.
- Polish the `/templates` dashboard for larger local template libraries.
- Add hosted/shareable preview URLs.

## Soon

- Improve product image handling:
  - replace data URLs with real upload storage later
- Add page-level settings such as SEO title, slug, and page visibility.

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
- Saved template validation/migration is basic and should grow with future schema versions.
