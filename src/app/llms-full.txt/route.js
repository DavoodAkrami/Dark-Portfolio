import projects from "@/Data/Projects.json";
import experiences from "@/Data/Experience.json";
import contactInfo from "@/Data/ContactInfo.json";
import currentModes from "@/Data/currentModes.json";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const contact = contactInfo[0];
  const content = [
    "# Davood Akrami",
    "Junior Front-End Developer",
    `Source: ${SITE_URL}/`,
    "## Current mode",
    ...currentModes.map((mode) => mode.trim()),
    "## Projects",
    `Source: ${SITE_URL}/projects`,
    ...projects.map((project) => [
      `### ${project.title}`,
      project.description,
      `Technologies: ${project.technologies.join(", ")}`,
      project.url ? `Website: ${project.url}` : "",
      project.gitHub ? `Repository: ${project.gitHub}` : "",
    ].filter(Boolean).join("\n\n")),
    "## Professional experiences",
    `Source: ${SITE_URL}/resume`,
    ...experiences.map((experience) => [
      `### ${experience.title.trim()}`,
      experience.date,
      experience.description,
    ].join("\n\n")),
    "## Resume and public profiles",
    `Resume: ${contact.resume}`,
    `GitHub: ${contact.github}`,
    `LinkedIn: ${contact.linkedin.split("?")[0]}`,
    "## Contact",
    `Source: ${SITE_URL}/contactme`,
    `Email: ${contact.email}`,
  ].join("\n\n");

  return new Response(`${content}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      Link: '</llms.txt>; rel="describedby"',
    },
  });
}
