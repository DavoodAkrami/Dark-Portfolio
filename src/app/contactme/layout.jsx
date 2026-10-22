import { metadata as existingMetadata } from "./metadata";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata(existingMetadata);

export default function ContactLayout({ children }) {
  return children;
}
