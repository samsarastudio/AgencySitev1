import type { Metadata } from "next";
export const origin =
  process.env.NEXT_PUBLIC_SITE_URL || "https://inmomentservices.com";
export function meta(
  title: string,
  description: string,
  path: string,
  image?: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: origin + path },
    openGraph: {
      title: `${title} | InMoment Services`,
      description,
      url: origin + path,
      type: "website",
      ...(image
        ? {
            images: [
              { url: origin + image, width: 1536, height: 1024, alt: title },
            ],
          }
        : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [origin + image] } : {}),
    },
  };
}
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
