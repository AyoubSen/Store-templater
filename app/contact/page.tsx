import Link from "next/link";

export default function ContactPage() {
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
      <section className="mx-auto max-w-3xl px-5 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748b]">Private beta</p>
        <h1 className="mt-3 text-4xl font-semibold">Contact</h1>
        <div className="mt-6 space-y-5 text-base leading-8 text-[#475569]">
          <p>
            For beta feedback, account data requests, or support with a saved template, contact the project owner directly for now.
          </p>
          <p>
            A dedicated support address should be added before opening the product beyond private beta.
          </p>
        </div>
      </section>
    </main>
  );
}
