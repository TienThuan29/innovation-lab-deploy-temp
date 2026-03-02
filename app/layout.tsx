import { ThemeModeScript } from "flowbite-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeInit } from "../.flowbite-react/init";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import FooterWrapper from "@/components/footer-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Innovation Labs",
  description: "Innovation Labs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900`}
      >
        <ThemeInit />
        <ToastProvider>
          <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
            <main className="flex-grow bg-white dark:bg-gray-900">
              {children}
            </main>
            <FooterWrapper />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
