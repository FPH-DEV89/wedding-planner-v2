import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

const inter = { variable: "font-sans" };
const playfair = { variable: "font-serif" };


export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  title: "Wedding Plan - Votre organisateur de mariage",
  description: "L'outil ultime pour planifier votre mariage parfait.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wedding Plan",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-background antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
