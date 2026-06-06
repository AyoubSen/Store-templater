import Link from "next/link";

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy" updated="June 5, 2026">
      <p>
        Store Templater is currently private beta software. We collect the account, template, and uploaded image data needed to let you sign in, save templates,
        preview storefronts, and export your work.
      </p>
      <p>
        Authentication is handled by Clerk. Template data is stored in Neon Postgres, and uploaded product images are stored in Cloudflare R2. Public share
        links expose the published template pages you choose to publish.
      </p>
      <p>
        We do not sell personal data. During beta, operational logs may be used to debug reliability, upload, sync, and preview issues.
      </p>
      <p>
        To request deletion of your account data or uploaded template assets, use the contact page.
      </p>
    </InfoPage>
  );
}

function InfoPage({ children, title, updated }: { children: React.ReactNode; title: string; updated: string }) {
  return (
    <main className="min-h-screen bg-[#f4f6f8] text-[#111827]">
      <header className="border-[#d8dde5] border-b bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
          <Link className="text-sm font-semibold" href="/">
            Store Templater
          </Link>
          <Link className="rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]" href="/">
            Back home
          </Link>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-5 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748b]">Updated {updated}</p>
        <h1 className="mt-3 text-4xl font-semibold">{title}</h1>
        <div className="mt-6 space-y-5 text-base leading-8 text-[#475569]">{children}</div>
      </article>
    </main>
  );
}
