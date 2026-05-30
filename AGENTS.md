<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Store Templater Project Notes

## Product Direction

Store Templater is a visual builder for customizable ecommerce store templates.

The product should behave more like a practical theme editor/design tool than a marketing site. Prioritize a quiet, dense, professional builder UI with the storefront preview carrying most of the visual personality.

Core user flow:

1. Create or open a store template.
2. Edit theme tokens, pages, sections, and content.
3. Preview the actual storefront experience.
4. Save, export, or publish the template.

## Current Stack

- Next.js 16 app router
- React 19
- TypeScript
- Tailwind CSS 4
- pnpm

Current scripts:

- `pnpm dev`
- `pnpm build`
- `pnpm lint`

Run `pnpm build` after meaningful code changes.

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
- `lib/templater/storage.ts`: localStorage persistence for active template and local template library
- `components/builder/section-sidebar.tsx`: template switcher, page list, section list, section library, drag reorder
- `components/builder/preview-canvas.tsx`: editor toolbar, device controls, zoom, preview canvas
- `components/builder/inspector-panel.tsx`: Store/Theme/Items/Section inspector tabs
- `components/builder/section-inspector.tsx`: section-specific editing controls
- `components/builder/controls.tsx`: reusable controls including color picker and field editors
- `components/storefront-preview.tsx`: shared storefront renderer
- `app/page.tsx`: builder state/persistence orchestration
- `app/preview/page.tsx`: active-template preview fallback
- `app/preview/[templateId]/page.tsx`: explicit local template preview route

Avoid duplicating storefront rendering logic between the builder and preview page. The builder canvas and preview route should use `components/storefront-preview.tsx`.

## Current Feature Set

- Local multi-template library stored in localStorage
- Starter template picker for new templates
- Explicit `/preview/[templateId]` preview URLs
- Store settings for name/category
- Theme color tokens, theme presets, and typography presets
- Product editing, add/duplicate/delete
- Local product image import as data URLs
- Product image repositioning, reset/remove, and zoom inside fixed `4/5` media frames
- Basic page management for home, collection, product, cart, checkout, about, and contact pages
- Ecommerce page sections for collection grids, product details, cart summaries, and checkout summaries
- Shared section style controls for spacing, background, alignment, and button style on main storefront sections
- Section add/duplicate/delete/hide/show
- Drag-and-drop section reorder using `@dnd-kit`
- Undo/redo for template edits
- `/templates` dashboard with JSON import/export
- Zod validation and versioning for stored/imported templates
- Desktop/tablet/mobile preview modes
- Preview zoom controls
- Independent scrolling for left sidebar, center canvas, and inspector
- Radix Popover for the custom color picker dropdown

## Builder UX Direction

The builder shell should feel closer to Framer/Webflow/Shopify theme editor:

- Neutral app chrome
- Compact sidebars
- Clear selected-section state
- Design-tool-like preview canvas
- Real inspector controls instead of raw JSON
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

1. Improve the storefront visual design so templates feel sellable, not just functional.
2. Add richer section controls for product count, media layout, and visibility rules.
3. Polish the `/templates` dashboard for larger local libraries.
4. Add hosted preview URLs.
5. Add real backend persistence and auth after local editor workflows settle.

## Implementation Notes

- Prefer small, focused changes that preserve the schema-first model.
- Keep template data serializable as JSON.
- Use CSS variables/theme tokens for storefront customization.
- Introduce dependencies only when they solve a real product need.
- Existing notable dependencies:
  - `@dnd-kit` for section reorder
  - `@radix-ui/react-popover` for floating color picker UI
  - `zod` for template validation and migration
- Likely future dependencies:
  - Zustand for editor state
  - Drizzle or Prisma with PostgreSQL for persistence

## Visual Constraints

- Avoid beige-heavy or one-note palettes for the builder UI.
- Cards should be purposeful; avoid card-in-card layouts.
- Keep controls compact and predictable.
- Ensure mobile and desktop preview modes do not overflow awkwardly.
- Do not put explanatory marketing copy in the app chrome unless it directly helps the workflow.
