import { sanityClient } from "./sanity";

export interface HelpCenterData {
  title?: string;
  subtitle?: string;
  faqs?: Array<{
    question?: string;
    answer?: string;
  }>;
}

export async function getHelpCenterData(): Promise<HelpCenterData | null> {
  return sanityClient.fetch(
    `*[_type == "helpCenter"][0]{
      title,
      subtitle,
      faqs
    }`,
    {},
    { cache: "no-store" }
  );
}
