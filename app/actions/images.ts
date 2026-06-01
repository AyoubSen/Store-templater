"use server";

import { auth } from "@clerk/nextjs/server";
import { hasR2Config, uploadProductImageToR2 } from "@/lib/storage/r2";

type UploadImageResult = {
  error?: string;
  imageUrl?: string;
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

    const imageUrl = await uploadProductImageToR2({
      file,
      productId,
      templateId,
      userId,
    });

    return { imageUrl, isStorageConfigured: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not upload image.",
      isStorageConfigured: true,
    };
  }
}
