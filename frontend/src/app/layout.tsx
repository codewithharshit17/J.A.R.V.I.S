import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#02040a",
};

export const metadata: Metadata = {
  title: "J.A.R.V.I.S. // Neural Operating Environment",
  description:
    "Next-generation cinematic AI consciousness interface. A holographic neural operating system powered by advanced artificial intelligence.",
  keywords: [
    "JARVIS",
    "AI",
    "artificial intelligence",
    "holographic interface",
    "neural operating system",
    "Stark OS",
  ],
  authors: [{ name: "Stark Industries" }],
  robots: "index, follow",
  openGraph: {
    title: "J.A.R.V.I.S. // Neural Operating Environment",
    description:
      "Next-generation cinematic AI consciousness interface.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col overflow-x-hidden overscroll-none">
        {children}
      </body>
    </html>
  );
}
