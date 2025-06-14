import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Add this to fix the cross-origin warning in development
  allowedDevOrigins: ['https://ardoreperfume.com'], // or whatever domain/IP you're using

  // other config options (if any)
};

export default withNextIntl(nextConfig);
