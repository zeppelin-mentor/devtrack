import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevTrack - Developer Project & Experience Manager",
  description: "Track your development projects, manage accounts, tech stacks, and export professional experience for resumes and portfolios. The ultimate tool for developers to showcase their work.",
  keywords: "developer portfolio, project management, tech stack tracker, resume builder, developer tools, project tracker, experience manager",
  authors: [{ name: "DevTrack" }],
  openGraph: {
    title: "DevTrack - Developer Project & Experience Manager",
    description: "Track your development projects, manage accounts, tech stacks, and export professional experience for resumes and portfolios.",
    url: "https://trackmydevelopement.vercel.app",
    siteName: "DevTrack",
    images: [
      {
        url: "https://trackmydevelopement.vercel.app/horizantal-logo-devtrack.png",
        width: 1200,
        height: 630,
        alt: "DevTrack Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevTrack - Developer Project & Experience Manager",
    description: "Track your development projects, manage accounts, tech stacks, and export professional experience for resumes and portfolios.",
    images: ["https://trackmydevelopement.vercel.app/horizantal-logo-devtrack.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon-devtrack.png",
    shortcut: "/icon-devtrack.png",
    apple: "/icon-devtrack.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
