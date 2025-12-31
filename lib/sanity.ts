import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

/* =========================
   SANITY CLIENT
========================= */
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
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
