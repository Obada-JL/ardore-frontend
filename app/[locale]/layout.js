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
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const messages = await getMessages(locale);
  
  if (!messages) {
    notFound();
  }

  return (
    <div className={`${notoSansArabic.variable}`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Navbar />
        {children}
        <Footer />
      </NextIntlClientProvider>
    </div>
  );
} 