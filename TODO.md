# TODO

## Current Milestone

Move from local editor prototype to exportable project workflow: package exports, dashboard library management, and eventual backend/auth.

For broader non-binding product direction, see `PRODUCT_MAP.md`.

## Next

- Continue simplifying first-use UX with clearer primary actions and fewer visible controls by default.
- Continue reducing always-visible builder/dashboard controls through progressive disclosure.
- Keep improving sidebar ergonomics with keyboard navigation and richer section row actions once needed.
- Refine guided tours with better mobile positioning and optional per-step deep links as the app grows.
- Expand French i18n coverage from key app chrome/help text to more dashboard, inspector, and settings labels.
- Improve the public landing page with stronger examples once generated/storefront visuals settle.
- Continue polishing storefront visuals so templates feel sellable, not just functional.
- Deepen mock storefront interactions beyond navigation/cart, including filter state and checkout step state.
- Add richer static export interactions beyond linked pages, such as optional lightweight cart JavaScript.
- Harden generated Next storefront output with an extracted fixture build check and closer parity with the live preview renderer.
- Continue polishing the `/templates` dashboard for larger libraries with bulk actions and stronger import review.
- Polish hosted/shareable preview controls and status messaging.
- Continue refining share panels with stronger disabled states, optional expiry, and publish history.
- Add richer controls for responsive layout variants beyond visibility.
- Improve account persistence polish with manual retry controls and last-synced timestamps.
- Continue image upload polish with generated thumbnails, better crop presets, and upload observability.

## Soon

- Improve product image handling:
  - keep existing data URLs as legacy fallback
  - add generated thumbnails for dashboard/product lists after upload
- Add navigation menu controls that can target page slugs.
- Add more section-level layout controls for storefront density and media emphasis where section-specific variants are still missing.

## Later

- Add hosted preview lifecycle controls, including optional expiry policies and publish history.
- Add a stronger local-to-account import review flow for selecting which local templates to import.
- Add dashboard bulk actions for export, delete, publish, and unpublish once libraries grow.
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
- R2 cleanup exists for known uploaded keys, but failed cleanup is currently best-effort and should get retry/observability later.
- `/preview/[templateId]` remains private/local-context preview; public `/s/[shareId]` links load published account templates from Neon.
- Saved template validation/migration exists and should grow with future schema versions.
- App UI has a lightweight English/French dictionary, but user-authored template/storefront content is not auto-translated.
