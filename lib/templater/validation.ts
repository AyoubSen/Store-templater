import { z } from "zod";
import { sampleTemplate } from "./sample-template";
import type { StoreTemplate } from "./schema";

export const CURRENT_TEMPLATE_SCHEMA_VERSION = 10;

const storeCategorySchema = z.enum(["fashion", "beauty", "electronics", "home", "food", "digital"]);
const pageTypeSchema = z.enum(["home", "collection", "product", "cart", "checkout", "about", "contact"]);
const sectionTypeSchema = z.enum([
  "announcement",
  "header",
  "hero",
  "categoryStrip",
  "collectionGrid",
  "productDetail",
  "cartSummary",
  "checkoutSummary",
  "productGrid",
  "promoTiles",
  "reviews",
  "trustBand",
  "faq",
  "featureBand",
  "newsletter",
  "footer",
]);

const themeSchema = z.object({
  colors: z.object({
    canvas: z.string(),
    surface: z.string(),
    text: z.string(),
    muted: z.string(),
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    border: z.string(),
  }),
  typography: z.object({
    heading: z.string(),
    body: z.string(),
    scale: z.enum(["compact", "balanced", "editorial"]),
  }),
  layout: z.object({
    radius: z.number(),
    spacing: z.number(),
    maxWidth: z.number(),
    density: z.enum(["compact", "comfortable", "spacious"]),
  }),
});

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  price: z.number(),
  image: z.string(),
  imagePositionX: z.number().optional(),
  imagePositionY: z.number().optional(),
  imageZoom: z.number().optional(),
  imageStorage: z.enum(["r2"]).optional(),
  imageKey: z.string().optional(),
  badge: z.string().optional(),
});

const sectionSchema = z.object({
  id: z.string(),
  type: sectionTypeSchema,
  name: z.string(),
  enabled: z.boolean(),
  settings: z.record(z.string(), z.unknown()),
});

const pageSchema = z.object({
  id: z.string(),
  type: pageTypeSchema,
  name: z.string(),
  slug: z.string(),
  seoTitle: z.string(),
  status: z.enum(["draft", "published"]),
  sections: z.array(sectionSchema),
});

const templateSchema = z.object({
  schemaVersion: z.number().optional(),
  id: z.string(),
  name: z.string(),
  category: storeCategorySchema,
  theme: themeSchema,
  products: z.array(productSchema),
  pages: z.array(pageSchema),
});

export function parseTemplate(value: unknown): StoreTemplate | null {
  const migratedTemplate = migrateTemplate(value);
  const result = templateSchema.safeParse(migratedTemplate);

  return result.success ? result.data : null;
}

export function parseTemplates(value: unknown): StoreTemplate[] {
  if (!Array.isArray(value)) {
    return [versionTemplate(sampleTemplate)];
  }

  const templates = value.map((template) => parseTemplate(template)).filter((template): template is StoreTemplate => Boolean(template));

  return templates.length ? templates : [versionTemplate(sampleTemplate)];
}

export function versionTemplate(template: StoreTemplate): StoreTemplate {
  return {
    ...template,
    schemaVersion: CURRENT_TEMPLATE_SCHEMA_VERSION,
  };
}

function migrateTemplate(value: unknown): unknown {
  if (!value || typeof value !== "object") {
    return value;
  }

  const template = value as Partial<StoreTemplate>;
  const fallbackTheme = sampleTemplate.theme;

  return {
    ...template,
    schemaVersion: CURRENT_TEMPLATE_SCHEMA_VERSION,
    category: template.category ?? sampleTemplate.category,
    theme: {
      colors: {
        ...fallbackTheme.colors,
        ...template.theme?.colors,
      },
      typography: {
        ...fallbackTheme.typography,
        ...template.theme?.typography,
      },
      layout: {
        ...fallbackTheme.layout,
        ...template.theme?.layout,
      },
    },
    products: Array.isArray(template.products)
      ? template.products.map((product) => ({
          ...product,
          imagePositionX: product.imagePositionX ?? 50,
          imagePositionY: product.imagePositionY ?? 50,
          imageZoom: product.imageZoom ?? 100,
        }))
      : sampleTemplate.products,
    pages: Array.isArray(template.pages)
      ? template.pages.map((page) => ({
          ...page,
          slug: page.slug ?? fallbackPageSlug(page.type),
          seoTitle: page.seoTitle ?? `${page.name ?? "Store"} page`,
          status: page.status ?? "published",
          sections: Array.isArray(page.sections)
            ? page.sections.map((section) => ({
                ...section,
                settings: migrateSectionSettings(section.type, section.settings),
              }))
            : [],
        }))
      : sampleTemplate.pages,
  };
}

function fallbackPageSlug(type: unknown) {
  return type === "home" ? "/" : `/${typeof type === "string" ? type : "page"}`;
}

function migrateSectionSettings(type: unknown, settings: unknown) {
  const currentSettings = {
    visibleOnDesktop: true,
    visibleOnTablet: true,
    visibleOnMobile: true,
    layoutDensity: "comfortable",
    ...(settings && typeof settings === "object" ? settings : {}),
  };

  if (type === "header") {
    return {
      labelHome: "Home",
      labelCollection: "Shop",
      labelAbout: "About",
      labelContact: "Contact",
      labelCart: "Cart",
      showHomeLink: true,
      showCollectionLink: true,
      showAboutLink: true,
      showContactLink: true,
      showCartLink: true,
      ...currentSettings,
      navItems: migrateHeaderNavItems(currentSettings),
    };
  }

  if (type === "productGrid") {
    return {
      productCount: 3,
      productCardStyle: "elevated",
      showQuickAdd: true,
      ...currentSettings,
    };
  }

  if (type === "collectionGrid") {
    return {
      description: "Browse a storefront-ready collection page with filters, sorting, and product cards.",
      statusChips: ["In stock", "Ships in 2 days"],
      productCount: 6,
      productCardStyle: "elevated",
      showQuickAdd: true,
      showFilters: true,
      showSort: true,
      ...currentSettings,
    };
  }

  if (type === "productDetail") {
    return {
      mediaLayout: "gallery",
      mediaEmphasis: "balanced",
      socialProof: ["★★★★★ 4.9", "128 reviews", "Low stock"],
      trustItems: ["Secure checkout", "Free returns", "Ships tracked"],
      ...currentSettings,
    };
  }

  if (type === "cartSummary") {
    return {
      incentive: "Add one more item to unlock free express shipping and a launch gift.",
      ...currentSettings,
    };
  }

  if (type === "checkoutSummary") {
    return {
      subtitle: "Preview a conversion-focused checkout flow.",
      paymentMethods: ["Shop Pay", "Apple Pay", "Card"],
      ...currentSettings,
    };
  }

  return currentSettings;
}

function migrateHeaderNavItems(settings: Record<string, unknown>) {
  if (Array.isArray(settings.navItems)) {
    const navItems = settings.navItems
      .map((item, index) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const navItem = item as Record<string, unknown>;
        const targetType = navItem.targetType === "url" ? "url" : "page";
        const pageType = typeof navItem.pageType === "string" ? navItem.pageType : "home";
        const url = typeof navItem.url === "string" ? navItem.url : "";
        const label = typeof navItem.label === "string" && navItem.label.trim() ? navItem.label : targetType === "url" ? "Link" : pageType;

        return {
          id: typeof navItem.id === "string" && navItem.id ? navItem.id : `nav-${index}`,
          label,
          pageType,
          targetType,
          url,
        };
      })
      .filter(Boolean);

    if (navItems.length > 0) {
      return navItems;
    }
  }

  return [
    settings.showHomeLink === false ? null : { id: "nav-home", label: textSetting(settings.labelHome, "Home"), targetType: "page", pageType: "home" },
    settings.showCollectionLink === false ? null : { id: "nav-shop", label: textSetting(settings.labelCollection, "Shop"), targetType: "page", pageType: "collection" },
    settings.showAboutLink === false ? null : { id: "nav-about", label: textSetting(settings.labelAbout, "About"), targetType: "page", pageType: "about" },
    settings.showContactLink === false ? null : { id: "nav-contact", label: textSetting(settings.labelContact, "Contact"), targetType: "page", pageType: "contact" },
  ].filter(Boolean);
}

function textSetting(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}
