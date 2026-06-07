<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Store Templater Project Notes

## Product Direction

Store Templater is a visual builder for customizable ecommerce store templates.

The product should behave more like a practical theme editor/design tool than a marketing site. Prioritize a quiet, dense, professional builder UI with the storefront preview carrying most of the visual personality.

Core user flow:

1. Visit the public landing page at `/`.
2. Sign in with Clerk.
3. Create or open a store template in `/builder` or `/templates`.
4. Edit theme tokens, pages, sections, and content.
5. Preview the actual storefront experience.
6. Save, export, or publish the template.

## Current Stack

- Next.js 16 app router
- React 19
- TypeScript
- Tailwind CSS 4
- Clerk auth
- Neon Postgres with Drizzle ORM for account-owned template persistence
- Cloudflare R2 for uploaded product image storage
- pnpm

Current scripts:

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm qa:visual`
- `pnpm qa:visual:install`
- `pnpm verify:exports`

Run `pnpm build` after meaningful code changes.
Run `pnpm verify:exports` after export-generator changes.
Run `pnpm qa:visual` for screenshot smoke checks after visual/layout-heavy changes; see `docs/VISUAL_QA.md`.

Use `pnpm` only. Do not use `npm` commands in this project.

## Architecture Decisions

This app is schema-driven. Storefronts should be represented as structured template data, then rendered by reusable React components.

Important files:

- `PRODUCT_MAP.md`: broad non-binding product direction and possible long-term feature areas
- `lib/templater/schema.ts`: core template, theme, page, section, and product types
- `lib/templater/sample-template.ts`: current seed template used by builder and preview
- `lib/templater/registry.ts`: section registry and editable setting metadata
- `lib/templater/section-defaults.ts`: default settings for newly added sections
- `lib/templater/page-defaults.ts`: supported page types and starter section layouts for new pages
- `lib/templater/starter-templates.ts`: starter template catalog used by the New template flow
- `lib/templater/theme-presets.ts`: reusable color preset catalog
- `lib/templater/typography-presets.ts`: reusable typography scale presets
- `lib/templater/validation.ts`: Zod validation and saved-template migration helpers
- `lib/templater/export.ts`: compatibility barrel for export helpers
- `lib/templater/export-package.ts`: local-first `.store-template.json` package creation, parsing, and download helpers
- `lib/templater/static-export.ts`: multi-page static storefront HTML/CSS file generation and download helper
- `lib/templater/next-project-export.ts`: generated Next storefront project zip target with local mock cart state and storefront styling
- `lib/templater/zip.ts`: dependency-free zip writer used by export targets
- `lib/templater/export-utils.ts`: shared export validation, filename, HTML, and CSS helpers
- `scripts/verify-exports.cjs`: lightweight generated export file-list/content verification
- `lib/db/schema.ts`: Drizzle schema for account-owned templates
- `lib/db/index.ts`: Neon/Drizzle database client factory
- `app/actions/templates.ts`: Clerk-authenticated server actions for template list/load/save/delete
- `lib/templater/shared-preview.ts`: public shared-preview template lookup by generated share id
- `lib/storage/r2.ts`: Cloudflare R2 upload helper using the S3-compatible API
- `app/actions/images.ts`: Clerk-authenticated product image upload action
- `lib/i18n.tsx`: lightweight client-side app UI i18n provider with English/French dictionaries and language switcher
- `lib/templater/storage.ts`: localStorage persistence for active template and local template library
- `components/builder/section-sidebar.tsx`: compact template switcher, page/section/library sidebar modes, section list, section library, drag reorder
- `components/builder/preview-canvas.tsx`: editor toolbar, device controls, zoom, preview canvas
- `components/builder/inspector-panel.tsx`: Store/Theme/Items/Section inspector tabs
- `components/builder/section-inspector.tsx`: section-specific editing controls
- `components/template-creation-flow.tsx`: guided New template flow shared by the builder and dashboard
- `components/builder/controls.tsx`: reusable controls including color picker and field editors
- `components/storefront-preview.tsx`: shared storefront renderer
- `app/page.tsx`: public landing page
- `app/builder/page.tsx`: builder state/persistence orchestration
- `app/preview/page.tsx`: active-template preview fallback
- `app/preview/[templateId]/page.tsx`: explicit local template preview route
- `app/s/[shareId]/[[...pageSlug]]/page.tsx`: public shared storefront route for published templates and page slugs

Avoid duplicating storefront rendering logic between the builder and preview page. The builder canvas and preview route should use `components/storefront-preview.tsx`.

## Current Feature Set

- Local multi-template library stored in localStorage
- Guided template creation flow for choosing store type, visual direction, starting page structure, and optional template name
- Starter generator with category-specific products, palettes, page copy, page sets, section ordering, and layout variants for hero, product grids, reviews, FAQ, and trust bands
- Explicit `/preview/[templateId]` preview URLs with selected-page query support
- Public `/s/[shareId]` and `/s/[shareId]/[page-slug]` share links backed by account templates in Neon
- Compact publish/share panels in the builder and `/templates` dashboard with private/published state, copy/open/unpublish actions, and saved/published timestamps
- Browsable preview navigation for published template pages, product cards, cart, and checkout
- Store settings for name/category
- Theme color tokens, theme presets, and typography presets
- Product editing, add/duplicate/delete
- Local product image import as data URLs
- Product image upload to Cloudflare R2, with client-side compression, upload retry state, repositioning, reset/remove, and zoom inside fixed `4/5` media frames
- Existing product image data URLs remain valid as legacy/local fallback, but new uploads should store public R2 URLs
- R2 uploads store product `imageStorage` and `imageKey` metadata so owned objects can be cleaned up safely
- Replacing/removing product images, deleting products, and deleting templates should delete only known owned R2 keys/prefixes
- Lightweight local preview cart state for add-to-cart, cart summary, and checkout summary flows
- Basic page management for home, collection, product, cart, checkout, about, and contact pages
- Page metadata for slug, SEO title, and draft/published status
- Header navigation supports ordered custom nav items targeting template pages or URLs, with configurable cart pill; private previews can browse draft pages while public share/export navigation uses published pages
- Ecommerce page sections for collection grids, product details, cart summaries, and checkout summaries
- Shared section style controls for spacing, density, background, alignment, button style, and desktop/tablet/mobile visibility on main storefront sections
- Section layout variants for hero composition and product/collection grid composition, including split/centered/product-spotlight heroes and grid/editorial/compact product layouts
- Richer ecommerce controls for product count, product card style, quick-add visibility, collection filter/sort visibility, product media layout, and product detail media emphasis
- Page-specific ecommerce preview polish for editable collection description/status chips, filter states, editable product social proof/trust details, editable cart shipping incentives, and editable checkout express payment options
- Public storefront polish for commerce pages, including richer product cards, product inventory cues, cart trust signals, and checkout step framing
- Conversion sections such as reviews, FAQ, and trust band should render as polished ecommerce blocks with social proof, reassurance, and purchase-objection handling, not plain placeholder lists
- Reviews, FAQ, and trust band sections support `layoutVariant` controls so users can choose between featured/grid/editorial, support/compact/help-desk, and cards/strip/panel compositions
- Mobile, tablet, and wide desktop storefront fixes for hero composition, product grids, collection filters, product detail pages, quick-add buttons, cart line items, sticky purchase panels, and checkout summaries
- Section add/duplicate/delete/hide/show
- Drag-and-drop section reorder using `@dnd-kit`
- Undo/redo for template edits
- `/templates` dashboard with search, published/private filtering, sorting, visual template thumbnails, primary edit/preview actions, and progressive secondary controls for sharing, exports, duplicate, and delete
- Local-first `.store-template.json` export packages and multi-page static storefront zip exports for active templates and dashboard templates
- Generated Next storefront project zip exports with pnpm scripts, App Router pages, shared storefront component, template data, and theme CSS
- Static and generated Next storefront exports preserve the current hero and product-grid layout variants closely enough for visual parity checks
- Zod validation and versioning for stored/imported templates
- Desktop/tablet/mobile preview modes
- Preview zoom controls
- Independent scrolling for left sidebar, center canvas, and inspector
- Radix Popover for the custom color picker dropdown
- Clerk sign-in/sign-up pages with proxy-level route protection for the editor and dashboard
- Public landing page includes basic private-beta privacy, terms, and contact pages
- Account template persistence actions backed by `DATABASE_URL`, with localStorage fallback when the database is not configured
- Builder sync status distinguishes loading, saving, saved-to-account, local-only, and failed account sync states
- Local browser templates can be imported into the signed-in account from the builder sync prompt
- `/templates` dashboard create, duplicate, delete, import, and share flows report account sync results instead of silently ignoring failures
- `/templates` waits for account templates and share metadata before rendering template cards, then shows a lightweight loading skeleton while resolving
- Private beta limits are centralized in `lib/templater/limits.ts` and enforced in account server actions plus main builder/dashboard creation flows
- First-run welcome checklist with compact guidance for section, theme, item, device, and preview workflows
- Replayable guided tours in the builder and `/templates` dashboard using highlighted targets and short tooltips
- Lightweight English/French app UI translations for shared auth controls, guided tours, key builder/dashboard labels, and contextual help
- Contextual preview guidance for customer interactions such as product clicks, cart state, and checkout state
- Contextual help popovers for important workflows such as pages, adding sections, preview behavior, and dashboard filters
- Progressive disclosure in the builder: page settings, section library, and advanced section layout controls stay collapsed until needed
- Right inspector uses compact summaries for advanced layout/theme/product-card controls so common content edits stay prominent
- Left sidebar separates Pages, Sections, and Add-section workflows so users are not shown every navigation/editing control at once
- Left sidebar keeps template actions, add-page controls, and secondary add-section groups collapsed or compact so the current page/section remains prominent
- Selecting sections from the left sidebar opens the Section inspector; the sidebar should stay focused on choosing pages, choosing sections, or adding blocks
- Clicking a section in the builder preview selects that section and opens the Section inspector; non-builder preview routes should remain normal storefront browsing surfaces
- Custom builder/dashboard panels close on outside click; Radix popovers handle this natively
- Lightweight Playwright visual QA captures public, authenticated, share-preview, mobile, desktop, and French states when the required auth/share setup is present
- `docs/PRIVATE_BETA_CHECKLIST.md` tracks the minimum release checks for inviting private beta users

## Builder UX Direction

The builder shell should feel closer to Framer/Webflow/Shopify theme editor:

- Neutral app chrome
- Compact sidebars
- Clear selected-section state
- Design-tool-like preview canvas
- Real inspector controls instead of raw JSON
- Progressive disclosure for secondary/advanced controls so new users are not greeted by every option at once
- Keep export/reset and other secondary actions out of the main toolbar when possible.
- No oversized marketing sections inside the builder UI

Do not make the builder itself visually compete with the storefront template.

## Storefront Direction

The generated storefront should eventually look like a polished ecommerce template, not a generic demo page.

Expected section types over time:

- Announcement bar
- Header
- Hero
- Category strip
- Product grid
- Promo tiles
- Collection grid
- Product detail
- Cart summary
- Checkout summary
- Reviews/testimonials
- Trust/guarantee band
- FAQ
- Newsletter
- Footer

## Near-Term Priorities

1. Continue polishing storefront visuals and section variants so templates feel sellable, not just functional.
2. Polish the `/templates` dashboard for larger local libraries.
3. Improve hosted preview controls and status polish.
4. Add richer controls for responsive layout variants beyond visibility.

## Implementation Notes

- Prefer small, focused changes that preserve the schema-first model.
- Keep template data serializable as JSON.
- Use CSS variables/theme tokens for storefront customization.
- Keep localStorage as a draft/fallback cache, but account persistence should surface explicit status when `DATABASE_URL` is configured.
- Never infer deletable storage objects from arbitrary public URLs; delete only R2 keys stored in owned template metadata.
- Introduce dependencies only when they solve a real product need.
- Existing notable dependencies:
  - `@dnd-kit` for section reorder
  - `@radix-ui/react-popover` for floating color picker UI
  - `@playwright/test` for lightweight screenshot smoke checks
  - `zod` for template validation and migration
- Database dependencies:
  - `drizzle-orm` for typed Postgres access
  - `@neondatabase/serverless` for the Neon serverless driver
  - `drizzle-kit` for migration generation/application
- Storage dependencies:
- `@aws-sdk/client-s3` for Cloudflare R2 uploads through the S3-compatible API
- Likely future dependencies:
  - Zustand for editor state
- Private beta caps should stay centralized in `lib/templater/limits.ts`; avoid hard-coding account/template limits in UI components or server actions.

## Visual Constraints

- Avoid beige-heavy or one-note palettes for the builder UI.
- Cards should be purposeful; avoid card-in-card layouts.
- Keep controls compact and predictable.
- Account for translated UI labels being wider than English; prefer wrapping/flexible controls over fixed-width text assumptions.
- Ensure mobile and desktop preview modes do not overflow awkwardly.
- Do not put explanatory marketing copy in the app chrome unless it directly helps the workflow.
