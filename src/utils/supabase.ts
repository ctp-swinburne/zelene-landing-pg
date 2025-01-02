// utils/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.NEXT_PRIVATE_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SUPABASE_PRIVATE_KEY!,
);

type MimeTypeMap = Record<string, string>;

const mimeTypeToFolder: MimeTypeMap = {
  "image/jpeg": "images",
  "image/png": "images",
  "image/gif": "images",
  "image/webp": "images",
  "application/pdf": "pdfs",
  "text/plain": "texts",
  "text/csv": "texts",
  "application/json": "applications",
  "application/xml": "applications",
  "application/msword": "documents",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "documents",
} as const;

export const getFolderFromMime = (mimeType: string): string => {
  return mimeTypeToFolder[mimeType] ?? "others";
};

export const uploadToSupabase = async ({
  buffer,
  filename,
  contentType,
}: {
  buffer: Buffer;
  filename: string;
  contentType: string;
}) => {
  const folder = getFolderFromMime(contentType);
  const ext = filename.split(".").pop() ?? "unknown";
  const path = `${folder}/${uuidv4()}.${ext}`;

  const { error } = await supabase.storage
    .from(process.env.NEXT_PRIVATE_SUPABASE_BUCKET!)
    .upload(path, buffer, { contentType });

  if (error) throw error;
  return path;
};

export const getPublicUrl = async (
  path: string,
  expiresIn: number = 60 * 60, // Default 1 hour in seconds
): Promise<string> => {
  const { data } = await supabase.storage
    .from(process.env.NEXT_PRIVATE_SUPABASE_BUCKET!)
    .createSignedUrl(path, expiresIn);

  if (!data?.signedUrl) {
    throw new Error("Failed to generate signed URL");
  }

  return data.signedUrl;
};
