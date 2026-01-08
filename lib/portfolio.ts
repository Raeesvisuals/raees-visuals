import { sanityClient } from "./sanity";

export async function getPortfolioItems() {
  return sanityClient.fetch(
    `
    *[_type == "portfolio"] | order(_createdAt desc) {
      _id,
      title,
      format,
      videoType,
      youtubeUrl,
      categories[]->{
        _id,
        title
      },
      thumbnail,
      tags,
      videoFile {
        asset->{
          url,
          mimeType
        }
      }
    }
    `,
    {},
    { cache: "no-store" }
  );
}
