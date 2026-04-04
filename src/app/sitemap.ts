import type { MetadataRoute } from "next";

const routes = [
  "",
  "/about",
  "/pricing",
  "/login",
  "/register",
  "/dashboard/overview",
  "/admin/dashboard",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL ?? "http://localhost:3000";

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
