import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Hotjar from "@/components/Hotjar";
import "./globals.css";

const rand = localFont({
  variable: "--font-rand",
  display: "swap",
  src: [
    { path: "./font/Rand-Regular.otf", weight: "400", style: "normal" },
    { path: "./font/Rand-Medium.otf", weight: "500", style: "normal" },
  ],
});

const gridular = localFont({
  variable: "--font-gridular",
  display: "swap",
  src: "./font/Gridular-Regular.otf",
  weight: "400",
  style: "normal",
});

const surt = localFont({
  variable: "--font-surt",
  display: "swap",
  src: "./font/surt-variable-wght-wdth-slnt.woff2",
  weight: "100 900",
  style: "normal",
});

const ibmPlexSerif = localFont({
  variable: "--font-ibm-plex-serif",
  display: "swap",
  src: [
    { path: "./font/IBMPlexSerif-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
});

const ibmPlexMono = localFont({
  variable: "--font-ibm-plex-mono",
  display: "swap",
  src: [
    { path: "./font/IBMPlexMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "./font/IBMPlexMono-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./font/IBMPlexMono-Bold.ttf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Samy — Product Engineer",
  description:
    "Product engineer who starts by the problem and enjoys designing and engineering products that are well-built.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://samyayoub.fr#person",
      name: "Samy Ayoub Fawaz",
      givenName: "Samy",
      familyName: "Ayoub Fawaz",
      jobTitle: "Product Design Engineer",
      hasOccupation: {
        "@type": "Occupation",
        name: "Product Design Engineer",
        occupationLocation: [
          { "@type": "Country", name: "Switzerland" },
          { "@type": "Country", name: "France" },
        ],
        skills:
          "Product engineering, design systems, full-stack development, prototyping, XR/AR, AI product features",
      },
      url: "https://samyayoub.fr/",
      mainEntityOfPage: "https://samyayoub.fr/",
      image: "https://samyayoub.fr/assets/img/moi.webp",
      description:
        "Product Design Engineer building end-to-end digital products — design systems, full-stack apps, XR/AR experiences and AI features.",
      sameAs: [
        "https://www.linkedin.com/in/ayoubsamy/",
        "https://github.com/samski264",
        "https://www.instagram.com/samski.264/",
      ],
      knowsLanguage: ["fr", "en"],
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "ENSCI — Les Ateliers",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "portfolio inquiries",
        availableLanguage: ["en", "fr"],
        url: "https://samyayoub.fr/contact",
      },
      knowsAbout: [
        "Product engineering",
        "Design engineering",
        "Product design",
        "Design systems",
        "UX/UI design",
        "Next.js",
        "Node.js",
        "Python",
        "3D printing",
        "Digital fabrication",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://samyayoub.fr#website",
      url: "https://samyayoub.fr/",
      name: "Portfolio — Samy Ayoub Fawaz",
      inLanguage: "en-US",
      publisher: { "@id": "https://samyayoub.fr#person" },
    },
    {
      "@type": "WebPage",
      "@id": "https://samyayoub.fr#webpage",
      url: "https://samyayoub.fr/",
      name: "Samy Ayoub Fawaz — Product Design Engineer",
      isPartOf: { "@id": "https://samyayoub.fr#website" },
      inLanguage: "en-US",
      headline: "Portfolio of Samy Ayoub Fawaz — Product Design Engineer",
      description:
        "Product Design Engineer building end-to-end digital products: design systems, full-stack apps, XR/AR and AI features.",
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://samyayoub.fr/assets/img/std/procede.jpg",
        width: 1200,
        height: 630,
      },
      about: { "@id": "https://samyayoub.fr#person" },
      mainEntity: { "@id": "https://samyayoub.fr#person" },
      datePublished: "2024-01-01",
      dateModified: "2026-06-01",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://samyayoub.fr/",
          },
        ],
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${surt.variable} ${ibmPlexSerif.variable} ${ibmPlexMono.variable} ${rand.variable} ${gridular.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <GoogleAnalytics gaId={"G-04P4V0L2J1"} />
        <Hotjar />
      </body>
    </html>
  );
}
