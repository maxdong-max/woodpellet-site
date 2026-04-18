/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  i18n: {
    locales: ['en', 'zh', 'id'],
    defaultLocale: 'en',
  },
}

module.exports = nextConfig