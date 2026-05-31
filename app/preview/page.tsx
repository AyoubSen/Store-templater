"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { StorefrontPreview } from "@/components/storefront-preview";
import type { PreviewCartItem } from "@/components/storefront-preview";
import { sampleTemplate } from "@/lib/templater/sample-template";
import type { StoreTemplate } from "@/lib/templater/schema";
import { readStoredTemplate } from "@/lib/templater/storage";

export default function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = use(searchParams);
  const [template, setTemplate] = useState<StoreTemplate>(sampleTemplate);
  const [selectedPageId, setSelectedPageId] = useState(sampleTemplate.pages[0]?.id ?? "");
  const [activeProductId, setActiveProductId] = useState(sampleTemplate.products[0]?.id ?? "");
  const [cartItems, setCartItems] = useState<PreviewCartItem[]>([]);
  const selectedPage = findPreviewPage(template, pageParam);
  const currentPage = template.pages.find((page) => page.id === selectedPageId) ?? selectedPage;

  useEffect(() => {
    window.setTimeout(() => {
      const storedTemplate = readStoredTemplate();
      const page = findPreviewPage(storedTemplate, pageParam);

      setTemplate(storedTemplate);
      setSelectedPageId(page?.id ?? storedTemplate.pages[0]?.id ?? "");
      setActiveProductId(storedTemplate.products[0]?.id ?? "");
    }, 0);
  }, [pageParam]);

  function navigatePage(pageId: string) {
    const page = template.pages.find((templatePage) => templatePage.id === pageId);

    setSelectedPageId(pageId);

    if (page) {
      window.history.replaceState(null, "", `/preview?page=${encodeURIComponent(page.slug)}`);
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
        <div className="font-medium text-slate-900">{currentPage?.seoTitle ?? template.name}</div>
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
