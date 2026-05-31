"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { StorefrontPreview } from "@/components/storefront-preview";
import { sampleTemplate } from "@/lib/templater/sample-template";
import type { StoreTemplate } from "@/lib/templater/schema";
import { readStoredTemplateById } from "@/lib/templater/storage";

export default function TemplatePreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ templateId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { templateId } = use(params);
  const { page: pageParam } = use(searchParams);
  const [template, setTemplate] = useState<StoreTemplate>(sampleTemplate);
  const [wasFound, setWasFound] = useState(true);
  const selectedPage = findPreviewPage(template, pageParam);

  useEffect(() => {
    window.setTimeout(() => {
      const storedTemplate = readStoredTemplateById(templateId);
      setTemplate(storedTemplate ?? sampleTemplate);
      setWasFound(Boolean(storedTemplate));
    }, 0);
  }, [templateId]);

  return (
    <main className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 flex h-11 items-center justify-between border-slate-200 border-b bg-white/90 px-4 text-sm backdrop-blur">
        <div>
          <div className="font-medium text-slate-900">{selectedPage?.seoTitle ?? template.name}</div>
          {!wasFound ? <div className="text-xs text-amber-700">Template not found. Showing sample.</div> : null}
        </div>
        <Link className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700" href="/">
          Back to builder
        </Link>
      </div>
      <StorefrontPreview pageId={selectedPage?.id} template={template} />
    </main>
  );
}

function findPreviewPage(template: StoreTemplate, pageParam?: string) {
  if (!pageParam) {
    return template.pages[0];
  }

  const normalizedParam = decodeURIComponent(pageParam);

  return template.pages.find((page) => page.id === normalizedParam || page.slug === normalizedParam) ?? template.pages[0];
}
