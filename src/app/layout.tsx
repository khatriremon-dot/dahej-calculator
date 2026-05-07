import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.calculatedahej.com"),
  title: "Dahej Calculator - Satirical Dowry Calculator India | Calculate Dahej Amount Online",
  description:
    "Free online Dahej Calculator - Calculate satirical dowry amount based on profession, salary, education & location. Social awareness tool against dowry practices in India, Pakistan, Bangladesh & South Asia.",
  keywords: [
    // Primary India keywords
    "dahej calculator",
    "dowry calculator",
    "calculate dahej",
    "dahej calculation online",
    "dowry amount calculator",
    "how much dahej to ask",
    "dahej calculator by profession",
    "dowry calculator india",
    "dahej calculator app",
    "dahej amount calculator",
    // Hindi/regional
    "दहेज कैलकुलेटर",
    "दहेज गणना",
    "dahej in hindi",
    // Long-tail
    "how to calculate dahej amount",
    "dowry calculator based on salary",
    "dahej calculator software engineer",
    "dowry calculator doctor",
    "dahej calculator government job",
    "average dowry amount in india 2025",
    "dowry calculation formula",
    // Related practices
    "bride price calculator",
    "lobola calculator",
    "mahr calculator",
    "mehr calculator islamic",
    "caili calculator china",
    "bride price vs dowry",
    // Awareness
    "anti dowry calculator",
    "stop dowry",
    "dowry prohibition act",
    "dowry deaths statistics",
    "section 498a ipc",
    "dowry free marriage",
    // Wedding cost
    "wedding cost calculator india",
    "marriage expenses calculator",
    "indian wedding budget calculator",
  ],
  authors: [{ name: "Dahej Calculator Team" }],
  creator: "Dahej Calculator",
  publisher: "Dahej Calculator",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Dahej Calculator - How Much Dowry Should You Ask For?",
    description:
      "Try India's most viral satirical dowry calculator! Calculate your dahej amount based on profession, salary, education & more. Share with friends and spread awareness against dowry.",
    url: "https://www.calculatedahej.com",
    siteName: "Dahej Calculator",
    type: "website",
    locale: "en_IN",
    alternateLocale: ["hi_IN", "ur_PK", "bn_BD"],
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: "Dahej Calculator - Satirical Dowry Calculator India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dahej Calculator - Satirical Dowry Calculator | Calculate Dahej Online",
    description:
      "Calculate your satirical dowry amount and see why dowry is absurd. Try India's #1 viral dahej calculator! #StopDowry #DahejCalculator",
    images: ["/logo.png"],
    creator: "@calculatedahej",
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
  alternates: {
    canonical: "https://www.calculatedahej.com",
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
  category: "society",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-YOUR-ADSENSE-ID" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-ADSENSE-ID"
          crossOrigin="anonymous"
        />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-GA-ID"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YOUR-GA-ID');
            `,
          }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Dahej Calculator",
              url: "https://www.calculatedahej.com",
              logo: "https://www.calculatedahej.com/logo.png",
              description:
                "A satirical tool to raise awareness about dowry practices and promote gender equality in marriage.",
              sameAs: [],
            }),
          }}
        />

        {/* WebApplication Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Dahej Calculator",
              url: "https://www.calculatedahej.com",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
              description:
                "Free satirical dahej calculator to raise awareness about dowry practices in India.",
              browserRequirements: "Requires JavaScript",
              softwareVersion: "1.0",
            }),
          }}
        />

        {/* BreadcrumbList Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.calculatedahej.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Dahej Calculator",
                  item: "https://www.calculatedahej.com/#calculator",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "About Dowry",
                  item: "https://www.calculatedahej.com/#about",
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "Bride Price Worldwide",
                  item: "https://www.calculatedahej.com/#worldwide",
                },
                {
                  "@type": "ListItem",
                  position: 5,
                  name: "FAQ",
                  item: "https://www.calculatedahej.com/#faq",
                },
              ],
            }),
          }}
        />

        {/* Geo targeting for India */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="language" content="en-IN" />
        <meta name="audience" content="all" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
      </head>
      <body
        className={`${geistSans.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
