# Private Beta Checklist

Use this as the release checklist before inviting real users. The goal is not to make Store Templater feature-complete; it is to make the current product understandable, stable, and recoverable.

## Required Before Invites

- Run `pnpm lint` and `pnpm build` on the exact branch being deployed.
- Run `pnpm qa:visual` when changing layout, responsive behavior, public pages, builder chrome, or storefront visuals.
- Verify Clerk production keys, Neon `DATABASE_URL`, and Cloudflare R2 variables are configured in Vercel.
- Create, save, reload, duplicate, delete, publish, unpublish, and reopen at least one account template.
- Upload, replace, reposition, remove, and delete product images, then confirm R2 cleanup still only deletes owned keys.
- Confirm public share links work for published templates and return unavailable copy after unpublishing.
- Export `.store-template.json`, static storefront zip, and generated Next project zip from a representative template.
- Test English and French app chrome at desktop and mobile widths.

## Private Beta Limits

- Templates per user: 5.
- Products per template: 30.
- Published templates per user: 3.

These caps protect free-tier infrastructure while the product is still in private beta. Keep the caps centralized in `lib/templater/limits.ts` so server actions, builder UI, and dashboard UI stay aligned.

## Ship Criteria

- New users can understand the first edit without reading docs.
- Account sync errors are visible and do not silently discard local work.
- Public preview links do not expose draft pages.
- Builder and dashboard remain usable on common laptop widths.
- A user can leave, return from another browser, and see the same account templates.
