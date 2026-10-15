import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { brand } from "@/lib/brand";
import { siteDefaultMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...siteDefaultMetadata,
  title: {
    default: brand.name,
    template: `%s | ${brand.name}`,
  },
  icons: {
    icon: "/dispatchflow-icon.svg",
    apple: "/dispatchflow-icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: brand.name,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0b1220" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "min-h-svh overflow-x-clip font-sans antialiased")}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
