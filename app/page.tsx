import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

const features = [
  "Schema-driven storefront templates",
  "Visual page, section, theme, and product editing",
  "Browsable preview with cart and checkout flows",
  "Exportable static sites and runnable Next projects",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f4f6f8] text-[#111827]">
      <header className="border-[#d8dde5] border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link className="flex items-center gap-2" href="/">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-[#111827] text-xs font-semibold text-white">ST</span>
            <span className="text-sm font-semibold">Store Templater</span>
          </Link>
          <div className="flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  className="rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]"
                  type="button"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-md bg-[#111827] px-3 py-2 text-sm font-medium text-white hover:bg-[#1f2937]" type="button">
                  Create account
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link className="rounded-md bg-[#111827] px-3 py-2 text-sm font-medium text-white hover:bg-[#1f2937]" href="/builder">
                Open builder
              </Link>
            </Show>
          </div>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-65px)] max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(460px,1.1fr)]">
        <div className="py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">Ecommerce template builder</p>
          <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-[1.05] text-[#111827]">
            Store Templater
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#475569]">
            Create customizable store templates with editable sections, theme tokens, product content, live previews, and export-ready storefront projects.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <button className="rounded-md bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f2937]" type="button">
                  Start building
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button
                  className="rounded-md border border-[#d8dde5] bg-white px-4 py-2.5 text-sm font-semibold text-[#334155] hover:bg-[#f1f5f9]"
                  type="button"
                >
                  Sign in
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Link className="rounded-md bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f2937]" href="/builder">
                Open builder
              </Link>
              <Link
                className="rounded-md border border-[#d8dde5] bg-white px-4 py-2.5 text-sm font-semibold text-[#334155] hover:bg-[#f1f5f9]"
                href="/templates"
              >
                Manage templates
              </Link>
            </Show>
          </div>
          <div className="mt-8 grid gap-2">
            {features.map((feature) => (
              <div className="flex items-center gap-3 text-sm text-[#334155]" key={feature}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#1d4ed8]" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#d8dde5] bg-white p-3 shadow-xl shadow-slate-900/10">
          <div className="grid gap-3 rounded-md border border-[#e2e8f0] bg-[#eef0f3] p-3 md:grid-cols-[180px_minmax(0,1fr)]">
            <div className="rounded-md border border-[#d8dde5] bg-white p-3">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-7 w-7 rounded-md bg-[#111827]" />
                <div className="space-y-1">
                  <span className="block h-2.5 w-20 rounded bg-[#cbd5e1]" />
                  <span className="block h-2 w-14 rounded bg-[#e2e8f0]" />
                </div>
              </div>
              {["Pages", "Sections", "Theme", "Items"].map((item, index) => (
                <div className={`mt-2 rounded-md px-3 py-2 text-xs font-medium ${index === 1 ? "bg-[#eff6ff] text-[#1d4ed8]" : "bg-[#f8fafc] text-[#64748b]"}`} key={item}>
                  {item}
                </div>
              ))}
            </div>
            <div className="overflow-hidden rounded-md border border-[#d8dde5] bg-[#f7f4ef]">
              <div className="flex items-center justify-between border-[#ded7ce] border-b bg-white px-4 py-3">
                <span className="text-sm font-semibold">Atelier Goods</span>
                <span className="rounded-full border border-[#ded7ce] px-3 py-1 text-xs">Cart 0</span>
              </div>
              <div className="grid gap-5 p-5 sm:grid-cols-[minmax(0,0.95fr)_180px] sm:items-center">
                <div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1f7a63]">New drop</span>
                  <h2 className="mt-4 text-4xl font-semibold leading-tight">Quiet staples for daily rotation.</h2>
                  <p className="mt-3 text-sm leading-6 text-[#64748b]">A live storefront preview powered by editable template data.</p>
                </div>
                <div className="rounded-lg border border-[#ded7ce] bg-white p-3 shadow-lg shadow-slate-900/10">
                  <div className="aspect-[4/5] rounded-md bg-[linear-gradient(135deg,#f2c078,#e75a3c)]" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[#1f7a63]">Featured set</p>
                  <p className="mt-1 text-sm font-semibold">Curated essentials</p>
                  <p className="mt-1 text-xs text-[#64748b]">from $164</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
