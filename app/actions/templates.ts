"use server";

import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { getDb, hasDatabaseUrl } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import { betaLimits, productLimitMessage, publishedTemplateLimitMessage, templateLimitMessage } from "@/lib/templater/limits";
import type { StoreTemplate } from "@/lib/templater/schema";
import { parseTemplate, versionTemplate } from "@/lib/templater/validation";

type TemplateActionResult<T> = {
  data?: T;
  error?: string;
  isDatabaseConfigured: boolean;
};

export type TemplateShareState = {
  shareEnabled: boolean;
  shareId: string | null;
  sharedAt: string | null;
  updatedAt: string | null;
};

async function getUserId() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in.");
  }

  return userId;
}

function createShareId() {
  return randomUUID().replaceAll("-", "").slice(0, 18);
}

export async function listAccountTemplatesAction(): Promise<TemplateActionResult<StoreTemplate[]>> {
  if (!hasDatabaseUrl()) {
    return { data: [], isDatabaseConfigured: false };
  }

  try {
    const userId = await getUserId();
    const db = getDb();
    const rows = await db
      .select()
      .from(templates)
      .where(eq(templates.userId, userId))
      .orderBy(templates.updatedAt);

    return {
      data: rows.map((row) => row.templateJson),
      isDatabaseConfigured: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not load templates.",
      isDatabaseConfigured: true,
    };
  }
}

export async function getAccountTemplateAction(templateId: string): Promise<TemplateActionResult<StoreTemplate | null>> {
  if (!hasDatabaseUrl()) {
    return { data: null, isDatabaseConfigured: false };
  }

  try {
    const userId = await getUserId();
    const db = getDb();
    const [row] = await db
      .select()
      .from(templates)
      .where(and(eq(templates.id, templateId), eq(templates.userId, userId)))
      .limit(1);

    return {
      data: row?.templateJson ?? null,
      isDatabaseConfigured: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not load the template.",
      isDatabaseConfigured: true,
    };
  }
}

export async function saveAccountTemplateAction(template: StoreTemplate): Promise<TemplateActionResult<StoreTemplate>> {
  if (!hasDatabaseUrl()) {
    return { data: versionTemplate(template), isDatabaseConfigured: false };
  }

  try {
    const userId = await getUserId();
    const parsedTemplate = parseTemplate(template);

    if (!parsedTemplate) {
      return { error: "Template data is invalid.", isDatabaseConfigured: true };
    }

    if (parsedTemplate.products.length > betaLimits.maxProductsPerTemplate) {
      return { error: productLimitMessage(), isDatabaseConfigured: true };
    }

    const versionedTemplate = versionTemplate(parsedTemplate);
    const db = getDb();
    const now = new Date();
    const existingRows = await db
      .select({ id: templates.id })
      .from(templates)
      .where(eq(templates.userId, userId));
    const isExistingTemplate = existingRows.some((row) => row.id === versionedTemplate.id);

    if (!isExistingTemplate && existingRows.length >= betaLimits.maxTemplatesPerUser) {
      return { error: templateLimitMessage(), isDatabaseConfigured: true };
    }

    await db
      .insert(templates)
      .values({
        id: versionedTemplate.id,
        userId,
        name: versionedTemplate.name,
        category: versionedTemplate.category,
        templateJson: versionedTemplate,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [templates.id, templates.userId],
        set: {
          name: versionedTemplate.name,
          category: versionedTemplate.category,
          templateJson: versionedTemplate,
          updatedAt: now,
        },
      });

    return { data: versionedTemplate, isDatabaseConfigured: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not save the template.",
      isDatabaseConfigured: true,
    };
  }
}

export async function deleteAccountTemplateAction(templateId: string): Promise<TemplateActionResult<{ templateId: string }>> {
  if (!hasDatabaseUrl()) {
    return { data: { templateId }, isDatabaseConfigured: false };
  }

  try {
    const userId = await getUserId();
    const db = getDb();

    await db.delete(templates).where(and(eq(templates.id, templateId), eq(templates.userId, userId)));

    return { data: { templateId }, isDatabaseConfigured: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not delete the template.",
      isDatabaseConfigured: true,
    };
  }
}

export async function getTemplateShareStateAction(templateId: string): Promise<TemplateActionResult<TemplateShareState>> {
  if (!hasDatabaseUrl()) {
    return {
      data: { shareEnabled: false, shareId: null, sharedAt: null, updatedAt: null },
      isDatabaseConfigured: false,
    };
  }

  try {
    const userId = await getUserId();
    const db = getDb();
    const [row] = await db
      .select({
        shareEnabled: templates.shareEnabled,
        shareId: templates.shareId,
        sharedAt: templates.sharedAt,
        updatedAt: templates.updatedAt,
      })
      .from(templates)
      .where(and(eq(templates.id, templateId), eq(templates.userId, userId)))
      .limit(1);

    return {
      data: {
        shareEnabled: row?.shareEnabled ?? false,
        shareId: row?.shareId ?? null,
        sharedAt: row?.sharedAt?.toISOString() ?? null,
        updatedAt: row?.updatedAt?.toISOString() ?? null,
      },
      isDatabaseConfigured: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not load sharing state.",
      isDatabaseConfigured: true,
    };
  }
}

export async function setTemplateShareEnabledAction(
  templateId: string,
  shareEnabled: boolean,
): Promise<TemplateActionResult<TemplateShareState>> {
  if (!hasDatabaseUrl()) {
    return {
      data: { shareEnabled: false, shareId: null, sharedAt: null, updatedAt: null },
      isDatabaseConfigured: false,
    };
  }

  try {
    const userId = await getUserId();
    const db = getDb();
    const [row] = await db
      .select({
        shareId: templates.shareId,
        updatedAt: templates.updatedAt,
      })
      .from(templates)
      .where(and(eq(templates.id, templateId), eq(templates.userId, userId)))
      .limit(1);

    if (!row) {
      return { error: "Save this template before sharing it.", isDatabaseConfigured: true };
    }

    if (shareEnabled) {
      const publishedRows = await db
        .select({ id: templates.id })
        .from(templates)
        .where(and(eq(templates.userId, userId), eq(templates.shareEnabled, true)));
      const isAlreadyPublished = publishedRows.some((publishedRow) => publishedRow.id === templateId);

      if (!isAlreadyPublished && publishedRows.length >= betaLimits.maxPublishedTemplates) {
        return { error: publishedTemplateLimitMessage(), isDatabaseConfigured: true };
      }
    }

    const shareId = row.shareId ?? createShareId();
    const now = new Date();

    await db
      .update(templates)
      .set({
        shareEnabled,
        shareId,
        sharedAt: shareEnabled ? now : null,
        updatedAt: now,
      })
      .where(and(eq(templates.id, templateId), eq(templates.userId, userId)));

    return {
      data: {
        shareEnabled,
        shareId,
        sharedAt: shareEnabled ? now.toISOString() : null,
        updatedAt: now.toISOString(),
      },
      isDatabaseConfigured: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not update sharing.",
      isDatabaseConfigured: true,
    };
  }
}
