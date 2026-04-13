import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Carbon Footprint Tracker | AI-Powered",
  description:
    "Track and visualize your carbon footprint in real-time. Get AI-powered insights from Google Gemini. See how your lifestyle impacts the Earth with stunning 3D visuals.",
  keywords: [
    "carbon footprint",
    "CO2 tracker",
    "environmental impact",
    "sustainability",
    "AI insights",
    "climate change",
  ],
  openGraph: {
    title: "Carbon Footprint Tracker",
    description: "AI-powered carbon footprint simulator with Earth visualization",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
