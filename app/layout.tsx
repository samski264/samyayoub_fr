import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
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

export const metadata: Metadata = {
  title: "Samy — Product Engineer",
  description:
    "Product engineer who starts by the problem and enjoys designing and engineering products that are well-built.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${ibmPlexSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
