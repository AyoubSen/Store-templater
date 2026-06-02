import type { Metadata } from "next";
import Link from "next/link";
import { PublicStorefrontPreview } from "@/components/public-storefront-preview";
import { getSharedTemplate } from "@/lib/templater/shared-preview";

type SharedPageProps = {
  params: Promise<{ shareId: string; pageSlug?: string[] }>;
};

export async function generateMetadata({ params }: SharedPageProps): Promise<Metadata> {
  const { shareId, pageSlug } = await params;
  const template = await getSharedTemplate(shareId);
  const pagePath = pageSlug?.join("/");
  const page =
    template?.pages.find((templatePage) => templatePage.slug === pagePath || templatePage.id === pagePath) ??
    template?.pages.find((templatePage) => templatePage.type === "home");

  if (!template || !page) {
    return {
      title: "Preview unavailable | Store Templater",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${page.seoTitle || page.name} | ${template.name}`,
    description: `${template.name} storefront preview.`,
    robots: { index: false, follow: false },
  };
}

export default async function SharedTemplatePage({ params }: SharedPageProps) {
  const { shareId, pageSlug } = await params;
  const template = await getSharedTemplate(shareId);
  const pagePath = pageSlug?.join("/");

  if (!template || template.pages.length === 0) {
    return <UnavailablePreview />;
  }

  const requestedPage = pagePath
    ? template.pages.find((page) => page.slug === pagePath || page.id === pagePath)
    : template.pages.find((page) => page.type === "home") ?? template.pages[0];

  if (!requestedPage) {
    return <UnavailablePreview />;
  }

  return (
    <main className="min-h-screen bg-[var(--store-canvas)] text-[var(--store-text)]">
      <PublicStorefrontPreview initialPagePath={requestedPage.slug} shareId={shareId} template={template} />
    </main>
  );
}

function UnavailablePreview() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f8fafc] px-5 text-[#111827]">
      <section className="max-w-md rounded-lg border border-[#d8dde5] bg-white p-6 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">Store Templater</p>
        <h1 className="mt-3 text-2xl font-semibold">This preview is not available</h1>
        <p className="mt-2 text-sm leading-6 text-[#64748b]">
          The share link may be disabled, deleted, or the requested page may not be published.
        </p>
        <Link
          className="mt-5 inline-flex rounded-md bg-[#111827] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f2937]"
          href="/"
        >
          Go home
        </Link>
      </section>
    </main>
  );
}
