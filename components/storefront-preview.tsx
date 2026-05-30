"use client";

import { useEffect } from "react";
import type { Product, StoreTemplate, TemplateSection } from "@/lib/templater/schema";

export function StorefrontPreview({
  pageId,
  selectedSectionId,
  template,
}: {
  pageId?: string;
  selectedSectionId?: string;
  template: StoreTemplate;
}) {
  const page = template.pages.find((templatePage) => templatePage.id === pageId) ?? template.pages[0];
  const enabledSections = page?.sections.filter((section) => section.enabled) ?? [];

  const previewStyle =
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
      "--store-heading-scale": typographyScale(template.theme.typography.scale).heading,
      "--store-body-scale": typographyScale(template.theme.typography.scale).body,
    } as React.CSSProperties;

  useEffect(() => {
    if (!selectedSectionId) {
      return;
    }

    const sectionElement = document.querySelector(`[data-store-section-id="${selectedSectionId}"]`);
    sectionElement?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedSectionId]);

  return (
    <div className="store-preview" style={previewStyle}>
      {enabledSections.map((section) => (
        <div data-store-section-id={section.id} key={section.id}>
          <PreviewSection isSelected={section.id === selectedSectionId} section={section} template={template} />
        </div>
      ))}
    </div>
  );
}

function PreviewSection({
  isSelected,
  section,
  template,
}: {
  isSelected: boolean;
  section: TemplateSection;
  template: StoreTemplate;
}) {
  const settings = section.settings;
  const selectedClass = isSelected ? "outline outline-2 outline-offset-[-2px] outline-[var(--store-primary)]" : "";
  const alignmentClass = sectionAlignment(settings);
  const primaryButtonClass = buttonClass(settings);

  if (section.type === "announcement") {
    return (
      <div className={`bg-[var(--store-text)] px-4 py-2.5 text-center text-xs font-semibold text-white ${selectedClass}`}>
        <span className="mx-auto block max-w-[var(--store-max-width)] tracking-wide">{String(settings.text)}</span>
      </div>
    );
  }

  if (section.type === "header") {
    return (
      <div className={`sticky top-0 z-[1] border-[var(--store-border)] border-b bg-[var(--store-surface)]/95 backdrop-blur ${selectedClass}`}>
        <div className="mx-auto flex max-w-[var(--store-max-width)] items-center justify-between gap-5 px-5 py-4 md:px-8">
          <div className="text-base font-black tracking-[0.16em] text-[var(--store-text)]">{String(settings.logo)}</div>
          <div className="hidden gap-6 text-sm font-medium text-[var(--store-muted)] md:flex">
            {(settings.links as string[]).map((link) => (
              <span key={link}>{link}</span>
            ))}
          </div>
          <button className="rounded-full border border-[var(--store-border)] px-4 py-2 text-xs font-semibold text-[var(--store-text)]">
            Cart 0
          </button>
        </div>
      </div>
    );
  }

  if (section.type === "hero") {
    return (
      <section className={sectionShell(settings, "canvas", "spacious", selectedClass)}>
        <div className="mx-auto grid max-w-[var(--store-max-width)] gap-8 px-5 py-14 md:grid-cols-[0.92fr_1.08fr] md:items-center md:px-8 md:py-20">
          <div className={alignmentClass}>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--store-primary)]">
              {String(settings.eyebrow)}
            </p>
            <h2 className="mt-4 max-w-2xl text-[calc(2.25rem*var(--store-heading-scale))] font-black leading-[1.04] text-[var(--store-text)] md:text-[calc(3.75rem*var(--store-heading-scale))]">
              {String(settings.title)}
            </h2>
            <p className="mt-5 max-w-xl text-[calc(1rem*var(--store-body-scale))] leading-7 text-[var(--store-muted)] md:text-[calc(1.125rem*var(--store-body-scale))]">{String(settings.copy)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className={primaryButtonClass}>
                {String(settings.cta)}
              </button>
              <button className="rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] px-5 py-3 text-sm font-bold text-[var(--store-text)]">
                View lookbook
              </button>
            </div>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-4 border-[var(--store-border)] border-t pt-5 text-sm">
              <div>
                <p className="font-black text-[var(--store-text)]">4.9/5</p>
                <p className="mt-1 text-xs text-[var(--store-muted)]">Customer rating</p>
              </div>
              <div>
                <p className="font-black text-[var(--store-text)]">2-day</p>
                <p className="mt-1 text-xs text-[var(--store-muted)]">Fast dispatch</p>
              </div>
              <div>
                <p className="font-black text-[var(--store-text)]">30-day</p>
                <p className="mt-1 text-xs text-[var(--store-muted)]">Easy returns</p>
              </div>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-[calc(var(--store-radius)+10px)] border border-[var(--store-border)] bg-[var(--store-surface)] p-4 shadow-2xl shadow-black/10">
            <div className="absolute inset-4 rounded-[var(--store-radius)] bg-[linear-gradient(135deg,var(--store-secondary),var(--store-accent))]" />
            <div className="absolute right-7 top-7 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-[var(--store-text)] shadow-lg">
              New drop
            </div>
            <div className="absolute bottom-7 left-7 right-7 rounded-[var(--store-radius)] bg-white/85 p-4 shadow-xl backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--store-primary)]">Featured set</p>
              <p className="mt-2 text-xl font-black text-[var(--store-text)]">Curated everyday essentials</p>
              <p className="mt-1 text-sm text-[var(--store-muted)]">Three-piece capsule bundle from $164.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "categoryStrip") {
    return (
      <section className={sectionShell(settings, "surface", "compact", selectedClass, "border-[var(--store-border)] border-y")}>
        <div className="mx-auto grid max-w-[var(--store-max-width)] gap-3 sm:grid-cols-2 md:grid-cols-4">
          {(settings.categories as string[]).map((category) => (
            <div
              className="group rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-canvas)] p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
              key={category}
            >
              <p className="text-sm font-black text-[var(--store-text)]">{category}</p>
              <p className="mt-2 text-xs text-[var(--store-muted)]">Shop collection</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "productGrid") {
    return (
      <section className={sectionShell(settings, "surface", "balanced", selectedClass)}>
        <div className="mx-auto max-w-[var(--store-max-width)]">
          <div className={`flex flex-wrap items-end justify-between gap-4 ${alignmentClass}`}>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--store-primary)]">Selected for you</p>
              <h2 className="mt-2 text-[calc(1.875rem*var(--store-heading-scale))] font-black text-[var(--store-text)]">{String(settings.title)}</h2>
            </div>
            <button className="rounded-full border border-[var(--store-border)] px-4 py-2 text-sm font-bold text-[var(--store-text)]">
              Shop all
            </button>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {template.products.map((product) => (
              <article
                className="group overflow-hidden rounded-[calc(var(--store-radius)+6px)] border border-[var(--store-border)] bg-[var(--store-surface)] shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10"
                key={product.id}
              >
                <div
                  className="relative aspect-[4/5] overflow-hidden bg-cover bg-center"
                  style={{
                    backgroundColor: "#f8fafc",
                    backgroundImage: product.image,
                    backgroundPosition: `${product.imagePositionX ?? 50}% ${product.imagePositionY ?? 50}%`,
                    backgroundSize: `${product.imageZoom ?? 100}%`,
                  }}
                >
                  {product.badge ? (
                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-[var(--store-text)] shadow">
                      {product.badge}
                    </span>
                  ) : null}
                </div>
                <div className="p-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--store-muted)]">
                      {product.category}
                    </p>
                    <h3 className="mt-2 text-base font-black text-[var(--store-text)]">{product.name}</h3>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="font-black text-[var(--store-text)]">${product.price}</p>
                    <button className="rounded-full bg-[var(--store-text)] px-3 py-2 text-xs font-bold text-white">
                      Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "collectionGrid") {
    const filters = settings.filters as string[];

    return (
      <section className={sectionShell(settings, "surface", "balanced", selectedClass)}>
        <div className="mx-auto max-w-[var(--store-max-width)]">
          <div className={`grid gap-6 border-[var(--store-border)] border-b pb-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end ${alignmentClass}`}>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--store-primary)]">{String(settings.eyebrow)}</p>
              <h2 className="mt-2 text-[calc(2rem*var(--store-heading-scale))] font-black text-[var(--store-text)] md:text-[calc(2.75rem*var(--store-heading-scale))]">
                {String(settings.title)}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--store-muted)]">
                Browse a storefront-ready collection page with filters, sorting, and product cards.
              </p>
            </div>
            <div className="rounded-full border border-[var(--store-border)] bg-[var(--store-canvas)] px-4 py-2 text-sm font-bold text-[var(--store-text)]">
              Sort: {String(settings.sortLabel)}
            </div>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="space-y-2">
              {filters.map((filter) => (
                <button
                  className="flex w-full items-center justify-between rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-canvas)] px-4 py-3 text-sm font-bold text-[var(--store-text)]"
                  key={filter}
                  type="button"
                >
                  {filter}
                  <span className="text-[var(--store-muted)]">+</span>
                </button>
              ))}
            </aside>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {template.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "productDetail") {
    const product = template.products[0];
    const variants = settings.variants as string[];
    const details = settings.details as string[];

    return (
      <section className={sectionShell(settings, "canvas", "balanced", selectedClass)}>
        <div className="mx-auto grid max-w-[var(--store-max-width)] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 sm:grid-cols-[1fr_0.34fr]">
            <div
              className="aspect-[4/5] rounded-[calc(var(--store-radius)+10px)] border border-[var(--store-border)] bg-cover bg-center shadow-xl shadow-black/10"
              style={{
                backgroundColor: "#f8fafc",
                backgroundImage: product?.image,
                backgroundPosition: `${product?.imagePositionX ?? 50}% ${product?.imagePositionY ?? 50}%`,
                backgroundSize: `${product?.imageZoom ?? 100}%`,
              }}
            />
            <div className="grid gap-3">
              {[0, 1, 2].map((index) => (
                <div
                  className="rounded-[var(--store-radius)] border border-[var(--store-border)] bg-cover bg-center"
                  key={index}
                  style={{
                    backgroundColor: "#f8fafc",
                    backgroundImage: product?.image,
                    backgroundPosition: `${product?.imagePositionX ?? 50}% ${product?.imagePositionY ?? 50}%`,
                    backgroundSize: `${product?.imageZoom ?? 100}%`,
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="inline-flex rounded-full bg-[var(--store-primary)] px-3 py-1 text-xs font-black text-white">
              {String(settings.badge)}
            </p>
            <h2 className="mt-5 text-[calc(2.15rem*var(--store-heading-scale))] font-black leading-tight text-[var(--store-text)] md:text-[calc(3rem*var(--store-heading-scale))]">
              {product?.name ?? String(settings.title)}
            </h2>
            <p className="mt-3 text-2xl font-black text-[var(--store-text)]">${product?.price ?? 0}</p>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--store-muted)]">{String(settings.subtitle)}</p>
            <div className="mt-7">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--store-muted)]">Variant</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((variant, index) => (
                  <button
                    className={`min-w-12 rounded-full border px-4 py-2 text-sm font-bold ${
                      index === 1
                        ? "border-[var(--store-text)] bg-[var(--store-text)] text-white"
                        : "border-[var(--store-border)] bg-[var(--store-surface)] text-[var(--store-text)]"
                    }`}
                    key={variant}
                    type="button"
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-7 grid grid-cols-[90px_minmax(0,1fr)] gap-3">
              <div className="rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] px-4 py-3 text-center text-sm font-black text-[var(--store-text)]">
                1
              </div>
              <button className={primaryButtonClass} type="button">
                Add to cart
              </button>
            </div>
            <div className="mt-7 space-y-3 border-[var(--store-border)] border-t pt-5">
              {details.map((detail) => (
                <p className="flex items-center gap-3 text-sm font-semibold text-[var(--store-text)]" key={detail}>
                  <span className="h-2 w-2 rounded-full bg-[var(--store-primary)]" />
                  {detail}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "cartSummary") {
    const cartProducts = template.products.slice(0, 2);
    const subtotal = cartProducts.reduce((total, product) => total + product.price, 0);
    const perks = settings.perks as string[];

    return (
      <section className={sectionShell(settings, "canvas", "balanced", selectedClass)}>
        <div className="mx-auto grid max-w-[var(--store-max-width)] gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[calc(var(--store-radius)+8px)] border border-[var(--store-border)] bg-[var(--store-surface)] p-5">
            <h2 className="text-[calc(1.85rem*var(--store-heading-scale))] font-black text-[var(--store-text)]">{String(settings.title)}</h2>
            <p className="mt-2 text-sm font-semibold text-[var(--store-primary)]">{String(settings.note)}</p>
            <div className="mt-6 space-y-4">
              {cartProducts.map((product) => (
                <div className="grid grid-cols-[88px_minmax(0,1fr)_auto] gap-4 border-[var(--store-border)] border-t pt-4" key={product.id}>
                  <div
                    className="aspect-square rounded-[var(--store-radius)] border border-[var(--store-border)] bg-cover bg-center"
                    style={{
                      backgroundColor: "#f8fafc",
                      backgroundImage: product.image,
                      backgroundPosition: `${product.imagePositionX ?? 50}% ${product.imagePositionY ?? 50}%`,
                      backgroundSize: `${product.imageZoom ?? 100}%`,
                    }}
                  />
                  <div>
                    <p className="font-black text-[var(--store-text)]">{product.name}</p>
                    <p className="mt-1 text-sm text-[var(--store-muted)]">{product.category}</p>
                    <div className="mt-3 inline-flex rounded-full border border-[var(--store-border)] px-3 py-1 text-xs font-bold text-[var(--store-text)]">
                      Qty 1
                    </div>
                  </div>
                  <p className="font-black text-[var(--store-text)]">${product.price}</p>
                </div>
              ))}
            </div>
          </div>
          <aside className="rounded-[calc(var(--store-radius)+8px)] border border-[var(--store-border)] bg-[var(--store-surface)] p-5 shadow-xl shadow-black/5">
            <p className="text-lg font-black text-[var(--store-text)]">Order summary</p>
            <div className="mt-5 space-y-3 text-sm">
              <SummaryRow label="Subtotal" value={`$${subtotal}`} />
              <SummaryRow label="Shipping" value="Calculated next" />
              <SummaryRow label="Estimated tax" value="$12" />
            </div>
            <div className="mt-5 flex justify-between border-[var(--store-border)] border-t pt-5 text-base font-black text-[var(--store-text)]">
              <span>Total</span>
              <span>${subtotal + 12}</span>
            </div>
            <button className={`${primaryButtonClass} mt-5 w-full`} type="button">
              Checkout
            </button>
            <div className="mt-5 space-y-2">
              {perks.map((perk) => (
                <p className="text-xs font-semibold text-[var(--store-muted)]" key={perk}>
                  {perk}
                </p>
              ))}
            </div>
          </aside>
        </div>
      </section>
    );
  }

  if (section.type === "checkoutSummary") {
    const steps = settings.steps as string[];
    const firstProduct = template.products[0];

    return (
      <section className={sectionShell(settings, "surface", "balanced", selectedClass)}>
        <div className="mx-auto grid max-w-[var(--store-max-width)] gap-7 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <h2 className="text-[calc(1.85rem*var(--store-heading-scale))] font-black text-[var(--store-text)]">{String(settings.title)}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {steps.map((step, index) => (
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-black ${
                    index === 0 ? "bg-[var(--store-text)] text-white" : "bg-[var(--store-canvas)] text-[var(--store-muted)]"
                  }`}
                  key={step}
                >
                  {index + 1}. {step}
                </span>
              ))}
            </div>
            <div className="mt-7 grid gap-4 rounded-[calc(var(--store-radius)+8px)] border border-[var(--store-border)] bg-[var(--store-canvas)] p-5">
              {["Email address", "Shipping address", "Delivery method", "Payment details"].map((field) => (
                <div className="rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] px-4 py-3 text-sm font-semibold text-[var(--store-muted)]" key={field}>
                  {field}
                </div>
              ))}
              <button className={primaryButtonClass} type="button">
                Continue
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--store-muted)]">{String(settings.reassurance)}</p>
          </div>
          <aside className="rounded-[calc(var(--store-radius)+8px)] border border-[var(--store-border)] bg-[var(--store-canvas)] p-5">
            <p className="text-lg font-black text-[var(--store-text)]">Order</p>
            {firstProduct ? (
              <div className="mt-5 grid grid-cols-[72px_minmax(0,1fr)_auto] gap-3">
                <div
                  className="aspect-square rounded-[var(--store-radius)] border border-[var(--store-border)] bg-cover bg-center"
                  style={{
                    backgroundColor: "#f8fafc",
                    backgroundImage: firstProduct.image,
                    backgroundPosition: `${firstProduct.imagePositionX ?? 50}% ${firstProduct.imagePositionY ?? 50}%`,
                    backgroundSize: `${firstProduct.imageZoom ?? 100}%`,
                  }}
                />
                <div>
                  <p className="text-sm font-black text-[var(--store-text)]">{firstProduct.name}</p>
                  <p className="mt-1 text-xs text-[var(--store-muted)]">Qty 1</p>
                </div>
                <p className="text-sm font-black text-[var(--store-text)]">${firstProduct.price}</p>
              </div>
            ) : null}
            <div className="mt-5 space-y-3 border-[var(--store-border)] border-t pt-5 text-sm">
              <SummaryRow label="Subtotal" value={`$${firstProduct?.price ?? 0}`} />
              <SummaryRow label="Shipping" value="$0" />
              <SummaryRow label="Tax" value="$8" />
            </div>
          </aside>
        </div>
      </section>
    );
  }

  if (section.type === "promoTiles") {
    const tiles = settings.tiles as string[];

    return (
      <section className={sectionShell(settings, "canvas", "balanced", selectedClass)}>
        <div className="mx-auto max-w-[var(--store-max-width)]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--store-primary)]">Featured edits</p>
              <h2 className="mt-2 text-[calc(1.875rem*var(--store-heading-scale))] font-black text-[var(--store-text)]">{String(settings.title)}</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {tiles.map((tile, index) => (
              <article
                className="min-h-64 overflow-hidden rounded-[calc(var(--store-radius)+8px)] border border-[var(--store-border)] bg-[var(--store-surface)] shadow-lg shadow-black/5"
                key={`${tile}-${index}`}
              >
                <div
                  className="h-36"
                  style={{
                    background:
                      index % 3 === 0
                        ? "linear-gradient(135deg, var(--store-secondary), var(--store-surface))"
                        : index % 3 === 1
                          ? "linear-gradient(135deg, var(--store-accent), var(--store-canvas))"
                          : "linear-gradient(135deg, var(--store-primary), var(--store-secondary))",
                  }}
                />
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--store-primary)]">Edit 0{index + 1}</p>
                  <h3 className="mt-2 text-xl font-black text-[var(--store-text)]">{tile}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--store-muted)]">Curated product stories for higher intent browsing.</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "reviews") {
    return (
      <section className={sectionShell(settings, "surface", "balanced", selectedClass)}>
        <div className="mx-auto max-w-[var(--store-max-width)]">
          <div className={`max-w-2xl ${alignmentClass}`}>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--store-primary)]">Customer proof</p>
            <h2 className="mt-2 text-[calc(1.875rem*var(--store-heading-scale))] font-black text-[var(--store-text)]">{String(settings.title)}</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {(settings.reviews as string[]).map((review, index) => (
              <figure className="rounded-[calc(var(--store-radius)+6px)] border border-[var(--store-border)] bg-[var(--store-canvas)] p-5" key={`${review}-${index}`}>
                <div className="text-sm font-black text-[var(--store-primary)]">★★★★★</div>
                <blockquote className="mt-4 text-base font-semibold leading-7 text-[var(--store-text)]">
                  &ldquo;{review}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-sm text-[var(--store-muted)]">Verified customer</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "trustBand") {
    return (
      <section className={sectionShell(settings, "surface", "compact", selectedClass, "border-[var(--store-border)] border-y")}>
        <div className="mx-auto grid max-w-[var(--store-max-width)] gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(settings.items as string[]).map((item, index) => (
            <div className="flex items-center gap-3 rounded-[var(--store-radius)] bg-[var(--store-canvas)] p-4" key={`${item}-${index}`}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--store-primary)] text-sm font-black text-white">
                {index + 1}
              </span>
              <p className="text-sm font-bold text-[var(--store-text)]">{item}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "faq") {
    return (
      <section className={sectionShell(settings, "canvas", "balanced", selectedClass)}>
        <div className="mx-auto grid max-w-[var(--store-max-width)] gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--store-primary)]">FAQ</p>
            <h2 className="mt-2 text-[calc(1.875rem*var(--store-heading-scale))] font-black leading-tight text-[var(--store-text)]">{String(settings.title)}</h2>
          </div>
          <div className="space-y-3">
            {(settings.questions as string[]).map((question, index) => (
              <details
                className="group rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] p-4"
                key={`${question}-${index}`}
                open={index === 0}
              >
                <summary className="cursor-pointer list-none text-sm font-black text-[var(--store-text)]">
                  {question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-[var(--store-muted)]">
                  This section can be edited to answer common customer concerns before purchase.
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "featureBand") {
    return (
      <section className={sectionShell(settings, "primary", "balanced", selectedClass)}>
        <div className="mx-auto grid max-w-[var(--store-max-width)] gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <h2 className="max-w-sm text-[calc(1.875rem*var(--store-heading-scale))] font-black leading-tight">{String(settings.title)}</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {(settings.points as string[]).map((point, index) => (
              <div className="rounded-[var(--store-radius)] bg-white/12 p-4 ring-1 ring-white/15" key={point}>
                <p className="text-sm font-black">0{index + 1}</p>
                <p className="mt-3 text-sm font-semibold leading-6 text-white/85">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "newsletter") {
    return (
      <section className={sectionShell(settings, "canvas", "balanced", selectedClass)}>
        <div className="mx-auto grid max-w-[var(--store-max-width)] gap-5 rounded-[calc(var(--store-radius)+8px)] border border-[var(--store-border)] bg-[var(--store-surface)] p-6 shadow-xl shadow-black/5 md:grid-cols-[1fr_0.9fr] md:items-center md:p-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--store-primary)]">Stay in the loop</p>
            <h2 className="mt-3 max-w-xl text-[calc(1.875rem*var(--store-heading-scale))] font-black leading-tight text-[var(--store-text)]">
              {String(settings.title)}
            </h2>
          </div>
          <div className="flex gap-2 rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-canvas)] p-2">
            <div className="flex-1 px-3 py-2 text-sm text-[var(--store-muted)]">Email address</div>
            <button className="rounded-[calc(var(--store-radius)-2px)] bg-[var(--store-text)] px-4 py-2.5 text-sm font-bold text-white">
              {String(settings.cta)}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <footer className={`bg-[var(--store-text)] px-5 py-10 text-white md:px-8 ${selectedClass}`}>
      <div className="mx-auto grid max-w-[var(--store-max-width)] gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-lg font-black">{template.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">
            A customizable storefront template built for launch-ready commerce experiences.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm font-semibold text-white/70">
          {(settings.columns as string[]).map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

function typographyScale(scale: "compact" | "balanced" | "editorial") {
  if (scale === "compact") {
    return { heading: "0.88", body: "0.95" };
  }

  if (scale === "editorial") {
    return { heading: "1.16", body: "1.04" };
  }

  return { heading: "1", body: "1" };
}

function sectionShell(
  settings: TemplateSection["settings"],
  fallbackBackground: "canvas" | "surface" | "primary" | "dark",
  fallbackSpacing: "compact" | "balanced" | "spacious",
  selectedClass: string,
  extraClass = "",
) {
  return [
    backgroundClass(styleValue(settings.background, "default") === "default" ? fallbackBackground : styleValue(settings.background, fallbackBackground)),
    spacingClass(styleValue(settings.spacing, fallbackSpacing)),
    "px-5 md:px-8",
    selectedClass,
    extraClass,
  ]
    .filter(Boolean)
    .join(" ");
}

function backgroundClass(background: string) {
  const classes: Record<string, string> = {
    canvas: "bg-[var(--store-canvas)]",
    surface: "bg-[var(--store-surface)]",
    primary: "bg-[var(--store-primary)] text-white",
    dark: "bg-[var(--store-text)] text-white",
  };

  return classes[background] ?? classes.canvas;
}

function spacingClass(spacing: string) {
  const classes: Record<string, string> = {
    compact: "py-6",
    balanced: "py-12",
    spacious: "py-20",
  };

  return classes[spacing] ?? classes.balanced;
}

function sectionAlignment(settings: TemplateSection["settings"]) {
  return styleValue(settings.alignment, "left") === "center" ? "text-center" : "text-left";
}

function buttonClass(settings: TemplateSection["settings"]) {
  const style = styleValue(settings.buttonStyle, "solid");
  const base = "rounded-[var(--store-radius)] px-5 py-3 text-sm font-black shadow-lg shadow-black/10";

  if (style === "outline") {
    return `${base} border border-[var(--store-border)] bg-[var(--store-surface)] text-[var(--store-text)]`;
  }

  if (style === "dark") {
    return `${base} bg-[var(--store-text)] text-white`;
  }

  return `${base} bg-[var(--store-primary)] text-white`;
}

function styleValue(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[calc(var(--store-radius)+6px)] border border-[var(--store-border)] bg-[var(--store-surface)] shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10">
      <div
        className="relative aspect-[4/5] overflow-hidden bg-cover bg-center"
        style={{
          backgroundColor: "#f8fafc",
          backgroundImage: product.image,
          backgroundPosition: `${product.imagePositionX ?? 50}% ${product.imagePositionY ?? 50}%`,
          backgroundSize: `${product.imageZoom ?? 100}%`,
        }}
      >
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-[var(--store-text)] shadow">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--store-muted)]">{product.category}</p>
        <h3 className="mt-2 text-base font-black text-[var(--store-text)]">{product.name}</h3>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-black text-[var(--store-text)]">${product.price}</p>
          <button className="rounded-full bg-[var(--store-text)] px-3 py-2 text-xs font-bold text-white" type="button">
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-[var(--store-muted)]">
      <span>{label}</span>
      <span className="font-bold text-[var(--store-text)]">{value}</span>
    </div>
  );
}
