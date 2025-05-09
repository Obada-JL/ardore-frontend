import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ardore Perfume",
  description: "Explore the world of Ardore Perfume, where luxury meets elegance. Discover our exquisite collection of fragrances designed to elevate your sense of style.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="vsc-initialized">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased vsc-initialized`}
      >
        {children}
      </body>
    </html>
  );
}
