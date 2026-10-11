import type { Metadata } from "next";
import { Shell } from "@/components/site";
import { origin } from "@/lib/content";
import "./globals.css";
import { siteSettings, catalogue } from "@/lib/server";
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default:
      "ADEX Engineering & Contracting | Building Today, Shaping Tomorrow",
    template: "%s | ADEX Engineering & Contracting",
  },
  description:
    "Explore a considered approach to construction, engineering and contracting. Discuss your next project with ADEX.",
  openGraph: {
    siteName: "ADEX Engineering & Contracting",
    type: "website",
    images: [{ url: "/images/hero.jpg", width: 2000, height: 1333 }],
  },
  icons: { icon: "/favicon.svg" },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, serviceEntries] = await Promise.all([
    siteSettings(),
    catalogue("services"),
  ]);
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ADEX Engineering & Contracting",
              url: origin,
            }),
          }}
        />
        <Shell settings={settings} serviceEntries={serviceEntries}>
          {children}
        </Shell>
      </body>
    </html>
  );
}
