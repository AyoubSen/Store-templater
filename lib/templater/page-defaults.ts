import { createSection } from "./section-defaults";
import type { PageType, SectionType, TemplatePage } from "./schema";

export const pageTypeLabels: Record<PageType, string> = {
  home: "Home",
  collection: "Collection",
  product: "Product",
  cart: "Cart",
  checkout: "Checkout",
  about: "About",
  contact: "Contact",
};

export const pageTypes: PageType[] = ["home", "collection", "product", "cart", "checkout", "about", "contact"];

const sectionTypesByPage: Record<PageType, SectionType[]> = {
  home: ["announcement", "header", "hero", "categoryStrip", "productGrid", "reviews", "newsletter", "footer"],
  collection: ["announcement", "header", "collectionGrid", "promoTiles", "newsletter", "footer"],
  product: ["announcement", "header", "productDetail", "featureBand", "reviews", "faq", "footer"],
  cart: ["header", "cartSummary", "trustBand", "newsletter", "footer"],
  checkout: ["header", "checkoutSummary", "trustBand", "faq", "footer"],
  about: ["announcement", "header", "hero", "featureBand", "reviews", "footer"],
  contact: ["header", "faq", "newsletter", "footer"],
};

export function createPage(type: PageType): TemplatePage {
  return {
    id: `${type}-${Date.now()}`,
    type,
    name: pageTypeLabels[type],
    slug: type === "home" ? "/" : `/${type}`,
    seoTitle: `${pageTypeLabels[type]} page`,
    status: "published",
    sections: sectionTypesByPage[type].map((sectionType) => createSection(sectionType)),
  };
}
