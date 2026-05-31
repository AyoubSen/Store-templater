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
- pnpm

Current scripts:

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm verify:exports`

Run `pnpm build` after meaningful code changes.
Run `pnpm verify:exports` after export-generator changes.

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
- `lib/templater/storage.ts`: localStorage persistence for active template and local template library
- `components/builder/section-sidebar.tsx`: template switcher, page list, section list, section library, drag reorder
- `components/builder/preview-canvas.tsx`: editor toolbar, device controls, zoom, preview canvas
- `components/builder/inspector-panel.tsx`: Store/Theme/Items/Section inspector tabs
- `components/builder/section-inspector.tsx`: section-specific editing controls
- `components/builder/controls.tsx`: reusable controls including color picker and field editors
- `components/storefront-preview.tsx`: shared storefront renderer
- `app/page.tsx`: public landing page
- `app/builder/page.tsx`: builder state/persistence orchestration
- `app/preview/page.tsx`: active-template preview fallback
- `app/preview/[templateId]/page.tsx`: explicit local template preview route

Avoid duplicating storefront rendering logic between the builder and preview page. The builder canvas and preview route should use `components/storefront-preview.tsx`.

## Current Feature Set

- Local multi-template library stored in localStorage
- Starter template picker for new templates
- Explicit `/preview/[templateId]` preview URLs with selected-page query support
- Browsable preview navigation for published template pages, product cards, cart, and checkout
- Store settings for name/category
- Theme color tokens, theme presets, and typography presets
- Product editing, add/duplicate/delete
- Local product image import as data URLs
- Product image repositioning, reset/remove, and zoom inside fixed `4/5` media frames
- Lightweight local preview cart state for add-to-cart, cart summary, and checkout summary flows
- Basic page management for home, collection, product, cart, checkout, about, and contact pages
- Page metadata for slug, SEO title, and draft/published status
- Ecommerce page sections for collection grids, product details, cart summaries, and checkout summaries
- Shared section style controls for spacing, density, background, alignment, button style, and desktop/tablet/mobile visibility on main storefront sections
- Richer ecommerce controls for product count, product card style, quick-add visibility, collection filter/sort visibility, product media layout, and product detail media emphasis
- Page-specific ecommerce preview polish for editable collection description/status chips, filter states, editable product social proof/trust details, editable cart shipping incentives, and editable checkout express payment options
- Mobile, tablet, and wide desktop storefront fixes for hero composition, product grids, collection filters, product detail pages, quick-add buttons, cart line items, sticky purchase panels, and checkout summaries
- Section add/duplicate/delete/hide/show
- Drag-and-drop section reorder using `@dnd-kit`
- Undo/redo for template edits
- `/templates` dashboard with JSON import/export
- Local-first `.store-template.json` export packages and multi-page static storefront zip exports for active templates and dashboard templates
- Generated Next storefront project zip exports with pnpm scripts, App Router pages, shared storefront component, template data, and theme CSS
- Zod validation and versioning for stored/imported templates
- Desktop/tablet/mobile preview modes
- Preview zoom controls
- Independent scrolling for left sidebar, center canvas, and inspector
- Radix Popover for the custom color picker dropdown
- Clerk sign-in/sign-up pages with proxy-level route protection for the editor and dashboard
- Account template persistence actions backed by `DATABASE_URL`, with localStorage fallback when the database is not configured
- Builder sync status distinguishes loading, saving, saved-to-account, local-only, and failed account sync states
- Local browser templates can be imported into the signed-in account from the builder sync prompt
- `/templates` dashboard create, duplicate, delete, and import flows report account sync results instead of silently ignoring failures
- First-run welcome checklist with compact guidance for section, theme, item, device, and preview workflows
- Progressive disclosure in the builder: page settings, section library, and advanced section layout controls stay collapsed until needed

## Builder UX Direction

The builder shell should feel closer to Framer/Webflow/Shopify theme editor:

- Neutral app chrome
- Compact sidebars
- Clear selected-section state
- Design-tool-like preview canvas
- Real inspector controls instead of raw JSON
- Progressive disclosure for secondary/advanced controls so new users are not greeted by every option at once
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

1. Continue polishing storefront visuals so templates feel sellable, not just functional.
2. Polish the `/templates` dashboard for larger local libraries.
3. Add hosted preview URLs.
4. Add richer controls for responsive layout variants beyond visibility.
5. Add real backend persistence and auth after local editor workflows settle.

## Implementation Notes

- Prefer small, focused changes that preserve the schema-first model.
- Keep template data serializable as JSON.
- Use CSS variables/theme tokens for storefront customization.
- Keep localStorage as a draft/fallback cache, but account persistence should surface explicit status when `DATABASE_URL` is configured.
- Introduce dependencies only when they solve a real product need.
- Existing notable dependencies:
  - `@dnd-kit` for section reorder
  - `@radix-ui/react-popover` for floating color picker UI
  - `zod` for template validation and migration
- Database dependencies:
  - `drizzle-orm` for typed Postgres access
  - `@neondatabase/serverless` for the Neon serverless driver
  - `drizzle-kit` for migration generation/application
- Likely future dependencies:
  - Zustand for editor state

## Visual Constraints

- Avoid beige-heavy or one-note palettes for the builder UI.
- Cards should be purposeful; avoid card-in-card layouts.
- Keep controls compact and predictable.
- Ensure mobile and desktop preview modes do not overflow awkwardly.
- Do not put explanatory marketing copy in the app chrome unless it directly helps the workflow.
