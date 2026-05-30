import type { MetadataRoute } from "next";
import { allPuzzles } from "@/content/puzzles";

export default function sitemap(): MetadataRoute.Sitemap {
  const puzzleEntries: MetadataRoute.Sitemap = allPuzzles.map((puzzle) => ({
    url: `https://onul.vercel.app/puzzle/${puzzle.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    {
      url: "https://onul.vercel.app/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://onul.vercel.app/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://onul.vercel.app/archive",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://onul.vercel.app/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...puzzleEntries,
  ];
}
