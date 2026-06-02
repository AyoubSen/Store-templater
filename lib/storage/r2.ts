import { DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function hasR2Config() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME &&
      process.env.R2_PUBLIC_URL,
  );
}

function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    throw new Error("R2 image storage is not configured.");
  }

  return {
    accessKeyId,
    bucketName,
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    publicUrl: publicUrl.replace(/\/$/, ""),
    secretAccessKey,
  };
}

function getR2Client() {
  const config = getR2Config();

  return new S3Client({
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    endpoint: config.endpoint,
    region: "auto",
  });
}

export async function uploadProductImageToR2({
  file,
  productId,
  templateId,
  userId,
}: {
  file: File;
  productId: string;
  templateId: string;
  userId: string;
}) {
  const config = getR2Config();

  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Choose a PNG, JPG, or WebP image.");
  }

  if (file.size > 5_000_000) {
    throw new Error("Use an image under 5 MB.");
  }

  const extension = extensionForImageType(file.type);
  const key = `users/${encodeURIComponent(userId)}/templates/${encodeURIComponent(templateId)}/products/${encodeURIComponent(
    productId,
  )}/${Date.now()}.${extension}`;
  const body = Buffer.from(await file.arrayBuffer());
  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Body: body,
      Bucket: config.bucketName,
      CacheControl: "public, max-age=31536000, immutable",
      ContentType: file.type,
      Key: key,
    }),
  );

  return {
    key,
    url: `${config.publicUrl}/${key}`,
  };
}

export async function deleteR2Object(key: string) {
  const config = getR2Config();
  const client = getR2Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    }),
  );
}

export async function deleteR2Prefix(prefix: string) {
  const config = getR2Config();
  const client = getR2Client();
  let continuationToken: string | undefined;

  do {
    const listedObjects = await client.send(
      new ListObjectsV2Command({
        Bucket: config.bucketName,
        ContinuationToken: continuationToken,
        Prefix: prefix,
      }),
    );
    const objects = listedObjects.Contents?.map((object) => ({ Key: object.Key })).filter((object): object is { Key: string } => Boolean(object.Key));

    if (objects?.length) {
      await client.send(
        new DeleteObjectsCommand({
          Bucket: config.bucketName,
          Delete: {
            Objects: objects,
          },
        }),
      );
    }

    continuationToken = listedObjects.NextContinuationToken;
  } while (continuationToken);
}

function extensionForImageType(type: string) {
  if (type === "image/png") {
    return "png";
  }

  if (type === "image/webp") {
    return "webp";
  }

  return "jpg";
}
