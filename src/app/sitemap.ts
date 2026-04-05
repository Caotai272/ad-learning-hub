import type { MetadataRoute } from "next";

import { listPublishedGlossarySitemapEntries } from "@/modules/glossary/glossary.service";

const staticRoutes = [
  "",
  "/about",
  "/learning-paths",
  "/courses",
  "/practice",
  "/glossary",
  "/pricing",
  "/privacy",
  "/terms",
  "/login",
  "/register",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
  const lastModified = new Date();
  const glossaryEntries = await listPublishedGlossarySitemapEntries();

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified,
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : route === "/pricing" || route === "/practice" ? 0.8 : 0.7,
    })),
    ...glossaryEntries.map((entry) => ({
      url: `${baseUrl}/glossary/${entry.slug}`,
      lastModified: entry.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
