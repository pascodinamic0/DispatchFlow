import type { Metadata } from "next";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "min-h-svh font-sans antialiased")}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
