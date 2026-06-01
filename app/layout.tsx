import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const rand = localFont({
  variable: "--font-rand",
  display: "swap",
  src: [
    { path: "./font/Rand-Thin.otf", weight: "100", style: "normal" },
    { path: "./font/Rand-ThinItalic.otf", weight: "100", style: "italic" },
    { path: "./font/Rand-Light.otf", weight: "300", style: "normal" },
    { path: "./font/Rand-LightItalic.otf", weight: "300", style: "italic" },
    { path: "./font/Rand-Regular.otf", weight: "400", style: "normal" },
    { path: "./font/Rand-RegularItalic.otf", weight: "400", style: "italic" },
    { path: "./font/Rand-Medium.otf", weight: "500", style: "normal" },
    { path: "./font/Rand-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "./font/Rand-Bold.otf", weight: "700", style: "normal" },
    { path: "./font/Rand-BoldItalic.otf", weight: "700", style: "italic" },
    { path: "./font/Rand-Heavy.otf", weight: "800", style: "normal" },
    { path: "./font/Rand-HeavyItalic.otf", weight: "800", style: "italic" },
    { path: "./font/Rand-Black.otf", weight: "900", style: "normal" },
    { path: "./font/Rand-BlackItalic.otf", weight: "900", style: "italic" },
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
  src: "./font/surt-variable-wght-wdth-slnt.ttf",
  weight: "100 900",
  style: "normal",
});

const ibmPlexSerif = localFont({
  variable: "--font-ibm-plex-serif",
  display: "swap",
  src: [
    { path: "./font/IBMPlexSerif-Thin.ttf", weight: "100", style: "normal" },
    { path: "./font/IBMPlexSerif-ThinItalic.ttf", weight: "100", style: "italic" },
    { path: "./font/IBMPlexSerif-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "./font/IBMPlexSerif-ExtraLightItalic.ttf", weight: "200", style: "italic" },
    { path: "./font/IBMPlexSerif-Light.ttf", weight: "300", style: "normal" },
    { path: "./font/IBMPlexSerif-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "./font/IBMPlexSerif-Regular.ttf", weight: "400", style: "normal" },
    { path: "./font/IBMPlexSerif-Italic.ttf", weight: "400", style: "italic" },
    { path: "./font/IBMPlexSerif-Medium.ttf", weight: "500", style: "normal" },
    { path: "./font/IBMPlexSerif-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "./font/IBMPlexSerif-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./font/IBMPlexSerif-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "./font/IBMPlexSerif-Bold.ttf", weight: "700", style: "normal" },
    { path: "./font/IBMPlexSerif-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
});

const ibmPlexMono = localFont({
  variable: "--font-ibm-plex-mono",
  display: "swap",
  src: [
    { path: "./font/IBMPlexMono-Thin.ttf", weight: "100", style: "normal" },
    { path: "./font/IBMPlexMono-ThinItalic.ttf", weight: "100", style: "italic" },
    { path: "./font/IBMPlexMono-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "./font/IBMPlexMono-ExtraLightItalic.ttf", weight: "200", style: "italic" },
    { path: "./font/IBMPlexMono-Light.ttf", weight: "300", style: "normal" },
    { path: "./font/IBMPlexMono-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "./font/IBMPlexMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "./font/IBMPlexMono-Italic.ttf", weight: "400", style: "italic" },
    { path: "./font/IBMPlexMono-Medium.ttf", weight: "500", style: "normal" },
    { path: "./font/IBMPlexMono-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "./font/IBMPlexMono-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./font/IBMPlexMono-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "./font/IBMPlexMono-Bold.ttf", weight: "700", style: "normal" },
    { path: "./font/IBMPlexMono-BoldItalic.ttf", weight: "700", style: "italic" },
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
      jobTitle: "Product Engineer",
      hasOccupation: {
        "@type": "Occupation",
        name: "Product Engineer",
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
        "Product Engineer building end-to-end digital products — design systems, full-stack apps, XR/AR experiences and AI features.",
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
      name: "Samy Ayoub Fawaz — Product Engineer",
      isPartOf: { "@id": "https://samyayoub.fr#website" },
      inLanguage: "en-US",
      headline: "Portfolio of Samy Ayoub Fawaz — Product Engineer",
      description:
        "Product Engineer building end-to-end digital products: design systems, full-stack apps, XR/AR and AI features.",
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
      </body>
    </html>
  );
}
