import { origin } from "@/lib/content";
import { catalogue } from "@/lib/server";
export default async function sitemap() {
  const paths = [
    "",
    "about",
    "services",
    "projects",
    "process",
    "quality-safety",
    "careers",
    "insights",
    "contact",
    "quote",
    "faq",
    "privacy",
    "terms",
  ];
  for (const kind of ["services", "projects", "articles", "jobs"])
    for (const item of await catalogue(kind))
      paths.push(
        (kind === "articles"
          ? "insights"
          : kind === "jobs"
            ? "careers"
            : kind) +
          "/" +
          item.slug,
      );
  return paths.map((p) => ({
    url: origin + "/" + p,
    changeFrequency: "monthly" as const,
    priority: p ? 0.7 : 1,
  }));
}
