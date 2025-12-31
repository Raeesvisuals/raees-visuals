import { sanityClient } from "./sanity";

export async function getHomeData() {
  return sanityClient.fetch(`
    *[_type == "home"][0]{
      heroTitle,
      heroTagline,
      heroDescription,
      servicesTitle,
      servicesSubtitle,
      services,
      premiumTitle,
      premiumDescription,
      premiumBullets
    }
  `);
}
