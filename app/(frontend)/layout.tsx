import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Analytics } from "@/components/analytics";
import { JsonLd, origin } from "@/lib/seo";
import "./globals.css";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: "InMoment Services — AI Photobooths & Creative Photo Experiences",
    template: "%s | InMoment Services",
  },
  description:
    "AI photobooths, personalized photo experiences, physical keepsakes and custom event technology. InMoment helps brands and agencies make the moment personal.",
  icons: { icon: "/favicon.svg" },
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  robots:
    process.env.NEXT_PUBLIC_PREVIEW === "1"
      ? { index: false, follow: false }
      : { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Navigation />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "InMoment Services",
            url: origin,
            email: "hello@inmomentservices.com",
          }}
        />
      </body>
    </html>
  );
}
