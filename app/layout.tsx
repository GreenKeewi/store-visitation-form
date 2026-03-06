import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Store Visitation Tracker",
  description:
    "Professional TM's store visitation tracking system for HVAC sales teams. Monitor territory manager visits, track sales leads, closing ratios, and pipeline data. Streamline store engagement reporting with comprehensive forms for cleanliness audits, display management, and promotional execution tracking.",
  keywords: [
    "store visitation tracker",
    "HVAC sales management",
    "territory manager tracking",
    "sales pipeline management",
    "retail audit system",
    "store engagement reporting",
    "sales lead tracking",
    "closing ratio analytics",
    "promotional execution tracking",
    "store display management",
    "field sales tracking",
    "retail operations management",
  ],
  authors: [{ name: "Rose Prods" }],
  creator: "National Energy Equipment",
  publisher: "Store Visitation Tracker",
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
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://store-visitation-tracker.netlify.app",
    title: "Store Visitation Tracker - HVAC Sales Management System",
    description:
      "Professional TM's store visitation tracking system for HVAC sales teams. Monitor territory manager visits, track sales leads, closing ratios, and pipeline data.",
    siteName: "Store Visitation Tracker",
    images: [
      {
        url: "/lightModeVersion.png",
        width: 1200,
        height: 630,
        alt: "Store Visitation Tracker - HVAC Sales Management Dashboard",
      },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  category: "Business Software",
  classification: "Sales Management System",
  referrer: "origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Store Visitation Tracker",
    description:
      "Professional store visitation tracking system for HVAC sales teams",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "Store Visitation Tracker Team",
    },
    featureList: [
      "Territory Manager Tracking",
      "Sales Lead Management",
      "Pipeline Analytics",
      "Store Engagement Reporting",
      "Display Management",
      "Promotional Execution Tracking",
    ],
  };

  return (
    <html lang="en" dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <link
          rel="canonical"
          href="https://store-visitation-tracker.netlify.app"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/lightModeVersion.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          async
          src="https://scripts.simpleanalyticscdn.com/latest.js"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
