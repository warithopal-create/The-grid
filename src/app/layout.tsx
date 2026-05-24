import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/hooks/useLanguage";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "THE GRID — EV Driver Survey Oman 2026",
  description:
    "Help shape Oman's premium EV charging future. Share your experience in 3 minutes.",
  openGraph: {
    title: "THE GRID — EV Driver Survey",
    description:
      "Help shape Oman's premium EV charging future.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-black text-white">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
