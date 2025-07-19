import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { Noto_Sans_Arabic } from "next/font/google";
import path from 'path';
import { promises as fs } from 'fs';
import Navbar from "../components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "../context/AuthContext";
import { OrderProvider } from "../context/OrderContext";
import { FavoritesProvider } from "../context/FavoritesContext";

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
  try {
    const messageFile = path.join(process.cwd(), 'messages', `${locale}`, 'common.json');
    const messages = await fs.readFile(messageFile, 'utf-8');
    return JSON.parse(messages);
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    
    // Fallback to Turkish if the requested locale is not available
    if (locale !== 'tr') {
      try {
        const fallbackFile = path.join(process.cwd(), 'messages', 'tr', 'common.json');
        const fallbackMessages = await fs.readFile(fallbackFile, 'utf-8');
        return JSON.parse(fallbackMessages);
      } catch (fallbackError) {
        console.error('Error loading fallback messages:', fallbackError);
        return null;
      }
    }
    
    return null;
  }
}

export default async function LocaleLayout({ children, params }) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'tr';
  const messages = await getMessages(locale);
  
  if (!messages) {
    notFound();
  }

  return (
    <div className={`${notoSansArabic.variable}`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <AuthProvider>
          <FavoritesProvider>
            <OrderProvider>
              <Navbar />
              {children}
              <Footer />
            </OrderProvider>
          </FavoritesProvider>
        </AuthProvider>
      </NextIntlClientProvider>
    </div>
  );
} 