import type { Metadata, Viewport } from "next";
import "./globals.css";
import "../styles/globals.scss";

export const metadata: Metadata = {
  title: "Weather App - Current Weather Information",
  description: "Get current weather information for any city around the world. Beautiful, responsive design with light and dark themes.",
  keywords: "weather, forecast, temperature, humidity, climate, city weather",
  authors: [{ name: "Weather App" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="light">
        {children}
      </body>
    </html>
  );
}
