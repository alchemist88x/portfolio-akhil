import { MetadataRoute } from "next";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { defaultProjects } from "@/lib/initial-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://akhil.dev";
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  try {
    const db = await connectToDatabase();
    let publishedProjects: any[] = [];

    if (db.isConnected) {
      publishedProjects = await Project.find({ published: true }).select("slug updatedAt").lean();
    } else {
      publishedProjects = defaultProjects.filter((p) => p.published);
    }

    publishedProjects.forEach((proj) => {
      routes.push({
        url: `${baseUrl}/projects/${proj.slug}`,
        lastModified: proj.updatedAt || new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    });
  } catch (error) {
    console.error("[Sitemap Error]", error);
  }

  return routes;
}
