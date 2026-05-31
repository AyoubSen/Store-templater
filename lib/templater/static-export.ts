import type { PageType, Product, StoreTemplate, TemplatePage } from "./schema";
import { cssFont, cssValue, escapeHtml, slugify, validateExportTemplate } from "./export-utils";
import { createZip, type ZipFile } from "./zip";

type StaticSection = StoreTemplate["pages"][number]["sections"][number];

type StaticContext = {
  activeProduct?: Product;
  pages: TemplatePage[];
  template: StoreTemplate;
};

export function createStaticStorefrontHtml(template: StoreTemplate) {
  const validatedTemplate = validateExportTemplate(template);
  const pages = customerPages(validatedTemplate);
  const homePage = pages.find((page) => page.type === "home") ?? pages[0];

  return renderStaticPage(validatedTemplate, homePage, pages);
}

export function createStaticStorefrontFiles(template: StoreTemplate): ZipFile[] {
  const validatedTemplate = validateExportTemplate(template);
  const pages = customerPages(validatedTemplate);

  return [
    { path: "assets/storefront.css", content: renderStaticCss(validatedTemplate) },
    ...pages.map((page) => ({ path: pageFileName(page), content: renderStaticPage(validatedTemplate, page, pages) })),
    { path: "template-data.json", content: JSON.stringify(validatedTemplate, null, 2) },
  ];
}

export function downloadStaticStorefront(template: StoreTemplate) {
  const blob = new Blob([createZip(createStaticStorefrontFiles(template))], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${slugify(template.name)}-static-storefront.zip`;
  link.click();
  URL.revokeObjectURL(url);
}

function renderStaticPage(template: StoreTemplate, page: TemplatePage, pages: TemplatePage[]) {
  const context: StaticContext = { activeProduct: template.products[0], pages, template };
  const sections = page.sections.filter((section) => section.enabled);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(page.seoTitle || template.name)}</title>
  <link rel="stylesheet" href="assets/storefront.css" />
</head>
<body>
${sections.map((section) => renderStaticSection(section, context)).join("\n")}
  <script type="application/json" id="store-template-data">${escapeHtml(JSON.stringify(template))}</script>
</body>
</html>`;
}

function renderStaticCss(template: StoreTemplate) {
  const theme = template.theme;

  return `:root{--canvas:${theme.colors.canvas};--surface:${theme.colors.surface};--text:${theme.colors.text};--muted:${theme.colors.muted};--primary:${theme.colors.primary};--secondary:${theme.colors.secondary};--accent:${theme.colors.accent};--border:${theme.colors.border};--radius:${theme.layout.radius}px;--max-width:${theme.layout.maxWidth}px;--heading-scale:${theme.typography.scale === "editorial" ? "1.12" : theme.typography.scale === "compact" ? "0.9" : "1"}}
*{box-sizing:border-box}body{margin:0;background:var(--canvas);color:var(--text);font-family:${cssFont(theme.typography.body)}}a{color:inherit;text-decoration:none}.wrap{max-width:var(--max-width);margin:0 auto;padding:0 28px}.section{padding:56px 0}.compact{padding:28px 0}.spacious{padding:86px 0}.surface{background:var(--surface)}.dark{background:var(--text);color:#fff}.primary{background:var(--primary);color:#fff}.announcement{padding:10px 18px;background:var(--text);color:#fff;text-align:center;font-size:13px;font-weight:700}.header{position:sticky;top:0;z-index:5;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--surface) 94%,transparent);backdrop-filter:blur(12px)}.header-inner{display:flex;align-items:center;justify-content:space-between;gap:28px;min-height:68px}.logo{font-weight:900;letter-spacing:.16em}.nav{display:flex;gap:24px;color:var(--muted);font-size:14px;font-weight:650}.pill{display:inline-flex;border:1px solid var(--border);border-radius:999px;padding:9px 15px;background:var(--surface);font-size:13px;font-weight:750}h1,h2,h3{margin:0;font-family:${cssFont(theme.typography.heading)};line-height:1.05;letter-spacing:0}h1{font-size:calc(56px * var(--heading-scale))}h2{font-size:calc(34px * var(--heading-scale))}p{margin:0}.eyebrow{color:var(--primary);text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:900}.muted{color:var(--muted)}.button{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:var(--radius);background:var(--primary);color:#fff;padding:13px 20px;font-weight:900;text-decoration:none;box-shadow:0 14px 28px rgb(15 23 42 / .12)}.button.dark{background:var(--text)}.button.outline{border:1px solid var(--border);background:var(--surface);color:var(--text)}.hero-grid{display:grid;grid-template-columns:.92fr 1.08fr;gap:48px;align-items:center}.hero-copy{margin-top:22px;max-width:620px;color:var(--muted);font-size:18px;line-height:1.7}.hero-card{position:relative;min-height:480px;overflow:hidden;border:1px solid var(--border);border-radius:calc(var(--radius) + 12px);background:var(--surface);box-shadow:0 28px 60px rgb(15 23 42 / .14)}.hero-art{position:absolute;inset:18px;border-radius:var(--radius);background:linear-gradient(135deg,var(--secondary),var(--accent))}.floating-card{position:absolute;left:34px;right:34px;bottom:34px;border-radius:var(--radius);background:rgb(255 255 255 / .86);color:var(--text);padding:22px;box-shadow:0 20px 45px rgb(15 23 42 / .16)}.grid{display:grid;gap:22px}.cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.card{border:1px solid var(--border);border-radius:calc(var(--radius) + 8px);background:var(--surface);overflow:hidden;box-shadow:0 14px 28px rgb(15 23 42 / .06)}.card-body{padding:18px}.product-image{aspect-ratio:4/5;background-color:#f8fafc;background-position:center;background-size:cover;background-repeat:no-repeat}.tile-art{height:150px;background:linear-gradient(135deg,var(--secondary),var(--accent))}.trust-item{display:flex;gap:12px;align-items:center;border-radius:var(--radius);background:var(--canvas);padding:16px;font-weight:800}.summary{border:1px solid var(--border);border-radius:calc(var(--radius) + 8px);background:var(--surface);padding:22px}.line{display:flex;justify-content:space-between;gap:18px;padding:10px 0;color:var(--muted)}.footer{padding:46px 0;background:var(--text);color:#fff}@media (max-width:760px){.wrap{padding:0 20px}.section{padding:42px 0}.nav{display:none}h1{font-size:calc(38px * var(--heading-scale))}h2{font-size:calc(28px * var(--heading-scale))}.hero-grid,.cols-2,.cols-3,.cols-4{grid-template-columns:1fr}.hero-card{min-height:320px}.floating-card{left:20px;right:20px;bottom:20px}}`;
}

function renderStaticSection(section: StaticSection, context: StaticContext) {
  const settings = section.settings;
  const { activeProduct, pages, template } = context;

  if (section.type === "announcement") {
    return `<div class="announcement">${escapeHtml(String(settings.text ?? ""))}</div>`;
  }

  if (section.type === "header") {
    const navPages = pages.filter((page) => page.type !== "checkout");
    return `<header class="header"><div class="wrap header-inner"><a class="logo" href="index.html">${escapeHtml(String(settings.logo ?? template.name))}</a><nav class="nav">${navPages.map((page) => `<a href="${pageFileName(page)}">${escapeHtml(page.name)}</a>`).join("")}</nav><a class="pill" href="${hrefForPageType(pages, "cart")}">Cart</a></div></header>`;
  }

  if (section.type === "hero") {
    return `<section class="${sectionClasses(section, "spacious")}"><div class="wrap hero-grid"><div><p class="eyebrow">${escapeHtml(String(settings.eyebrow ?? ""))}</p><h1 style="margin-top:16px">${escapeHtml(String(settings.title ?? ""))}</h1><p class="hero-copy">${escapeHtml(String(settings.copy ?? ""))}</p><div style="margin-top:30px"><a class="${buttonClasses(settings)}" href="${hrefForPageType(pages, "collection")}">${escapeHtml(String(settings.cta ?? "Shop now"))}</a></div></div><div class="hero-card"><div class="hero-art"></div><div class="floating-card"><p class="eyebrow">Featured set</p><h3 style="margin-top:10px">Curated everyday essentials</h3><p class="muted" style="margin-top:8px;line-height:1.5">Three-piece capsule bundle from $164.</p></div></div></div></section>`;
  }

  if (section.type === "categoryStrip") {
    return `<section class="${sectionClasses(section, "compact surface")}"><div class="wrap grid cols-4">${arraySetting(settings.categories).map((category) => `<a class="card card-body" href="${hrefForPageType(pages, "collection")}"><h3>${escapeHtml(category)}</h3><p class="muted" style="margin-top:8px">Shop collection</p></a>`).join("")}</div></section>`;
  }

  if (section.type === "productGrid" || section.type === "collectionGrid") {
    const count = numberSetting(settings.productCount, section.type === "collectionGrid" ? 6 : 3);
    const products = template.products.slice(0, count);
    return `<section class="${sectionClasses(section, "surface")}"><div class="wrap"><p class="eyebrow">${escapeHtml(String(settings.eyebrow ?? "Selected for you"))}</p><h2 style="margin-top:10px">${escapeHtml(String(settings.title ?? "Products"))}</h2>${settings.description ? `<p class="muted" style="max-width:620px;margin-top:14px;line-height:1.6">${escapeHtml(String(settings.description))}</p>` : ""}<div class="grid cols-3" style="margin-top:32px">${products.map((product) => renderProductCard(product, hrefForPageType(pages, "product"))).join("")}</div></div></section>`;
  }

  if (section.type === "productDetail") {
    const product = activeProduct ?? template.products[0];
    const variants = arraySetting(settings.variants);
    const details = arraySetting(settings.details);
    return `<section class="${sectionClasses(section, "")}"><div class="wrap hero-grid"><div class="product-image" style="border:1px solid var(--border);border-radius:calc(var(--radius) + 10px);background-image:${cssValue(product?.image ?? "")};background-position:${product?.imagePositionX ?? 50}% ${product?.imagePositionY ?? 50}%;background-size:${product?.imageZoom ?? 100}%"></div><div><p class="eyebrow">${escapeHtml(String(settings.badge ?? "Featured"))}</p><h1 style="margin-top:16px">${escapeHtml(product?.name ?? String(settings.title ?? "Product"))}</h1><p style="margin-top:16px;font-size:26px;font-weight:900">$${product?.price ?? 0}</p><p class="muted" style="margin-top:18px;line-height:1.7">${escapeHtml(String(settings.subtitle ?? ""))}</p><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:24px">${variants.map((variant) => `<span class="pill">${escapeHtml(variant)}</span>`).join("")}</div><div style="margin-top:28px"><a class="${buttonClasses(settings)}" href="${hrefForPageType(pages, "cart")}">Add to cart</a></div><div style="margin-top:28px">${details.map((detail) => `<p style="margin-top:10px;font-weight:700">${escapeHtml(detail)}</p>`).join("")}</div></div></div></section>`;
  }

  if (section.type === "cartSummary") {
    const products = template.products.slice(0, 2);
    const subtotal = products.reduce((total, product) => total + product.price, 0);
    return `<section class="${sectionClasses(section, "")}"><div class="wrap hero-grid"><div><h1>${escapeHtml(String(settings.title ?? "Cart"))}</h1><p class="muted" style="margin-top:10px">${escapeHtml(String(settings.note ?? ""))}</p><div style="margin-top:28px">${products.map((product) => `<article class="card" style="display:grid;grid-template-columns:88px 1fr auto;gap:16px;align-items:center;margin-top:14px;padding:14px"><div class="product-image" style="border-radius:var(--radius);background-image:${cssValue(product.image)};background-position:${product.imagePositionX ?? 50}% ${product.imagePositionY ?? 50}%;background-size:${product.imageZoom ?? 100}%"></div><div><h3>${escapeHtml(product.name)}</h3><p class="muted" style="margin-top:6px">${escapeHtml(product.category)} · Qty 1</p></div><strong>$${product.price}</strong></article>`).join("")}</div></div><aside class="summary"><h2>Order summary</h2><div style="margin-top:18px"><div class="line"><span>Subtotal</span><strong>$${subtotal}</strong></div><div class="line"><span>Estimated tax</span><strong>$12</strong></div></div><div class="line" style="border-top:1px solid var(--border);margin-top:14px;padding-top:18px;color:var(--text)"><span>Total</span><strong>$${subtotal + 12}</strong></div><a class="button" style="width:100%;margin-top:20px" href="${hrefForPageType(pages, "checkout")}">Checkout</a></aside></div></section>`;
  }

  if (section.type === "checkoutSummary") {
    const product = template.products[0];
    return `<section class="${sectionClasses(section, "surface")}"><div class="wrap hero-grid"><div><h1>${escapeHtml(String(settings.title ?? "Checkout"))}</h1><p class="muted" style="margin-top:10px">${escapeHtml(String(settings.subtitle ?? ""))}</p><div class="card card-body" style="margin-top:28px;display:grid;gap:14px"><div class="pill">Email address</div><div class="pill">Shipping address</div><div class="pill">Delivery method</div><div class="pill">Payment details</div><a class="button" href="#">Continue</a></div></div><aside class="summary"><h2>Order</h2>${product ? `<article style="display:grid;grid-template-columns:72px 1fr auto;gap:14px;align-items:center;margin-top:18px"><div class="product-image" style="border-radius:var(--radius);background-image:${cssValue(product.image)};background-position:${product.imagePositionX ?? 50}% ${product.imagePositionY ?? 50}%;background-size:${product.imageZoom ?? 100}%"></div><div><strong>${escapeHtml(product.name)}</strong><p class="muted" style="margin-top:6px">Qty 1</p></div><strong>$${product.price}</strong></article>` : ""}<div style="margin-top:18px;border-top:1px solid var(--border);padding-top:18px"><div class="line"><span>Subtotal</span><strong>$${product?.price ?? 0}</strong></div><div class="line"><span>Tax</span><strong>$8</strong></div></div></aside></div></section>`;
  }

  if (section.type === "promoTiles") {
    return `<section class="${sectionClasses(section, "")}"><div class="wrap"><h2>${escapeHtml(String(settings.title ?? "Featured edits"))}</h2><div class="grid cols-3" style="margin-top:28px">${arraySetting(settings.tiles).map((tile) => `<article class="card"><div class="tile-art"></div><div class="card-body"><p class="eyebrow">Edit</p><h3 style="margin-top:8px">${escapeHtml(tile)}</h3><p class="muted" style="margin-top:12px;line-height:1.6">Curated product stories for higher intent browsing.</p></div></article>`).join("")}</div></div></section>`;
  }

  if (section.type === "reviews") {
    return `<section class="${sectionClasses(section, "surface")}"><div class="wrap"><h2>${escapeHtml(String(settings.title ?? "Reviews"))}</h2><div class="grid cols-3" style="margin-top:28px">${arraySetting(settings.reviews).map((review) => `<figure class="card card-body" style="margin:0"><div class="eyebrow">★★★★★</div><blockquote style="margin:16px 0 0;line-height:1.6;font-weight:700">${escapeHtml(review)}</blockquote><figcaption class="muted" style="margin-top:18px">Verified customer</figcaption></figure>`).join("")}</div></div></section>`;
  }

  if (section.type === "trustBand" || section.type === "featureBand") {
    const items = arraySetting(section.type === "trustBand" ? settings.items : settings.points);
    return `<section class="${sectionClasses(section, section.type === "featureBand" ? "primary" : "surface compact")}"><div class="wrap grid cols-4">${items.map((item, index) => `<div class="trust-item"><strong>${String(index + 1).padStart(2, "0")}</strong><span>${escapeHtml(item)}</span></div>`).join("")}</div></section>`;
  }

  if (section.type === "faq") {
    return `<section class="${sectionClasses(section, "")}"><div class="wrap"><h2>${escapeHtml(String(settings.title ?? "FAQ"))}</h2><div style="margin-top:24px">${arraySetting(settings.questions).map((question, index) => `<details class="card card-body" ${index === 0 ? "open" : ""} style="margin-top:12px"><summary style="cursor:pointer;font-weight:900">${escapeHtml(question)}</summary><p class="muted" style="margin-top:12px;line-height:1.6">This answer can be customized in Store Templater.</p></details>`).join("")}</div></div></section>`;
  }

  if (section.type === "newsletter") {
    return `<section class="${sectionClasses(section, "")}"><div class="wrap"><div class="card card-body" style="display:grid;gap:18px;grid-template-columns:1fr auto;align-items:center"><h2>${escapeHtml(String(settings.title ?? "Subscribe"))}</h2><a class="button dark" href="#">${escapeHtml(String(settings.cta ?? "Subscribe"))}</a></div></div></section>`;
  }

  if (section.type === "footer") {
    return `<footer class="footer"><div class="wrap"><h3>${escapeHtml(template.name)}</h3><div style="display:flex;gap:22px;flex-wrap:wrap;margin-top:20px;color:rgb(255 255 255 / .72)">${pages.map((page) => `<a href="${pageFileName(page)}">${escapeHtml(page.name)}</a>`).join("")}</div></div></footer>`;
  }

  return "";
}

function renderProductCard(product: Product, href: string) {
  return `<article class="card"><a href="${href}"><div class="product-image" style="background-image:${cssValue(product.image)};background-position:${product.imagePositionX ?? 50}% ${product.imagePositionY ?? 50}%;background-size:${product.imageZoom ?? 100}%"></div><div class="card-body"><p class="muted" style="text-transform:uppercase;letter-spacing:.12em;font-size:12px;font-weight:800">${escapeHtml(product.category)}</p><h3 style="margin-top:10px">${escapeHtml(product.name)}</h3><p style="margin-top:14px;font-weight:900">$${product.price}</p></div></a></article>`;
}

function customerPages(template: StoreTemplate) {
  const publishedPages = template.pages.filter((page) => page.status === "published");

  return publishedPages.length > 0 ? publishedPages : template.pages;
}

function pageFileName(page: TemplatePage) {
  return page.type === "home" || page.slug === "/" ? "index.html" : `${slugify(page.slug.replace(/^\//, "") || page.name)}.html`;
}

function hrefForPageType(pages: TemplatePage[], type: PageType) {
  const page = pages.find((templatePage) => templatePage.type === type);

  return page ? pageFileName(page) : "#";
}

function sectionClasses(section: StaticSection, fallback: string) {
  const background = typeof section.settings.background === "string" && section.settings.background !== "default" ? section.settings.background : fallback;
  const spacing = typeof section.settings.spacing === "string" ? section.settings.spacing : "";

  return ["section", spacing === "compact" ? "compact" : spacing === "spacious" ? "spacious" : "", background]
    .filter(Boolean)
    .join(" ");
}

function buttonClasses(settings: StaticSection["settings"]) {
  const style = settings.buttonStyle;
  return `button${style === "dark" ? " dark" : style === "outline" ? " outline" : ""}`;
}

function arraySetting(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function numberSetting(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
