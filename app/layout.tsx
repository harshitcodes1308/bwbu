import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "मेरा रोज़गार | MGNREGA worker portal",
  description: "मेरा रोज़गार: MGNREGA काम, मज़दूरी और शिकायत की साफ़ जानकारी।",
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
      <body>{children}</body>
    </html>
  );
}
