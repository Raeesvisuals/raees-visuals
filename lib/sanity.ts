import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

/* =========================
   SANITY CLIENT
========================= */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  console.warn("⚠️ Missing Sanity environment variables: NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET");
}

export const sanityClient = createClient({
  projectId: projectId || "st67411b", // Fallback for build time
  dataset: dataset || "production", // Fallback for build time
  apiVersion: "2024-01-01",
  // Avoid stale content while editing locally; keep CDN in production for speed.
  useCdn: process.env.NODE_ENV === "production",
  // Add token for write operations (mutations)
  token: process.env.SANITY_API_TOKEN,
});

/* =========================
   IMAGE URL BUILDER
========================= */
const imageBuilder = createImageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return imageBuilder.image(source);
}
