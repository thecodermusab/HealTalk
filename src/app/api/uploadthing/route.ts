import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "./core";

const uploadthingSecret =
  process.env.UPLOADTHING_SECRET ||
  process.env.UPLOADTHING_KEY ||
  process.env.UPLOADTHING_TOKEN ||
  "";

const uploadthingId = process.env.UPLOADTHING_APP_ID || "";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
  config: {
    uploadthingSecret,
    uploadthingId,
  },
});
