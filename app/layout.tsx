import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://dlme-nu.vercel.app";
const SITE_NAME = "DL for ME";
const SITE_TITLE = "DL for ME — MIT-style STEM curriculum for engineers";
const SITE_DESCRIPTION =
  "A complete learning path for mechanical engineering students — from integral calculus to neural networks. Interactive demos, click-to-reveal practice, progress tracking. Free.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · DL for ME",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "mechanical engineering",
    "deep learning",
    "calculus",
    "linear algebra",
    "physics",
    "MIT OpenCourseWare",
    "STEM",
    "interactive learning",
  ],
  authors: [{ name: "DL for ME" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
