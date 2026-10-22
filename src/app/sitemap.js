import pages from "@/Data/Pages.json";
import { SITE_URL } from "@/lib/seo";

export default function sitemap() {
  return pages.map(({ path }) => ({ url: `${SITE_URL}${path}` }));
}
