import Link from "next/link";

export default function TermsPage() {
  return (
    <InfoPage title="Terms" updated="June 5, 2026">
      <p>
        Store Templater is provided as private beta software. Features, limits, export formats, and hosted preview behavior may change while the product is
        being built.
      </p>
      <p>
        You are responsible for the template content, product images, copy, and public preview links you create. Only publish content you have the right to use.
      </p>
      <p>
        The app is not yet a production ecommerce platform. Generated exports and public previews should be reviewed before using them for a real store.
      </p>
      <p>
        We may apply beta limits to protect infrastructure, including limits on saved templates, products, uploads, and published previews.
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
