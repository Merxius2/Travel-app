import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/AppProviders";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Location Tracker",
  description: "A modern, elegant location-tracking MVP with liquid glass design",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="theme-bg h-full" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0f0c29" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh antialiased`}
      >
        <div className="theme-backdrop" aria-hidden="true" />
        <div className="theme-backdrop-glow" aria-hidden="true" />
        <AppProviders>
          <div className="relative z-10 mx-auto min-h-screen max-w-6xl px-4 pb-8 pt-[max(2rem,env(safe-area-inset-top,0px))] sm:px-6 sm:pb-12 sm:pt-[max(3rem,env(safe-area-inset-top,0px))] lg:px-8">
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
