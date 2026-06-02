"use server";

import { auth } from "@clerk/nextjs/server";
import { deleteR2Object, deleteR2Prefix, hasR2Config, uploadProductImageToR2 } from "@/lib/storage/r2";

type UploadImageResult = {
  error?: string;
  imageKey?: string;
  imageUrl?: string;
  isStorageConfigured: boolean;
};

type DeleteImageResult = {
  error?: string;
  isStorageConfigured: boolean;
};

export async function uploadProductImageAction(formData: FormData): Promise<UploadImageResult> {
  if (!hasR2Config()) {
    return { error: "Image storage is not configured.", isStorageConfigured: false };
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "You must be signed in to upload images.", isStorageConfigured: true };
    }

    const file = formData.get("file");
    const templateId = formData.get("templateId");
    const productId = formData.get("productId");

    if (!(file instanceof File) || typeof templateId !== "string" || typeof productId !== "string") {
      return { error: "Upload data is invalid.", isStorageConfigured: true };
    }

    const uploadedImage = await uploadProductImageToR2({
      file,
      productId,
      templateId,
      userId,
    });

    return { imageKey: uploadedImage.key, imageUrl: uploadedImage.url, isStorageConfigured: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not upload image.",
      isStorageConfigured: true,
    };
  }
}

export async function deleteProductImageAction(imageKey: string): Promise<DeleteImageResult> {
  if (!hasR2Config()) {
    return { error: "Image storage is not configured.", isStorageConfigured: false };
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "You must be signed in to delete images.", isStorageConfigured: true };
    }

    if (!imageKey.startsWith(`users/${encodeURIComponent(userId)}/`)) {
      return { error: "This image does not belong to the current user.", isStorageConfigured: true };
    }

    await deleteR2Object(imageKey);

    return { isStorageConfigured: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not delete image.",
      isStorageConfigured: true,
    };
  }
}

export async function deleteTemplateImagesAction(templateId: string): Promise<DeleteImageResult> {
  if (!hasR2Config()) {
    return { error: "Image storage is not configured.", isStorageConfigured: false };
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "You must be signed in to delete images.", isStorageConfigured: true };
    }

    await deleteR2Prefix(`users/${encodeURIComponent(userId)}/templates/${encodeURIComponent(templateId)}/`);

    return { isStorageConfigured: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not delete template images.",
      isStorageConfigured: true,
    };
  }
}
