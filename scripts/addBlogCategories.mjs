/**
 * Script to add blog categories to Sanity
 * Run with: node scripts/addBlogCategories.mjs
 * 
 * This script uses the web project's Sanity client configuration
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // You'll need to add this to .env.local
});

const categories = [
  { title: "Tips & Tricks", order: 0 },
  { title: "Plugins & Presets", order: 1 },
  { title: "Viral Content", order: 2 },
  { title: "Color Grading", order: 3 },
  { title: "Editing Software", order: 4 },
  { title: "AI for Editors", order: 5 },
  { title: "Motion & VFX", order: 6 },
  { title: "Short-Form Editing", order: 7 },
  { title: "Creator & Industry", order: 8 },
  { title: "Updates & Resources", order: 9 },
];

async function seedCategories() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    console.error("❌ Missing Sanity configuration. Please check your .env.local file.");
    process.exit(1);
  }

  if (!process.env.SANITY_API_TOKEN) {
    console.error("❌ Missing SANITY_API_TOKEN. Please add it to your .env.local file.");
    console.log("   Get your token from: https://www.sanity.io/manage");
    process.exit(1);
  }

  console.log("🌱 Starting to seed blog categories...\n");
  console.log(`📦 Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`📊 Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}\n`);

  for (const category of categories) {
    try {
      // Generate slug from title
      const slug = category.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Check if category already exists
      const existing = await client.fetch(
        `*[_type == "blogCategory" && title == $title][0]`,
        { title: category.title }
      );

      if (existing) {
        console.log(`⏭️  Category "${category.title}" already exists, skipping...`);
        continue;
      }

      // Create the category
      const result = await client.create({
        _type: "blogCategory",
        title: category.title,
        slug: {
          _type: "slug",
          current: slug,
        },
        order: category.order,
      });

      console.log(`✅ Created category: "${category.title}" (ID: ${result._id})`);
    } catch (error) {
      console.error(`❌ Error creating category "${category.title}":`, error.message);
    }
  }

  console.log("\n✨ Finished seeding blog categories!");
}

// Run the script
seedCategories().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

