"use client";

import { useMemo, useState } from "react";
import { StorefrontPreview, type PreviewCartItem } from "@/components/storefront-preview";
import type { StoreTemplate } from "@/lib/templater/schema";

export function PublicStorefrontPreview({
  initialPagePath,
  shareId,
  template,
}: {
  initialPagePath?: string;
  shareId: string;
  template: StoreTemplate;
}) {
  const initialPage = useMemo(
    () =>
      template.pages.find((page) => page.slug === initialPagePath || page.id === initialPagePath) ??
      template.pages.find((page) => page.type === "home") ??
      template.pages[0],
    [initialPagePath, template],
  );
  const [selectedPageId, setSelectedPageId] = useState(initialPage?.id ?? "");
  const [activeProductId, setActiveProductId] = useState(template.products[0]?.id ?? "");
  const [cartItems, setCartItems] = useState<PreviewCartItem[]>([]);

  function selectPage(pageId: string) {
    const page = template.pages.find((templatePage) => templatePage.id === pageId);

    if (!page) {
      return;
    }

    setSelectedPageId(page.id);
    window.history.pushState(null, "", createPublicPagePath(shareId, page.slug, page.type === "home"));
  }

  function openProduct(productId: string) {
    const productPage = template.pages.find((page) => page.type === "product");

    setActiveProductId(productId);

    if (productPage) {
      selectPage(productPage.id);
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
    <div
      style={
        {
          "--store-canvas": template.theme.colors.canvas,
          "--store-surface": template.theme.colors.surface,
          "--store-text": template.theme.colors.text,
          "--store-muted": template.theme.colors.muted,
          "--store-primary": template.theme.colors.primary,
          "--store-secondary": template.theme.colors.secondary,
          "--store-accent": template.theme.colors.accent,
          "--store-border": template.theme.colors.border,
          "--store-radius": `${template.theme.layout.radius}px`,
          "--store-spacing": `${template.theme.layout.spacing}px`,
          "--store-max-width": `${template.theme.layout.maxWidth}px`,
        } as React.CSSProperties
      }
    >
      <StorefrontPreview
        activeProductId={activeProductId}
        cartItems={cartItems}
        onAddToCart={addCartItem}
        onNavigatePage={selectPage}
        onOpenProduct={openProduct}
        pageId={selectedPageId}
        selectedSectionId=""
        template={template}
      />
    </div>
  );
}

function createPublicPagePath(shareId: string, slug: string, isHomePage: boolean) {
  if (isHomePage || slug === "home") {
    return `/s/${shareId}`;
  }

  return `/s/${shareId}/${encodeURIComponent(slug)}`;
}
