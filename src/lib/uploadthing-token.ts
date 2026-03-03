const parseRegions = (raw: string | undefined) => {
  const parsed = (raw || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : ["iad1"];
};

export const getUploadthingToken = () => {
  if (process.env.UPLOADTHING_TOKEN) {
    return process.env.UPLOADTHING_TOKEN;
  }

  const legacySecret = process.env.UPLOADTHING_SECRET || process.env.UPLOADTHING_KEY;
  const appId = process.env.UPLOADTHING_APP_ID;
  if (!legacySecret || !appId) {
    return undefined;
  }

  // Compatibility fallback for legacy env setup (SECRET + APP_ID).
  const payload = {
    apiKey: legacySecret,
    appId,
    regions: parseRegions(
      process.env.UPLOADTHING_REGIONS || process.env.UPLOADTHING_REGION
    ),
    ingestHost: process.env.UPLOADTHING_INGEST_HOST || "ingest.uploadthing.com",
  };

  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64");
};
