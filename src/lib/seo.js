import contactInfo from "@/Data/ContactInfo.json";
import currentModes from "@/Data/currentModes.json";

export const SITE_URL = "https://www.davoodakrami.ir";

const contact = contactInfo[0];

// Use only identity and contact information already published on the site.
export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Davood Akrami",
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/Davood-noBG.png`,
      jobTitle: currentModes[0].trim().replace(/ at Adleep\.$/, ""),
      worksFor: { "@type": "Organization", name: "Adleep" },
      knowsAbout: ["Front-end development", "AI", "Entrepreneurship"],
      email: contact.email,
      sameAs: [contact.github, contact.linkedin.split("?")[0]],
      subjectOf: { "@type": "WebPage", url: contact.resume },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Davood Akrami Portfolio",
      inLanguage: "en",
      author: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

// metadata.js is not a Next.js file convention; server layouts expose these
// existing descriptions without changing the client pages or their content.
export function publicPageMetadata(existingMetadata) {
  return {
    ...existingMetadata,
    alternates: {
      canonical: existingMetadata.alternates.canonical,
    },
    openGraph: {
      title: existingMetadata.title,
      description: existingMetadata.description,
      url: existingMetadata.alternates.canonical,
      siteName: "Davood Akrami Portfolio",
      images: [{ url: `${SITE_URL}/Davood-noBG.png` }],
      locale: "en_US",
      type: "website",
    },
  };
}
