import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import StoreProvider from "@/providers/storeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Davood Akrami | Portfolio",
  description: "Portfolio of Davood Akrami, junior Front-end developer and interested at entreprenuership. Created to show his projects, experiences and his resume. نمونه کارهای داوود اکرمى، توسعه دهنده فرانت اند.",
  keywords: [
    "Davood", "Akrami", "Front-end", "Frontend", "React", "next", "next js",
    "داوود", "اکرمی", "رزومه", "برنامه نویسی", "فرانت اند", "توسعه دهنده", "برنامه نویس", "پورتفولیو"
  ],
  openGraph: {
    title: "Davood Akrami | Portfolio",
    description: "Portfolio of Davood Akrami, junior Front-end developer and interested at entreprenuership. Created to show his projects, experiences and his resume",
    url: "https://www.davoodakrami.ir/",
    siteName: "Davood Akrami Portfolio",
    Images: [
      {
        url: "/Davood-noBG.png",
        width: 800,
        height: 600
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://www.davoodakrami.ir/",
    languages: {
      "en": "https://www.davoodakrami.ir/",
      "fa": "https://www.davoodakrami.ir/",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Davood Akrami",
              "url": "https://www.davoodakrami.ir/",
              "image": "https://www.davoodakrami.ir/Davood-noBG.png"
            }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <ThemeProvider>
            <Header />
            <div className="bg-[var(--primary-color)] pt-[10vh]">
              {children}
            </div>
            <Footer />
          </ThemeProvider>
          <Analytics />
          <SpeedInsights />
        </StoreProvider>
      </body>
    </html>
  );
}
