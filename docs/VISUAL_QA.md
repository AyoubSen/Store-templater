# Visual QA

Store Templater has a lightweight Playwright workflow for screenshot smoke checks. It is meant to catch broken layouts, hydration/runtime errors, and obvious mobile or translation overflow before a manual review.

## Install Browsers

Run this once on a machine that has not used Playwright before:

```bash
pnpm qa:visual:install
```

## Run Public Checks

```bash
pnpm qa:visual
```

This starts or reuses the app on `http://127.0.0.1:3000` unless `PLAYWRIGHT_BASE_URL` is set. Screenshots are written to `test-results/visual/<project>/screenshots/`, and the HTML report can be opened with:

```bash
pnpm qa:visual:report
```

## Include Protected Pages

`/builder`, `/templates`, and `/preview` are Clerk-protected. To include them, create a Playwright storage state with a signed-in test account:

```bash
pnpm dev
pnpm exec playwright codegen http://localhost:3000/builder --save-storage=tests/.auth/user.json
pnpm qa:visual
```

The protected checks are skipped when `tests/.auth/user.json` is missing. You can also point to another auth file:

```bash
PLAYWRIGHT_STORAGE_STATE=tests/.auth/other-user.json pnpm qa:visual
```

Use the same host for capture and test runs. Clerk localhost cookies are host-specific, so if the storage state was captured on `localhost`, run the suite with:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:3000 pnpm qa:visual
```

## Include Public Share Preview

Public share previews depend on a real published template id from the database. Pass a share path when you want those screenshots:

```bash
VISUAL_QA_SHARE_PATH=/s/your-share-id pnpm qa:visual
```

For the full local pass on Windows PowerShell, use the same host as the saved Clerk storage state and include a real share path:

```powershell
$env:PLAYWRIGHT_BASE_URL='http://localhost:3000'
$env:VISUAL_QA_SHARE_PATH='/s/your-share-id'
pnpm qa:visual
```

## Notes

- These checks do not use pixel baselines yet, because the UI is still moving quickly.
- The tests disable animations and dismiss onboarding/tour state before capture.
- Keep screenshots and reports out of commits; they are ignored by git.
