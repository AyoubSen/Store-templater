"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { getAccountTemplateAction } from "@/app/actions/templates";
import { StorefrontPreview } from "@/components/storefront-preview";
import type { PreviewCartItem } from "@/components/storefront-preview";
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
  const [selectedPageId, setSelectedPageId] = useState(sampleTemplate.pages[0]?.id ?? "");
  const [activeProductId, setActiveProductId] = useState(sampleTemplate.products[0]?.id ?? "");
  const [cartItems, setCartItems] = useState<PreviewCartItem[]>([]);
  const [wasFound, setWasFound] = useState(true);
  const selectedPage = findPreviewPage(template, pageParam);
  const currentPage = template.pages.find((page) => page.id === selectedPageId) ?? selectedPage;

  useEffect(() => {
    window.setTimeout(() => {
      const storedTemplate = readStoredTemplateById(templateId);
      const nextTemplate = storedTemplate ?? sampleTemplate;
      const page = findPreviewPage(nextTemplate, pageParam);

      setTemplate(nextTemplate);
      setSelectedPageId(page?.id ?? nextTemplate.pages[0]?.id ?? "");
      setActiveProductId(nextTemplate.products[0]?.id ?? "");
      setWasFound(Boolean(storedTemplate));
    }, 0);

    getAccountTemplateAction(templateId).then((result) => {
      if (!result.isDatabaseConfigured || !result.data) {
        return;
      }

      const page = findPreviewPage(result.data, pageParam);

      setTemplate(result.data);
      setSelectedPageId(page?.id ?? result.data.pages[0]?.id ?? "");
      setActiveProductId(result.data.products[0]?.id ?? "");
      setWasFound(true);
    });
  }, [pageParam, templateId]);

  function navigatePage(pageId: string) {
    const page = template.pages.find((templatePage) => templatePage.id === pageId);

    setSelectedPageId(pageId);

    if (page) {
      window.history.replaceState(null, "", `/preview/${templateId}?page=${encodeURIComponent(page.slug)}`);
    }
  }

  function openProduct(productId: string) {
    const productPage = template.pages.find((page) => page.type === "product" && page.status === "published");

    setActiveProductId(productId);

    if (productPage) {
      navigatePage(productPage.id);
    }
  }

  function addCartItem(productId: string) {
    setCartItems((current) => {
      const existingItem = current.find((item) => item.productId === productId);

      if (existingItem) {
        return current.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item));
      }

      return [...current, { productId, quantity: 1 }];
    });
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 flex h-11 items-center justify-between border-slate-200 border-b bg-white/90 px-4 text-sm backdrop-blur">
        <div>
          <div className="font-medium text-slate-900">{currentPage?.seoTitle ?? template.name}</div>
          {!wasFound ? <div className="text-xs text-amber-700">Template not found. Showing sample.</div> : null}
        </div>
        <Link className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700" href="/builder">
          Back to builder
        </Link>
      </div>
      <StorefrontPreview
        activeProductId={activeProductId}
        cartItems={cartItems}
        onAddToCart={addCartItem}
        onNavigatePage={navigatePage}
        onOpenProduct={openProduct}
        pageId={currentPage?.id}
        template={template}
      />
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
