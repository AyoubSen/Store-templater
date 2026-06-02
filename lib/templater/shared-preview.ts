import { eq, and } from "drizzle-orm";
import { getDb, hasDatabaseUrl } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import type { StoreTemplate } from "@/lib/templater/schema";
import { parseTemplate } from "@/lib/templater/validation";

export async function getSharedTemplate(shareId: string): Promise<StoreTemplate | null> {
  if (!hasDatabaseUrl()) {
    return null;
  }

  const db = getDb();
  const [row] = await db
    .select({
      templateJson: templates.templateJson,
    })
    .from(templates)
    .where(and(eq(templates.shareId, shareId), eq(templates.shareEnabled, true)))
    .limit(1);

  const template = row?.templateJson ? parseTemplate(row.templateJson) : null;

  if (!template) {
    return null;
  }

  return {
    ...template,
    pages: template.pages.filter((page) => page.status === "published"),
  };
}
