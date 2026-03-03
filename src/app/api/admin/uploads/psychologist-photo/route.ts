import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { randomUUID } from "crypto";
import { UTApi } from "uploadthing/server";
import { authOptions } from "@/lib/auth";
import { requireRateLimit } from "@/lib/rate-limit";
import { getUploadthingToken } from "@/lib/uploadthing-token";

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

type UploadSuccess = {
  provider: "uploadthing" | "supabase" | "inline";
  url: string;
  key: string;
};

const trimTrailingSlashes = (value: string) => value.replace(/\/+$/, "");

const getSupabaseStorageConfig = () => {
  const rawUrl =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket =
    process.env.SUPABASE_STORAGE_BUCKET?.trim() || "psychologist-photos";

  if (!rawUrl || !serviceRoleKey) return null;

  return {
    url: trimTrailingSlashes(rawUrl),
    serviceRoleKey,
    bucket,
  };
};

const buildObjectKey = (originalName: string) => {
  const ext =
    originalName
      .split(".")
      .pop()
      ?.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "jpg";

  return `psychologists/${Date.now()}-${randomUUID()}.${ext}`;
};

const ensurePublicBucket = async (config: {
  url: string;
  serviceRoleKey: string;
  bucket: string;
}) => {
  const response = await fetch(`${config.url}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: config.bucket,
      public: true,
    }),
    cache: "no-store",
  });

  // 409 means bucket already exists.
  if (response.ok || response.status === 409) return;

  const payload = (await response.json().catch(() => null)) as
    | { message?: string; error?: string }
    | null;
  throw new Error(
    payload?.message || payload?.error || "Failed to create storage bucket"
  );
};

const tryUploadWithUploadThing = async (
  file: File
): Promise<UploadSuccess | null> => {
  const token = getUploadthingToken();
  if (!token) return null;

  const utapi = new UTApi({ token });
  const result = await utapi.uploadFiles(file, {
    contentDisposition: "inline",
  });
  const upload = Array.isArray(result) ? result[0] : result;

  if (upload?.error || !upload?.data) {
    throw new Error(upload?.error?.message || "UploadThing upload failed");
  }

  const url = upload.data.ufsUrl || upload.data.url || upload.data.appUrl;
  if (!url) {
    throw new Error("UploadThing returned file without URL");
  }

  return {
    provider: "uploadthing",
    url,
    key: upload.data.key,
  };
};

const tryUploadWithSupabase = async (
  file: File
): Promise<UploadSuccess | null> => {
  const storageConfig = getSupabaseStorageConfig();
  if (!storageConfig) return null;

  await ensurePublicBucket(storageConfig);

  const objectKey = buildObjectKey(file.name);
  const uploadUrl = `${storageConfig.url}/storage/v1/object/${storageConfig.bucket}/${objectKey}`;

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      apikey: storageConfig.serviceRoleKey,
      Authorization: `Bearer ${storageConfig.serviceRoleKey}`,
      "Content-Type": file.type,
      "x-upsert": "false",
    },
    body: file,
    cache: "no-store",
  });

  if (!uploadResponse.ok) {
    const payload = (await uploadResponse.json().catch(() => null)) as
      | { message?: string; error?: string }
      | null;
    throw new Error(payload?.message || payload?.error || "Supabase upload failed");
  }

  return {
    provider: "supabase",
    url: `${storageConfig.url}/storage/v1/object/public/${storageConfig.bucket}/${objectKey}`,
    key: objectKey,
  };
};

const tryUploadInline = async (file: File): Promise<UploadSuccess | null> => {
  // Keep this fallback small to avoid overly large DB payloads.
  if (file.size > 1 * 1024 * 1024) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  return {
    provider: "inline",
    key: `inline-${Date.now()}-${randomUUID()}`,
    url: `data:${file.type};base64,${base64}`,
  };
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rateLimit = await requireRateLimit({
    request,
    key: "admin:psychologists:upload-photo",
    limit: 30,
    window: "1 m",
  });
  if (rateLimit) return rateLimit;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Use JPG, PNG, WEBP, or GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File is too large. Maximum size is 4MB." },
      { status: 400 }
    );
  }

  const errors: string[] = [];

  try {
    const uploadthingUpload = await tryUploadWithUploadThing(file);
    if (uploadthingUpload) {
      return NextResponse.json(uploadthingUpload, { status: 201 });
    }
    errors.push("UploadThing not configured.");
  } catch (error) {
    errors.push(
      `UploadThing: ${
        error instanceof Error ? error.message : "UploadThing upload failed"
      }`
    );
  }

  try {
    const supabaseUpload = await tryUploadWithSupabase(file);
    if (supabaseUpload) {
      return NextResponse.json(supabaseUpload, { status: 201 });
    }
    errors.push("Supabase storage not configured.");
  } catch (error) {
    errors.push(
      `Supabase: ${
        error instanceof Error ? error.message : "Supabase upload failed"
      }`
    );
  }

  try {
    const inlineUpload = await tryUploadInline(file);
    if (inlineUpload) {
      return NextResponse.json(inlineUpload, { status: 201 });
    }
    errors.push("Inline fallback unavailable: file is larger than 1MB.");
  } catch (error) {
    errors.push(
      `Inline: ${error instanceof Error ? error.message : "Inline upload failed"}`
    );
  }

  return NextResponse.json(
    {
      error: "Photo upload failed on both providers.",
      details: errors,
    },
    { status: 500 }
  );
}
