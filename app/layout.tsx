import type { Metadata } from "next";
import "./globals.css";
import InstallApp from "./install-app";

export const metadata: Metadata = {
  title: "FieldMate",
  description: "Your personal sales and territory workspace.",
  appleWebApp: { capable: true, title: "FieldMate", statusBarStyle: "default" },
  icons: {
    apple: "/icon-192.png",
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head><link rel="manifest" href="/manifest.webmanifest" crossOrigin="use-credentials"/><meta name="theme-color" content="#21775c"/></head>
      <body className="antialiased">{children}<InstallApp/></body>
    </html>
  );
}
