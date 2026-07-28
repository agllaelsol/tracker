import {
  DEFAULT_DEVICE_SIZES,
  DEFAULT_IMAGE_SIZES,
  handleImageOptimization,
} from "vinext/server/image-optimization";
import type { Env } from "./types.ts";

const IMAGE_CACHE_CONTROL = "public, max-age=31536000, immutable";
const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];

/** Handles the image-optimization endpoint independently from app routing. */
export async function handleImageRequest(request: Request, env: Env): Promise<Response> {
  const response = await handleImageOptimization(request, {
    fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
    transformImage: async (body, { width, format, quality }) => {
      const result = await env.IMAGES
        .input(body)
        .transform(width > 0 ? { width } : {})
        .output({ format, quality });
      return result.response();
    },
  }, allowedWidths);

  const headers = new Headers(response.headers);
  if (response.ok) {
    headers.set("Cache-Control", IMAGE_CACHE_CONTROL);
  } else {
    headers.set("Cache-Control", "no-store");
  }
  headers.set("X-Content-Type-Options", "nosniff");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
