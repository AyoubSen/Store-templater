# TODO

## Current Milestone

Move from working private-beta app to a clearer, more trustworthy beta experience: first-use clarity, production smoke testing, export confidence, and reliability polish.

For broader non-binding product direction, see `PRODUCT_MAP.md`.

## Next

- Continue simplifying first-use UX with clearer primary actions, better empty states, and fewer visible controls by default.
- Keep reducing always-visible builder/dashboard controls through progressive disclosure.
- Work through `docs/PRIVATE_BETA_CHECKLIST.md` before inviting new testers.
- Keep improving sidebar ergonomics with keyboard navigation and richer section row actions once needed.
- Refine guided tours with better mobile positioning and optional per-step deep links as the app grows.
- Refine guided template creation with better section-variant previews, clearer visual-structure examples, and optional AI-assisted briefs later.
- Expand French i18n coverage from key app chrome/help text to more dashboard, inspector, and settings labels.
- Improve the public landing page with stronger examples once generated/storefront visuals settle.
- Replace placeholder contact copy with a real support address or support workflow before opening beyond private beta.
- Continue polishing storefront visuals so templates feel sellable, not just functional.
- Keep starter templates structurally distinct as new sections/variants are added; category-specific section ordering now lives in `lib/templater/starter-templates.ts`.
- Deepen mock storefront interactions beyond navigation/cart, including filter state and checkout step state.
- Add richer static export interactions beyond linked pages, such as optional lightweight cart JavaScript.
- Harden generated Next storefront output later in CI or a disposable environment; avoid local generated-project install/build automation for now.
- Continue polishing the `/templates` dashboard for larger libraries with bulk actions and stronger import review.
- Polish hosted/shareable preview controls and status messaging.
- Continue refining share panels with stronger disabled states, optional expiry, and publish history.
- Revisit private beta limits after real usage data; current caps are centralized in `lib/templater/limits.ts`.
- Add richer controls for responsive layout variants beyond visibility.
- Improve account persistence polish with manual retry controls and last-synced timestamps.
- Continue image upload polish with generated thumbnails, better crop presets, and upload observability.
- Expand visual QA from screenshot smoke checks to optional reviewed baselines once the builder UI stabilizes.
- Add a production smoke checklist/result note for the deployed Vercel app.

## Soon

- Improve product image handling:
  - keep existing data URLs as legacy fallback
  - add generated thumbnails for dashboard/product lists after upload
- Add richer navigation menu controls for nested menus or per-device nav behavior once needed.
- Add more section-level layout variants beyond hero and product grids where they materially change storefront personality.

## Later

- Add hosted preview lifecycle controls, including optional expiry policies and publish history.
- Add a stronger local-to-account import review flow for selecting which local templates to import.
- Add dashboard bulk actions for export, delete, publish, and unpublish once libraries grow.
- Expand account features from Clerk sign-in and user-owned templates to team/org workflows.
- Add Shopify/WooCommerce export or mapping.
- Expand generated Next storefront projects toward production integrations.

## Open Decisions

- Editor state: keep React state for now, or introduce Zustand when section editing grows.
- Billing/pricing: stay fully free during private beta, or introduce a light paid tier once usage patterns are known.
- Export roadmap: harden static/Next exports further before considering Shopify/WooCommerce mapping.
- Team model: single-user accounts for beta, or Clerk Organizations when collaboration becomes important.

## Known Gaps

- Templates sync to account storage when `DATABASE_URL` is configured, with localStorage as a local draft/fallback cache.
- Existing local product images may still be data URLs; new uploads use R2 when storage is configured.
- R2 cleanup exists for known uploaded keys, but failed cleanup is currently best-effort and should get retry/observability later.
- `/preview/[templateId]` remains private/local-context preview; public `/s/[shareId]` links load published account templates from Neon.
- Saved template validation/migration exists and should grow with future schema versions.
- App UI has a lightweight English/French dictionary, but user-authored template/storefront content is not auto-translated.
- Visual QA skips Clerk-protected pages unless `tests/.auth/user.json` or `PLAYWRIGHT_STORAGE_STATE` is available, and skips public share screenshots unless `VISUAL_QA_SHARE_PATH` is provided.
- Private beta limits currently cap account templates, products per template, and published templates, but there is no billing/plan system yet.
- The `/templates` dashboard waits for account/share state before showing cards to avoid initial ordering jumps; show a loading skeleton while it resolves.
