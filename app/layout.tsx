import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/app-context";
import { ServiceWorker } from "@/components/ServiceWorker";

export const metadata: Metadata = {
  title: "मेरा रोज़गार | MGNREGA worker portal",
  description: "मेरा रोज़गार: MGNREGA काम, मज़दूरी और शिकायत की साफ़ जानकारी।",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "मेरा रोज़गार" },
  icons: { icon: "/images/emblem.png", apple: "/images/emblem.png" },
};

export const viewport: Viewport = {
  themeColor: "#6B4226",
  viewportFit: "cover",
  initialScale: 1,
  width: "device-width",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
        <ServiceWorker />
      </body>
    </html>
  );
}
