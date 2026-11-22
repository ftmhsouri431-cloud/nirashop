import type { Metadata } from "next";
import { Markazi_Text, Vazirmatn } from "next/font/google";
import { ShopProvider } from "@/context/shop-context";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublicSettings } from "@/lib/settings";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-body",
  display: "swap",
});

const markazi = Markazi_Text({
  subsets: ["arabic", "latin"],
  variable: "--font-display",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return {
    title: {
      default: `${settings.shopName} | فروشگاه پوشاک`,
      template: `%s | ${settings.shopName}`,
    },
    description: settings.tagline,
    openGraph: {
      title: settings.shopName,
      description: settings.tagline,
      locale: "fa_IR",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSettings();

  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${vazirmatn.variable} ${markazi.variable} antialiased`}
      >
        <ShopProvider>
          <SiteHeader shopName={settings.shopName} />
          <main id="main">{children}</main>
          <SiteFooter
            shopName={settings.shopName}
            tagline={settings.tagline}
          />
        </ShopProvider>
      </body>
    </html>
  );
}
