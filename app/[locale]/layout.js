import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { Noto_Sans_Arabic } from "next/font/google";
import path from 'path';
import { promises as fs } from 'fs';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  title: "Ardore Perfume",
  description: "Explore the world of Ardore Perfume, where luxury meets elegance. Discover our exquisite collection of fragrances designed to elevate your sense of style.",
};

async function getMessages(locale) {
  // Handle undefined locale case
  const safeLocale = locale || 'en';
  
  try {
    const messagesPath = path.join(process.cwd(), 'messages', safeLocale, 'common.json');
    const messagesJSON = await fs.readFile(messagesPath, 'utf8');
    return JSON.parse(messagesJSON);
  } catch (error) {
    console.error(`Error loading messages for locale ${safeLocale}:`, error);
    
    // Try fallback to English if we weren't already trying to load English
    if (safeLocale !== 'en') {
      try {
        const fallbackPath = path.join(process.cwd(), 'messages', 'en', 'common.json');
        const fallbackJSON = await fs.readFile(fallbackPath, 'utf8');
        return JSON.parse(fallbackJSON);
      } catch (fallbackError) {
        console.error('Failed to load fallback messages:', fallbackError);
      }
    }
    
    // Return null to trigger notFound in the worst case
    return null;
  }
}

export default async function LocaleLayout({ children, params }) {
  // Extract locale safely from params, might be undefined during build
  const locale = params?.locale || 'en';
  const messages = await getMessages(locale);
  
  if (!messages) {
    notFound();
  }

  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} className="vsc-initialized">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} antialiased vsc-initialized`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
        <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 