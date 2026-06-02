"use client";

import { useEffect } from "react";
import type { PageType, Product, StoreTemplate, TemplatePage, TemplateSection } from "@/lib/templater/schema";

export type PreviewCartItem = {
  productId: string;
  quantity: number;
};

export function StorefrontPreview({
  activeProductId,
  cartItems = [],
  onAddToCart,
  onNavigatePage,
  onOpenProduct,
  pageId,
  previewDevice,
  selectedSectionId,
  template,
}: {
  activeProductId?: string;
  cartItems?: PreviewCartItem[];
  onAddToCart?: (productId: string) => void;
  onNavigatePage?: (pageId: string) => void;
  onOpenProduct?: (productId: string) => void;
  pageId?: string;
  previewDevice?: "desktop" | "tablet" | "mobile";
  selectedSectionId?: string;
  template: StoreTemplate;
}) {
  const page = template.pages.find((templatePage) => templatePage.id === pageId) ?? template.pages[0];
  const enabledSections =
    page?.sections.filter((section) => section.enabled && isSectionVisibleForPreview(section, previewDevice)) ?? [];
  const isForcedMobile = previewDevice === "mobile";
  const isForcedTablet = previewDevice === "tablet";

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
        <div className={sectionVisibilityClass(section.settings)} data-store-section-id={section.id} key={section.id}>
          <PreviewSection
            isForcedMobile={isForcedMobile}
            isForcedTablet={isForcedTablet}
            isSelected={section.id === selectedSectionId}
            section={section}
            template={template}
            activeProductId={activeProductId}
            cartItems={cartItems}
            currentPage={page}
            onAddToCart={onAddToCart}
            onNavigatePage={onNavigatePage}
            onOpenProduct={onOpenProduct}
          />
        </div>
      ))}
    </div>
  );
}

function PreviewSection({
  activeProductId,
  cartItems,
  currentPage,
  isForcedMobile,
  isForcedTablet,
  isSelected,
  onAddToCart,
  onNavigatePage,
  onOpenProduct,
  section,
  template,
}: {
  activeProductId?: string;
  cartItems: PreviewCartItem[];
  currentPage?: TemplatePage;
  isForcedMobile: boolean;
  isForcedTablet: boolean;
  isSelected: boolean;
  onAddToCart?: (productId: string) => void;
  onNavigatePage?: (pageId: string) => void;
  onOpenProduct?: (productId: string) => void;
  section: TemplateSection;
  template: StoreTemplate;
}) {
  const settings = section.settings;
  const selectedClass = isSelected ? "outline outline-2 outline-offset-[-2px] outline-[var(--store-primary)]" : "";
  const alignmentClass = sectionAlignment(settings);
  const density = styleValue(settings.layoutDensity, "comfortable");
  const densityGapClass = densityGap(density);
  const primaryButtonClass = buttonClass(settings);
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (section.type === "announcement") {
    return (
      <div className={`bg-[var(--store-text)] px-4 py-2.5 text-center text-xs font-semibold text-white ${selectedClass}`}>
        <span className="mx-auto block max-w-[var(--store-max-width)] tracking-wide">{String(settings.text)}</span>
      </div>
    );
  }

  if (section.type === "header") {
    const navPages = customerPages(template).filter((page) => page.type !== "checkout");
    const cartPage = findPageByType(template, "cart");

    return (
      <div className={`sticky top-0 z-[1] border-[var(--store-border)] border-b bg-[var(--store-surface)]/95 backdrop-blur ${selectedClass}`}>
        <div className="mx-auto flex max-w-[var(--store-max-width)] items-center justify-between gap-5 px-5 py-4 md:px-8">
          <div className="text-base font-black tracking-[0.16em] text-[var(--store-text)]">{String(settings.logo)}</div>
          <div className={`${isForcedMobile ? "hidden" : "hidden md:flex"} gap-6 text-sm font-medium text-[var(--store-muted)]`}>
            {navPages.map((page) => (
              <button
                className={`font-medium hover:text-[var(--store-text)] ${currentPage?.id === page.id ? "text-[var(--store-text)]" : ""}`}
                key={page.id}
                onClick={() => onNavigatePage?.(page.id)}
                type="button"
              >
                {page.name}
              </button>
            ))}
          </div>
          <button
            className="rounded-full border border-[var(--store-border)] px-4 py-2 text-xs font-semibold text-[var(--store-text)]"
            onClick={() => {
              if (cartPage) {
                onNavigatePage?.(cartPage.id);
              }
            }}
            type="button"
          >
            Cart {cartQuantity}
          </button>
        </div>
      </div>
    );
  }

  if (section.type === "hero") {
    return (
      <section className={sectionShell(settings, "canvas", "spacious", selectedClass)}>
        <div
          className={`mx-auto grid max-w-[var(--store-max-width)] gap-8 py-8 ${
            isForcedMobile ? "" : `md:grid-cols-[0.92fr_1.08fr] md:items-center md:py-14 ${isForcedTablet ? "" : "xl:gap-12"}`
          }`}
        >
          <div className={`min-w-0 ${alignmentClass}`}>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--store-primary)]">
              {String(settings.eyebrow)}
            </p>
            <h2
              className={`mt-4 max-w-2xl font-black leading-[1.04] text-[var(--store-text)] ${
                isForcedMobile
                  ? "text-[calc(2.25rem*var(--store-heading-scale))]"
                  : "text-[calc(2.25rem*var(--store-heading-scale))] md:text-[calc(3.75rem*var(--store-heading-scale))]"
              }`}
            >
              {String(settings.title)}
            </h2>
            <p
              className={`mt-5 max-w-xl text-[calc(1rem*var(--store-body-scale))] leading-7 text-[var(--store-muted)] ${
                isForcedMobile ? "" : "md:text-[calc(1.125rem*var(--store-body-scale))]"
              }`}
            >
              {String(settings.copy)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className={primaryButtonClass} onClick={() => navigateToPageType(template, "collection", onNavigatePage)} type="button">
                {String(settings.cta)}
              </button>
              <button
                className="rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] px-5 py-3 text-sm font-bold text-[var(--store-text)]"
                onClick={() => navigateToPageType(template, "about", onNavigatePage)}
                type="button"
              >
                View lookbook
              </button>
            </div>
            <div className={`mt-8 grid max-w-md gap-4 border-[var(--store-border)] border-t pt-5 text-sm ${isForcedMobile ? "" : "sm:grid-cols-3"}`}>
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
          <div
            className={`relative min-h-[300px] min-w-0 overflow-hidden rounded-[calc(var(--store-radius)+10px)] border border-[var(--store-border)] bg-[var(--store-surface)] p-4 shadow-2xl shadow-black/10 ${
              isForcedMobile ? "" : `md:min-h-[420px] ${isForcedTablet ? "" : "xl:min-h-[500px]"}`
            }`}
          >
            <div className="absolute inset-4 rounded-[var(--store-radius)] bg-[linear-gradient(135deg,var(--store-secondary),var(--store-accent))]" />
            <div className="absolute right-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-[var(--store-text)] shadow-lg md:right-7 md:top-7">
              New drop
            </div>
            <div className="absolute bottom-5 left-5 right-5 min-w-0 rounded-[var(--store-radius)] bg-white/85 p-4 shadow-xl backdrop-blur md:bottom-7 md:left-7 md:right-7 xl:p-5">
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
        <div className={`mx-auto grid max-w-[var(--store-max-width)] gap-3 ${isForcedMobile ? "" : isForcedTablet ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
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
    const products = template.products.slice(0, numberSetting(settings.productCount, template.products.length));
    const columns = numberSetting(settings.columns, 3);
    const productCardStyle = styleValue(settings.productCardStyle, "elevated");
    const showQuickAdd = booleanSetting(settings.showQuickAdd, true);

    return (
      <section className={sectionShell(settings, "surface", "balanced", selectedClass)}>
        <div className="mx-auto max-w-[var(--store-max-width)]">
          <div className={`flex flex-wrap items-end justify-between gap-4 ${alignmentClass}`}>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--store-primary)]">Selected for you</p>
              <h2 className="mt-2 text-[calc(1.875rem*var(--store-heading-scale))] font-black text-[var(--store-text)]">{String(settings.title)}</h2>
            </div>
            <button
              className="rounded-full border border-[var(--store-border)] px-4 py-2 text-sm font-bold text-[var(--store-text)]"
              onClick={() => navigateToPageType(template, "collection", onNavigatePage)}
              type="button"
            >
              Shop all
            </button>
          </div>
          <div className={`mt-8 grid ${densityGapClass} ${isForcedMobile ? "" : productGridColumns(columns, isForcedTablet)}`}>
            {products.map((product) => (
              <ProductCard
                density={density}
                isForcedMobile={isForcedMobile}
                isForcedTablet={isForcedTablet}
                key={product.id}
                onAddToCart={onAddToCart}
                onOpenProduct={onOpenProduct}
                product={product}
                showQuickAdd={showQuickAdd}
                variant={productCardStyle}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "collectionGrid") {
    const filters = settings.filters as string[];
    const products = template.products.slice(0, numberSetting(settings.productCount, template.products.length));
    const statusChips = stringArraySetting(settings.statusChips, ["In stock", "Ships in 2 days"]);
    const showFilters = booleanSetting(settings.showFilters, true);
    const showSort = booleanSetting(settings.showSort, true);
    const productCardStyle = styleValue(settings.productCardStyle, "elevated");
    const showQuickAdd = booleanSetting(settings.showQuickAdd, true);

    return (
      <section className={sectionShell(settings, "surface", "balanced", selectedClass)}>
        <div className="mx-auto max-w-[var(--store-max-width)]">
          <div
            className={`grid gap-6 border-[var(--store-border)] border-b pb-7 ${
              isForcedMobile ? "" : "md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
            } ${alignmentClass}`}
          >
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--store-primary)]">{String(settings.eyebrow)}</p>
              <h2 className="mt-2 text-[calc(2rem*var(--store-heading-scale))] font-black text-[var(--store-text)] md:text-[calc(2.75rem*var(--store-heading-scale))]">
                {String(settings.title)}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--store-muted)]">
                {String(settings.description)}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-[var(--store-muted)]">
                <span className="rounded-full border border-[var(--store-border)] bg-[var(--store-canvas)] px-3 py-1">
                  {products.length} products
                </span>
                {statusChips.map((chip) => (
                  <span className="rounded-full border border-[var(--store-border)] bg-[var(--store-canvas)] px-3 py-1" key={chip}>
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            {showSort ? (
              <div className={`w-full rounded-full border border-[var(--store-border)] bg-[var(--store-canvas)] px-4 py-2 text-sm font-bold text-[var(--store-text)] ${isForcedMobile ? "" : "md:w-auto"}`}>
                Sort: {String(settings.sortLabel)}
              </div>
            ) : null}
          </div>
          <div
            className={`mt-6 grid ${densityGapClass} ${
              !isForcedMobile && showFilters
                ? isForcedTablet
                  ? "md:grid-cols-[190px_minmax(0,1fr)]"
                  : "md:grid-cols-[190px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)]"
                : ""
            }`}
          >
            {showFilters ? (
              <aside className="space-y-2">
                <div className="mb-4 flex items-center justify-between text-xs font-black uppercase tracking-[0.16em] text-[var(--store-muted)]">
                  <span>Filter</span>
                  <span>{products.length} items</span>
                </div>
                {filters.map((filter) => (
                  <button
                    className="flex w-full items-center justify-between rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-canvas)] px-4 py-3 text-sm font-bold text-[var(--store-text)] transition hover:border-[var(--store-primary)]"
                    key={filter}
                    type="button"
                  >
                    <span>{filter}</span>
                    <span className="rounded-full bg-[var(--store-surface)] px-2 py-0.5 text-[11px] text-[var(--store-muted)]">Any</span>
                  </button>
                ))}
              </aside>
            ) : null}
            <div
              className={`grid ${densityGapClass} ${
                isForcedMobile ? "" : isForcedTablet ? "sm:grid-cols-2" : `sm:grid-cols-2 ${showFilters ? "xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"}`
              }`}
            >
              {products.map((product) => (
                <ProductCard
                  density={density}
                  isForcedMobile={isForcedMobile}
                  isForcedTablet={isForcedTablet}
                  key={product.id}
                  onAddToCart={onAddToCart}
                  onOpenProduct={onOpenProduct}
                  product={product}
                  showQuickAdd={showQuickAdd}
                  variant={productCardStyle}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "productDetail") {
    const product = template.products.find((item) => item.id === activeProductId) ?? template.products[0];
    const variants = settings.variants as string[];
    const details = settings.details as string[];
    const socialProof = stringArraySetting(settings.socialProof, ["★★★★★ 4.9", "128 reviews", "Low stock"]);
    const trustItems = stringArraySetting(settings.trustItems, ["Secure checkout", "Free returns", "Ships tracked"]);
    const mediaLayout = styleValue(settings.mediaLayout, "gallery");
    const mediaEmphasis = styleValue(settings.mediaEmphasis, "balanced");

    return (
      <section className={sectionShell(settings, "canvas", "balanced", selectedClass)}>
        <div
          className={`mx-auto grid max-w-[var(--store-max-width)] gap-8 ${
            isForcedMobile ? "" : `md:items-start ${isForcedTablet ? "" : "xl:gap-12"} ${productDetailColumns(mediaEmphasis, isForcedTablet)}`
          }`}
        >
          <ProductMedia isForcedMobile={isForcedMobile} isForcedTablet={isForcedTablet} product={product} variant={mediaLayout} />
          <div className={`min-w-0 ${isForcedTablet ? "" : "lg:sticky lg:top-24"}`}>
            <p className="inline-flex rounded-full bg-[var(--store-primary)] px-3 py-1 text-xs font-black text-white">
              {String(settings.badge)}
            </p>
            <h2 className="mt-5 text-[calc(2.15rem*var(--store-heading-scale))] font-black leading-tight text-[var(--store-text)] md:text-[calc(3rem*var(--store-heading-scale))]">
              {product?.name ?? String(settings.title)}
            </h2>
            <p className="mt-3 text-2xl font-black text-[var(--store-text)]">${product?.price ?? 0}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--store-muted)]">
              {socialProof.map((proof, index) => (
                <span className={index === 0 ? "rounded-full bg-[var(--store-surface)] px-3 py-1 text-[var(--store-primary)]" : ""} key={proof}>
                  {proof}
                </span>
              ))}
            </div>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--store-muted)]">{String(settings.subtitle)}</p>
            <div className="mt-5 rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] p-4">
              <div className="flex items-center justify-between gap-4 text-xs font-black uppercase tracking-[0.14em] text-[var(--store-muted)]">
                <span>Inventory</span>
                <span>Ready to ship</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--store-canvas)]">
                <div className="h-full w-[38%] rounded-full bg-[var(--store-primary)]" />
              </div>
              <p className="mt-3 text-sm font-semibold text-[var(--store-text)]">Low stock for this preview selection.</p>
            </div>
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
            <div className={`mt-7 grid gap-3 ${isForcedMobile ? "" : "sm:grid-cols-[90px_minmax(0,1fr)]"}`}>
              <div className="rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] px-4 py-3 text-center text-sm font-black text-[var(--store-text)]">
                1
              </div>
              <button
                className={primaryButtonClass}
                onClick={() => {
                  if (product) {
                    onAddToCart?.(product.id);
                    navigateToPageType(template, "cart", onNavigatePage);
                  }
                }}
                type="button"
              >
                Add to cart
              </button>
            </div>
            <div className={`mt-7 border-[var(--store-border)] border-t pt-5 ${densityStack(density)}`}>
              {details.map((detail) => (
                <p className="flex items-center gap-3 text-sm font-semibold text-[var(--store-text)]" key={detail}>
                  <span className="h-2 w-2 rounded-full bg-[var(--store-primary)]" />
                  {detail}
                </p>
              ))}
            </div>
            <div className={`mt-6 grid gap-3 ${isForcedMobile ? "" : "sm:grid-cols-3"}`}>
              {trustItems.map((item) => (
                <div className="rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] px-3 py-3 text-center text-xs font-black text-[var(--store-text)]" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "cartSummary") {
    const cartProducts = cartItems
      .map((item) => ({ item, product: template.products.find((product) => product.id === item.productId) }))
      .filter((entry): entry is { item: PreviewCartItem; product: Product } => Boolean(entry.product));
    const subtotal = cartProducts.reduce((total, entry) => total + entry.product.price * entry.item.quantity, 0);
    const perks = settings.perks as string[];

    return (
      <section className={sectionShell(settings, "canvas", "balanced", selectedClass)}>
        <div
          className={`mx-auto grid max-w-[var(--store-max-width)] gap-6 ${
            isForcedMobile ? "" : isForcedTablet ? "md:grid-cols-[minmax(0,1fr)_320px]" : "md:grid-cols-[minmax(0,1fr)_320px] lg:grid-cols-[minmax(0,1fr)_360px]"
          }`}
        >
          <div className="min-w-0 rounded-[calc(var(--store-radius)+8px)] border border-[var(--store-border)] bg-[var(--store-surface)] p-5">
            <h2 className="text-[calc(1.85rem*var(--store-heading-scale))] font-black text-[var(--store-text)]">{String(settings.title)}</h2>
            <p className="mt-2 text-sm font-semibold text-[var(--store-primary)]">{String(settings.note)}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--store-canvas)]">
              <div className="h-full w-[72%] rounded-full bg-[var(--store-primary)]" />
            </div>
            <div className="mt-4 rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-canvas)] px-4 py-3 text-sm font-semibold text-[var(--store-muted)]">
              {String(settings.incentive)}
            </div>
            <div className={`mt-4 grid gap-3 ${isForcedMobile ? "" : "sm:grid-cols-3"}`}>
              {["Secure checkout", "Easy returns", "Tracked delivery"].map((label) => (
                <div
                  className="rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-canvas)] px-3 py-3 text-xs font-black text-[var(--store-text)]"
                  key={label}
                >
                  {label}
                </div>
              ))}
            </div>
            <div className={`mt-6 ${densityStack(density)}`}>
              {cartProducts.length > 0 ? cartProducts.map(({ item, product }) => (
                <div
                  className={`grid grid-cols-[72px_minmax(0,1fr)] gap-3 border-[var(--store-border)] border-t pt-4 ${
                    isForcedMobile ? "" : "sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:gap-4"
                  }`}
                  key={product.id}
                >
                  <div
                    className="aspect-square rounded-[var(--store-radius)] border border-[var(--store-border)] bg-cover bg-center"
                    style={{
                      backgroundColor: "#f8fafc",
                      backgroundImage: product.image,
                      backgroundPosition: `${product.imagePositionX ?? 50}% ${product.imagePositionY ?? 50}%`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: `${product.imageZoom ?? 100}%`,
                    }}
                  />
                  <div className="min-w-0">
                    <p className="font-black text-[var(--store-text)]">{product.name}</p>
                    <p className="mt-1 text-sm text-[var(--store-muted)]">{product.category}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full border border-[var(--store-border)] px-3 py-1 text-xs font-bold text-[var(--store-text)]">
                        Qty {item.quantity}
                      </span>
                      <span className="text-xs font-semibold text-[var(--store-muted)]">Ships in 2 days</span>
                    </div>
                  </div>
                  <p className={`col-start-2 font-black text-[var(--store-text)] ${isForcedMobile ? "" : "sm:col-start-auto"}`}>${product.price * item.quantity}</p>
                </div>
              )) : (
                <div className="rounded-[calc(var(--store-radius)+6px)] border border-dashed border-[var(--store-border)] bg-[var(--store-canvas)] p-5">
                  <p className="text-sm font-black text-[var(--store-text)]">The preview cart is empty.</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--store-muted)]">
                    Use product cards, Quick add, or the product page Add to cart button to test this cart state.
                  </p>
                  <button
                    className={`${primaryButtonClass} mt-4`}
                    onClick={() => navigateToPageType(template, "collection", onNavigatePage)}
                    type="button"
                  >
                    Browse products
                  </button>
                </div>
              )}
            </div>
          </div>
          <aside className={`rounded-[calc(var(--store-radius)+8px)] border border-[var(--store-border)] bg-[var(--store-surface)] p-5 shadow-xl shadow-black/5 ${isForcedMobile ? "" : "md:sticky md:top-24 md:self-start"}`}>
            <p className="text-lg font-black text-[var(--store-text)]">Order summary</p>
            <p className="mt-1 text-xs font-semibold text-[var(--store-muted)]">Taxes and discounts are estimated for preview.</p>
            <div className={`mt-5 text-sm ${densityStack(density)}`}>
              <SummaryRow label="Subtotal" value={`$${subtotal}`} />
              <SummaryRow label="Shipping" value="Calculated next" />
              <SummaryRow label="Estimated tax" value="$12" />
            </div>
            <div className="mt-5 flex justify-between border-[var(--store-border)] border-t pt-5 text-base font-black text-[var(--store-text)]">
              <span>Total</span>
              <span>${subtotal + 12}</span>
            </div>
            <button
              className={`${primaryButtonClass} mt-5 w-full ${cartProducts.length === 0 ? "cursor-not-allowed opacity-45" : ""}`}
              disabled={cartProducts.length === 0}
              onClick={() => navigateToPageType(template, "checkout", onNavigatePage)}
              type="button"
            >
              Checkout
            </button>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-black uppercase tracking-[0.12em] text-[var(--store-muted)]">
              <span className="rounded border border-[var(--store-border)] bg-[var(--store-canvas)] py-2">Visa</span>
              <span className="rounded border border-[var(--store-border)] bg-[var(--store-canvas)] py-2">Shop Pay</span>
              <span className="rounded border border-[var(--store-border)] bg-[var(--store-canvas)] py-2">SSL</span>
            </div>
            <div className={`mt-5 ${densityStack(density)}`}>
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
    const paymentMethods = stringArraySetting(settings.paymentMethods, ["Shop Pay", "Apple Pay", "Card"]);
    const checkoutProducts = cartItems
      .map((item) => ({ item, product: template.products.find((product) => product.id === item.productId) }))
      .filter((entry): entry is { item: PreviewCartItem; product: Product } => Boolean(entry.product));
    const checkoutSubtotal = checkoutProducts.reduce((total, entry) => total + entry.product.price * entry.item.quantity, 0);

    return (
      <section className={sectionShell(settings, "surface", "balanced", selectedClass)}>
        <div
          className={`mx-auto grid max-w-[var(--store-max-width)] gap-7 ${
            isForcedMobile ? "" : isForcedTablet ? "md:grid-cols-[minmax(0,1fr)_340px]" : "md:grid-cols-[minmax(0,1fr)_340px] lg:grid-cols-[minmax(0,1fr)_380px]"
          }`}
        >
          <div className="min-w-0">
            <h2 className="text-[calc(1.85rem*var(--store-heading-scale))] font-black text-[var(--store-text)]">{String(settings.title)}</h2>
            <p className="mt-2 text-sm font-semibold text-[var(--store-muted)]">{String(settings.subtitle)}</p>
            <div className={`mt-5 grid gap-2 ${isForcedMobile ? "" : "sm:grid-cols-3"}`}>
              {paymentMethods.map((method) => (
                <button className="rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] px-4 py-3 text-sm font-black text-[var(--store-text)]" key={method} type="button">
                  {method}
                </button>
              ))}
            </div>
            <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--store-muted)]">
              <span className="h-px flex-1 bg-[var(--store-border)]" />
              Or continue below
              <span className="h-px flex-1 bg-[var(--store-border)]" />
            </div>
            <div className={`mt-5 grid gap-3 ${isForcedMobile ? "" : "sm:flex sm:flex-wrap"}`}>
              {steps.map((step, index) => (
                <div className="flex items-center gap-2" key={step}>
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${
                      index === 0 ? "bg-[var(--store-text)] text-white" : "bg-[var(--store-canvas)] text-[var(--store-muted)]"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-xs font-black text-[var(--store-text)]">{step}</span>
                </div>
              ))}
            </div>
            <div className={`mt-7 grid rounded-[calc(var(--store-radius)+8px)] border border-[var(--store-border)] bg-[var(--store-canvas)] p-5 ${densityGapClass}`}>
              {["Email address", "Shipping address", "Delivery method", "Payment details"].map((field, index) => (
                <div
                  className="rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] px-4 py-3 text-sm font-semibold text-[var(--store-muted)]"
                  key={field}
                >
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--store-canvas)] text-[10px] font-black text-[var(--store-text)]">
                    {index + 1}
                  </span>
                  {field}
                </div>
              ))}
              <button className={primaryButtonClass} type="button">
                Continue
              </button>
            </div>
            <p className="mt-4 rounded-[var(--store-radius)] bg-[var(--store-surface)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--store-muted)]">{String(settings.reassurance)}</p>
          </div>
          <aside className={`rounded-[calc(var(--store-radius)+8px)] border border-[var(--store-border)] bg-[var(--store-canvas)] p-5 ${isForcedMobile ? "" : "md:sticky md:top-24 md:self-start"}`}>
            <p className="text-lg font-black text-[var(--store-text)]">Order</p>
            {checkoutProducts.length > 0 ? checkoutProducts.map(({ item, product }) => (
              <div className={`mt-5 grid grid-cols-[64px_minmax(0,1fr)] gap-3 ${isForcedMobile ? "" : "sm:grid-cols-[72px_minmax(0,1fr)_auto]"}`} key={product.id}>
                <div
                  className="aspect-square rounded-[var(--store-radius)] border border-[var(--store-border)] bg-cover bg-center"
                  style={{
                    backgroundColor: "#f8fafc",
                    backgroundImage: product.image,
                    backgroundPosition: `${product.imagePositionX ?? 50}% ${product.imagePositionY ?? 50}%`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${product.imageZoom ?? 100}%`,
                  }}
                />
                <div>
                  <p className="text-sm font-black text-[var(--store-text)]">{product.name}</p>
                  <p className="mt-1 text-xs text-[var(--store-muted)]">Qty {item.quantity}</p>
                </div>
                <p className={`col-start-2 text-sm font-black text-[var(--store-text)] ${isForcedMobile ? "" : "sm:col-start-auto"}`}>${product.price * item.quantity}</p>
              </div>
            )) : (
              <div className="mt-5 rounded-[calc(var(--store-radius)+6px)] border border-dashed border-[var(--store-border)] bg-[var(--store-surface)] p-4">
                <p className="text-sm font-black text-[var(--store-text)]">Checkout needs cart items.</p>
                <p className="mt-2 text-sm leading-6 text-[var(--store-muted)]">
                  Go to a collection or product page, add an item, then return here to preview checkout.
                </p>
                <button
                  className={`${primaryButtonClass} mt-4`}
                  onClick={() => navigateToPageType(template, "collection", onNavigatePage)}
                  type="button"
                >
                  Browse products
                </button>
              </div>
            )}
            <div className="mt-5 space-y-3 border-[var(--store-border)] border-t pt-5 text-sm">
              <SummaryRow label="Subtotal" value={`$${checkoutSubtotal}`} />
              <SummaryRow label="Shipping" value="$0" />
              <SummaryRow label="Tax" value="$8" />
            </div>
            <div className="mt-5 rounded-[var(--store-radius)] bg-[var(--store-surface)] p-4 text-xs font-semibold leading-5 text-[var(--store-muted)]">
              Delivery estimate: 2-4 business days after payment confirmation.
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
          <div className={`grid gap-5 ${isForcedMobile ? "" : isForcedTablet ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
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
          <div className={`mt-8 grid gap-5 ${isForcedMobile ? "" : isForcedTablet ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
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
        <div className={`mx-auto grid max-w-[var(--store-max-width)] gap-3 ${isForcedMobile ? "" : isForcedTablet ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
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
        <div className={`mx-auto grid max-w-[var(--store-max-width)] gap-8 ${isForcedMobile ? "" : "md:grid-cols-[0.8fr_1.2fr]"}`}>
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
        <div className={`mx-auto grid max-w-[var(--store-max-width)] gap-8 ${isForcedMobile ? "" : "md:grid-cols-[0.8fr_1.2fr] md:items-center"}`}>
          <h2 className="max-w-sm text-[calc(1.875rem*var(--store-heading-scale))] font-black leading-tight">{String(settings.title)}</h2>
          <div className={`grid gap-3 ${isForcedMobile ? "" : "sm:grid-cols-3"}`}>
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
        <div
          className={`mx-auto grid max-w-[var(--store-max-width)] gap-5 rounded-[calc(var(--store-radius)+8px)] border border-[var(--store-border)] bg-[var(--store-surface)] p-6 shadow-xl shadow-black/5 ${
            isForcedMobile ? "" : "md:grid-cols-[1fr_0.9fr] md:items-center md:p-8"
          }`}
        >
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
      <div className={`mx-auto grid max-w-[var(--store-max-width)] gap-8 ${isForcedMobile ? "" : "md:grid-cols-[1fr_auto]"}`}>
        <div>
          <p className="text-lg font-black">{template.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">
            A customizable storefront template built for launch-ready commerce experiences.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm font-semibold text-white/70">
          {customerPages(template).map((page) => (
            <button className="hover:text-white" key={page.id} onClick={() => onNavigatePage?.(page.id)} type="button">
              {page.name}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

function customerPages(template: StoreTemplate) {
  return template.pages.filter((page) => page.status === "published");
}

function findPageByType(template: StoreTemplate, type: PageType) {
  return customerPages(template).find((page) => page.type === type);
}

function navigateToPageType(template: StoreTemplate, type: PageType, onNavigatePage?: (pageId: string) => void) {
  const page = findPageByType(template, type);

  if (page) {
    onNavigatePage?.(page.id);
  }
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

function isSectionVisibleForPreview(section: TemplateSection, previewDevice?: "desktop" | "tablet" | "mobile") {
  if (!previewDevice) {
    return true;
  }

  if (previewDevice === "desktop") {
    return section.settings.visibleOnDesktop !== false;
  }

  if (previewDevice === "tablet") {
    return section.settings.visibleOnTablet !== false;
  }

  return section.settings.visibleOnMobile !== false;
}

function sectionVisibilityClass(settings: TemplateSection["settings"]) {
  const desktop = settings.visibleOnDesktop !== false;
  const tablet = settings.visibleOnTablet !== false;
  const mobile = settings.visibleOnMobile !== false;

  if (desktop && tablet && mobile) {
    return undefined;
  }

  if (!desktop && !tablet && !mobile) {
    return "hidden";
  }

  if (desktop && tablet && !mobile) {
    return "hidden md:block";
  }

  if (desktop && !tablet && !mobile) {
    return "hidden lg:block";
  }

  if (!desktop && tablet && mobile) {
    return "lg:hidden";
  }

  if (!desktop && !tablet && mobile) {
    return "md:hidden";
  }

  if (!desktop && tablet && !mobile) {
    return "hidden md:block lg:hidden";
  }

  return undefined;
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
    "px-5 md:px-8 xl:px-10",
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
    spacious: "py-20 xl:py-24",
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

function numberSetting(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function booleanSetting(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function stringArraySetting(value: unknown, fallback: string[]) {
  return Array.isArray(value) ? value.map((item) => String(item)) : fallback;
}

function productGridColumns(columns: number, isForcedTablet = false) {
  if (isForcedTablet) {
    return "sm:grid-cols-2";
  }

  if (columns >= 4) {
    return "sm:grid-cols-2 xl:grid-cols-4";
  }

  if (columns <= 2) {
    return "sm:grid-cols-2";
  }

  return "sm:grid-cols-2 lg:grid-cols-3";
}

function ProductMedia({
  isForcedMobile,
  isForcedTablet,
  product,
  variant,
}: {
  isForcedMobile: boolean;
  isForcedTablet: boolean;
  product?: Product;
  variant: string;
}) {
  if (variant === "minimal") {
    return (
      <div
        className="min-w-0 aspect-square rounded-[calc(var(--store-radius)+14px)] border border-[var(--store-border)] bg-cover bg-center shadow-2xl shadow-black/10"
        style={productImageStyle(product)}
      />
    );
  }

  if (variant === "stacked") {
    return (
      <div className="grid min-w-0 gap-4">
        {[0, 1].map((index) => (
          <div
            className="aspect-[5/4] rounded-[calc(var(--store-radius)+10px)] border border-[var(--store-border)] bg-cover bg-center shadow-xl shadow-black/10"
            key={index}
            style={productImageStyle(product)}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid min-w-0 gap-4 ${
        isForcedMobile
          ? ""
          : isForcedTablet
            ? "sm:grid-cols-[minmax(0,1fr)_0.34fr]"
            : "sm:grid-cols-[minmax(0,1fr)_0.34fr] lg:grid-cols-[minmax(0,1fr)_0.26fr] xl:gap-5"
      }`}
    >
      <div
        className="aspect-[4/5] rounded-[calc(var(--store-radius)+10px)] border border-[var(--store-border)] bg-cover bg-center shadow-xl shadow-black/10"
        style={productImageStyle(product)}
      />
      <div className="grid gap-3">
        {[0, 1, 2].map((index) => (
          <div
            className="aspect-square rounded-[var(--store-radius)] border border-[var(--store-border)] bg-cover bg-center"
            key={index}
            style={productImageStyle(product)}
          />
        ))}
      </div>
    </div>
  );
}

function productImageStyle(product?: Product) {
  return {
    backgroundColor: "#f8fafc",
    backgroundImage: product?.image,
    backgroundPosition: `${product?.imagePositionX ?? 50}% ${product?.imagePositionY ?? 50}%`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${product?.imageZoom ?? 100}%`,
  };
}

function ProductCard({
  density,
  isForcedMobile,
  isForcedTablet,
  onAddToCart,
  onOpenProduct,
  product,
  showQuickAdd,
  variant,
}: {
  density: string;
  isForcedMobile: boolean;
  isForcedTablet: boolean;
  onAddToCart?: (productId: string) => void;
  onOpenProduct?: (productId: string) => void;
  product: Product;
  showQuickAdd: boolean;
  variant: string;
}) {
  const isMinimal = variant === "minimal";
  const isEditorial = variant === "editorial";

  return (
    <article
      className={`group overflow-hidden rounded-[calc(var(--store-radius)+6px)] bg-[var(--store-surface)] transition hover:-translate-y-1 ${
        isMinimal
          ? "border border-transparent"
          : isEditorial
            ? "border border-[var(--store-border)] shadow-xl shadow-black/5"
            : "border border-[var(--store-border)] shadow-sm hover:shadow-xl hover:shadow-black/10"
      }`}
    >
      <div
        aria-label={`Open ${product.name}`}
        className={`relative overflow-hidden bg-cover bg-center ${isEditorial ? "aspect-[3/4]" : "aspect-[4/5]"}`}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpenProduct?.(product.id);
          }
        }}
        onClick={() => onOpenProduct?.(product.id)}
        role="button"
        style={{
          backgroundColor: "#f8fafc",
          backgroundImage: product.image,
          backgroundPosition: `${product.imagePositionX ?? 50}% ${product.imagePositionY ?? 50}%`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${product.imageZoom ?? 100}%`,
        }}
        tabIndex={0}
      >
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-xs font-black text-[var(--store-text)] shadow">
            {product.badge}
          </span>
        ) : null}
        {showQuickAdd ? (
          <button
            className={`absolute bottom-3 left-3 right-3 rounded-full bg-white/94 px-4 py-2 text-xs font-black text-[var(--store-text)] opacity-100 shadow-lg transition ${
              isForcedMobile || isForcedTablet ? "" : "lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
            }`}
            onClick={(event) => {
              event.stopPropagation();
              onAddToCart?.(product.id);
            }}
            type="button"
          >
            Quick add
          </button>
        ) : null}
      </div>
      <div className={isMinimal ? "px-1 py-3" : productCardPadding(density)}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--store-muted)]">{product.category}</p>
          <p className="text-xs font-black text-[var(--store-primary)]">4.8</p>
        </div>
        <button className="mt-2 block text-left" onClick={() => onOpenProduct?.(product.id)} type="button">
          <h3 className={`${isEditorial ? "text-lg" : "text-base"} font-black text-[var(--store-text)]`}>{product.name}</h3>
        </button>
        <div className="mt-3 flex items-center gap-1.5">
          {[product.imagePositionX ?? 42, product.imagePositionY ?? 58, product.imageZoom ?? 100].map((value, index) => (
            <span
              className="h-4 w-4 rounded-full border border-black/10"
              key={`${product.id}-swatch-${index}`}
              style={{
                background:
                  index === 0
                    ? "var(--store-primary)"
                    : index === 1
                      ? "var(--store-secondary)"
                      : "var(--store-accent)",
                opacity: Math.max(0.45, Math.min(1, Number(value) / 100)),
              }}
            />
          ))}
          <span className="ml-1 text-xs font-semibold text-[var(--store-muted)]">In stock</span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-black text-[var(--store-text)]">${product.price}</p>
          {showQuickAdd ? (
            <button
              className="rounded-full bg-[var(--store-text)] px-3 py-2 text-xs font-bold text-white"
              onClick={() => onAddToCart?.(product.id)}
              type="button"
            >
              Add
            </button>
          ) : null}
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

function densityGap(density: string) {
  if (density === "compact") {
    return "gap-3";
  }

  if (density === "spacious") {
    return "gap-7";
  }

  return "gap-5";
}

function densityStack(density: string) {
  if (density === "compact") {
    return "space-y-2";
  }

  if (density === "spacious") {
    return "space-y-5";
  }

  return "space-y-3";
}

function productCardPadding(density: string) {
  if (density === "compact") {
    return "p-3";
  }

  if (density === "spacious") {
    return "p-5";
  }

  return "p-4";
}

function productDetailColumns(mediaEmphasis: string, isForcedTablet = false) {
  if (mediaEmphasis === "media") {
    return isForcedTablet
      ? "md:grid-cols-[minmax(0,1.18fr)_0.82fr]"
      : "md:grid-cols-[minmax(0,1.18fr)_0.82fr] lg:grid-cols-[1.28fr_0.72fr]";
  }

  if (mediaEmphasis === "info") {
    return isForcedTablet
      ? "md:grid-cols-[minmax(0,0.88fr)_1.12fr]"
      : "md:grid-cols-[minmax(0,0.88fr)_1.12fr] lg:grid-cols-[0.9fr_1.1fr]";
  }

  return isForcedTablet
    ? "md:grid-cols-[minmax(0,1fr)_0.92fr]"
    : "md:grid-cols-[minmax(0,1fr)_0.92fr] lg:grid-cols-[1.05fr_0.95fr]";
}
