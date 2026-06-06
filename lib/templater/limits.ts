export const betaLimits = {
  maxProductsPerTemplate: 30,
  maxPublishedTemplates: 3,
  maxTemplatesPerUser: 5,
} as const;

export function templateLimitMessage() {
  return `Private beta limit reached: you can keep up to ${betaLimits.maxTemplatesPerUser} templates for now.`;
}

export function productLimitMessage() {
  return `Private beta limit reached: each template can have up to ${betaLimits.maxProductsPerTemplate} products for now.`;
}

export function publishedTemplateLimitMessage() {
  return `Private beta limit reached: you can publish up to ${betaLimits.maxPublishedTemplates} templates for now.`;
}
