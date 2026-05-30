import { z } from "zod";
import { sampleTemplate } from "./sample-template";
import type { StoreTemplate } from "./schema";

export const CURRENT_TEMPLATE_SCHEMA_VERSION = 1;

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
    pages: Array.isArray(template.pages) ? template.pages : sampleTemplate.pages,
  };
}
