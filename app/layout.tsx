import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DispatchFlow",
    template: "%s | DispatchFlow",
  },
  description:
    "Request. Track. Deliver. — Internal logistics and procurement platform.",
  icons: {
    icon: "/dispatchflow-logo.svg",
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
