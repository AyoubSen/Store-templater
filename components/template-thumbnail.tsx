"use client";

import type { CSSProperties } from "react";
import type { Product, StoreTemplate, TemplateSection } from "@/lib/templater/schema";

type TemplateThumbnailProps = {
  activeLabel: string;
  isActive: boolean;
  isPublished: boolean;
  privateLabel: string;
  publishedLabel: string;
  template: StoreTemplate;
};

export function TemplateThumbnail({
  activeLabel,
  isActive,
  isPublished,
  privateLabel,
  publishedLabel,
  template,
}: TemplateThumbnailProps) {
  const homePage = template.pages.find((page) => page.type === "home") ?? template.pages[0];
  const heroSection = homePage?.sections.find((section) => section.type === "hero");
  const productSection = homePage?.sections.find(
    (section) => section.type === "productGrid" || section.type === "collectionGrid",
  );
  const heroVariant = stringSetting(heroSection, "variant", "split");
  const productLayout = stringSetting(productSection, "productGridLayout", "grid");
  const products = template.products.slice(0, productLayout === "compact" ? 4 : 3);
  const colors = template.theme.colors;
  const style = {
    "--thumb-accent": colors.accent,
    "--thumb-border": colors.border,
    "--thumb-canvas": colors.canvas,
    "--thumb-muted": colors.muted,
    "--thumb-primary": colors.primary,
    "--thumb-secondary": colors.secondary,
    "--thumb-surface": colors.surface,
    "--thumb-text": colors.text,
  } as CSSProperties;

  return (
    <div
      className="relative aspect-[16/10] overflow-hidden rounded-md border border-[#d8dde5] bg-[var(--thumb-canvas)] shadow-inner"
      style={style}
    >
      <div className="absolute inset-x-0 top-0 flex h-7 items-center justify-between border-[var(--thumb-border)] border-b bg-[var(--thumb-surface)] px-3">
        <div className="h-2 w-16 rounded-full bg-[var(--thumb-text)]/80" />
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-5 rounded-full bg-[var(--thumb-muted)]/35" />
          <span className="h-1.5 w-5 rounded-full bg-[var(--thumb-muted)]/35" />
        </div>
      </div>

      <div className="absolute inset-x-3 top-9 bottom-3 overflow-hidden rounded-sm">
        <HeroMiniature heroVariant={heroVariant} product={products[0]} />
        <ProductGridMiniature layout={productLayout} products={products} />
      </div>

      <div className="absolute top-9 left-3 flex max-w-[70%] flex-wrap gap-1">
        {isActive ? (
          <span className="rounded bg-[#111827] px-1.5 py-1 text-[10px] font-semibold leading-none text-white shadow-sm">
            {activeLabel}
          </span>
        ) : null}
      </div>
      <span
        className={`absolute top-9 right-3 rounded px-1.5 py-1 text-[10px] font-semibold leading-none shadow-sm ${
          isPublished ? "bg-[#dcfce7] text-[#166534]" : "bg-white/90 text-[#64748b]"
        }`}
      >
        {isPublished ? publishedLabel : privateLabel}
      </span>
    </div>
  );
}

function HeroMiniature({ heroVariant, product }: { heroVariant: string; product: Product | undefined }) {
  if (heroVariant === "centered") {
    return (
      <div className="grid h-[58%] place-items-center rounded-sm bg-[var(--thumb-surface)] px-7 text-center">
        <div className="w-full">
          <div className="mx-auto h-2 w-16 rounded-full bg-[var(--thumb-primary)]" />
          <div className="mx-auto mt-2 h-4 w-28 rounded-full bg-[var(--thumb-text)]" />
          <div className="mx-auto mt-1.5 h-2 w-20 rounded-full bg-[var(--thumb-muted)]/50" />
          <div className="mx-auto mt-3 h-5 w-16 rounded-full bg-[var(--thumb-accent)]" />
        </div>
      </div>
    );
  }

  if (heroVariant === "productSpotlight") {
    return (
      <div className="grid h-[58%] grid-cols-[0.9fr_1fr] gap-2 rounded-sm bg-[var(--thumb-surface)] p-2">
        <div className="overflow-hidden rounded bg-[var(--thumb-secondary)]">
          <ProductImage product={product} />
        </div>
        <div className="flex flex-col justify-center">
          <div className="h-2 w-11 rounded-full bg-[var(--thumb-primary)]" />
          <div className="mt-2 h-4 w-20 rounded-full bg-[var(--thumb-text)]" />
          <div className="mt-1.5 h-2 w-16 rounded-full bg-[var(--thumb-muted)]/50" />
          <div className="mt-3 h-5 w-14 rounded-full bg-[var(--thumb-accent)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-[58%] grid-cols-[1fr_0.85fr] gap-2 rounded-sm bg-[var(--thumb-surface)] p-3">
      <div className="flex min-w-0 flex-col justify-center">
        <div className="h-2 w-12 rounded-full bg-[var(--thumb-primary)]" />
        <div className="mt-2 h-4 w-24 rounded-full bg-[var(--thumb-text)]" />
        <div className="mt-1.5 h-2 w-16 rounded-full bg-[var(--thumb-muted)]/50" />
        <div className="mt-3 h-5 w-14 rounded-full bg-[var(--thumb-accent)]" />
      </div>
      <div className="overflow-hidden rounded bg-[var(--thumb-secondary)]">
        <ProductImage product={product} />
      </div>
    </div>
  );
}

function ProductGridMiniature({ layout, products }: { layout: string; products: Product[] }) {
  if (layout === "editorial") {
    return (
      <div className="mt-2 grid h-[36%] grid-cols-[1.15fr_0.85fr] gap-2">
        <ProductTile product={products[0]} />
        <div className="grid gap-2">
          <ProductTile compact product={products[1]} />
          <ProductTile compact product={products[2]} />
        </div>
      </div>
    );
  }

  if (layout === "compact") {
    return (
      <div className="mt-2 grid h-[36%] grid-cols-4 gap-1.5">
        {[0, 1, 2, 3].map((index) => (
          <ProductTile compact key={products[index]?.id ?? index} product={products[index]} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-2 grid h-[36%] grid-cols-3 gap-2">
      {[0, 1, 2].map((index) => (
        <ProductTile key={products[index]?.id ?? index} product={products[index]} />
      ))}
    </div>
  );
}

function ProductTile({ compact = false, product }: { compact?: boolean; product: Product | undefined }) {
  return (
    <div className="overflow-hidden rounded border border-[var(--thumb-border)] bg-[var(--thumb-surface)]">
      <div className={compact ? "h-2/3 bg-[var(--thumb-secondary)]" : "h-[68%] bg-[var(--thumb-secondary)]"}>
        <ProductImage product={product} />
      </div>
      <div className="space-y-1 p-1.5">
        <div className="h-1.5 rounded-full bg-[var(--thumb-text)]/75" />
        {!compact ? <div className="h-1.5 w-2/3 rounded-full bg-[var(--thumb-muted)]/45" /> : null}
      </div>
    </div>
  );
}

function ProductImage({ product }: { product: Product | undefined }) {
  if (!product?.image) {
    return <div className="h-full w-full bg-gradient-to-br from-[var(--thumb-secondary)] to-[var(--thumb-accent)]" />;
  }

  return (
    <div
      className="h-full w-full bg-cover bg-center"
      style={{
        backgroundImage: normalizeImage(product.image),
        backgroundPosition: `${product.imagePositionX ?? 50}% ${product.imagePositionY ?? 50}%`,
        backgroundSize: `${Math.max(product.imageZoom ?? 100, 100)}%`,
      }}
    />
  );
}

function normalizeImage(image: string) {
  if (image.startsWith("linear-gradient") || image.startsWith("radial-gradient") || image.startsWith("url(")) {
    return image;
  }

  return `url("${image}")`;
}

function stringSetting(section: TemplateSection | undefined, key: string, fallback: string) {
  const value = section?.settings[key];
  return typeof value === "string" ? value : fallback;
}
