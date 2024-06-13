import "@hr-toolkit/ui/globals.css";
import type { Metadata } from "next";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { Providers } from "@/components/providers";

const baseUrl = "https://hr-toolkit-dashboard.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "HR Toolkit",
    template: "%s | HR Toolkit",
  },
  description:
    "HR Toolkit is a collection of tools to help you manage HR processes.",
  openGraph: {
    title: "HR Toolkit | Manage your HR processes smarter",
    description: "This is my portfolio.",
    url: baseUrl,
    siteName: "HR Toolkit | Manage your HR processes smarter",
    locale: "en_US",
    type: "website",
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
    icon: { rel: "icon", url: "/icon.ico" },
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)" },
    { media: "(prefers-color-scheme: dark)" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
