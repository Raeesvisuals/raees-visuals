import { sanityClient } from "./sanity";

export async function getPortfolioItems() {
  const items = await sanityClient.fetch(
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
      category->{
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

  // Normalize: convert old single category to categories array for backward compatibility
  return items.map((item: any) => {
    // If categories array exists and has items, use it
    if (item.categories && Array.isArray(item.categories) && item.categories.length > 0) {
      return item;
    }
    // Otherwise, convert old single category to categories array
    if (item.category) {
      return {
        ...item,
        categories: [item.category],
        category: undefined, // Remove old field
      };
    }
    // If no categories at all, return as is (will be filtered out)
    return item;
  });
}
