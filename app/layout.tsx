import type { Metadata } from "next";
import "@/styles/reset.css";
import "@/styles/tokens.css";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { site } from "@/src/data/content";

export const metadata: Metadata = {
  title: site.name,
  description: site.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="app-shell">
        <SiteHeader />
        <main className="app-shell__main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
