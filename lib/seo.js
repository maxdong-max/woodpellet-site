// SEO Configuration
// Auto-generated for GEO optimization (Europe, Southeast Asia markets)

export const seoConfig = {
  defaultTitle: 'Macreat - Biomass Pellet Machine Manufacturer | 60 Years Experience',
  defaultDescription: 'Macreat is a leading manufacturer and supplier of pellet machines since 1960. We provide biomass pellet production lines, wood pellet machines, and complete pellet plant solutions for global markets.',
  defaultKeywords: [
    'biomass pellet machine',
    'wood pellet machine',
    'pellet mill',
    'pellet production line',
    'pellet machine manufacturer',
    'biomass energy equipment',
    'feed pellet machine',
    'wood chipper',
    'hammer mill',
    'pellet dryer',
    'cooling machine'
  ],
  geoTargeting: {
    primary: ['US', 'UK', 'DE', 'FR', 'IT', 'ES', 'NL', 'PL', 'ID', 'TH', 'VN', 'MY', 'PH'],
    localizedKeywords: {
      en: {
        US: ['biomass pellet machine USA', 'wood pellet equipment supplier', 'pellet mill manufacturer America'],
        UK: ['biomass pellet machine UK', 'wood pellet equipment Europe', 'pellet production line UK'],
        ID: ['mesin pelet biomass Indonesia', 'mesin pelet kayu', 'pabrik pelet Indonesia'],
        TH: ['เครื่องทำอัตรากำลังการผลิตไบโอแมส', 'เครื่องทำอัตรากำลังการผลิตไม้', 'โรงงานเพลเลตไทย'],
        VN: ['máy viên nén sinh khối', 'máy viên nén gỗ', 'nhà máy viên nén Việt Nam'],
      }
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Macreat',
  },
  twitter: {
    cardType: 'summary_large_image',
  },
  alternateLanguages: {
    en: '/',
    zh: '/zh',
    id: '/id',
  }
};

// Get localized SEO data
export function getLocalizedSeo(locale, country = 'US') {
  const localizedKeywords = seoConfig.geoTargeting.localizedKeywords[locale]?.[country] || [];
  return {
    keywords: [...seoConfig.defaultKeywords, ...localizedKeywords],
  };
}

// Sitemap configuration
export const sitemapConfig = {
  baseUrl: 'https://workspace-shrimp-publish.vercel.app',
  routes: [
    '/',
    '/about',
    '/solution',
    '/machine/products',
    '/case',
    '/contact',
    '/become-our-dealer',
    '/service',
    '/news',
  ],
  alternateRoutes: {
    '/zh': { zh: '/', en: '/' },
    '/id': { id: '/', en: '/' },
  }
};

// Robots.txt configuration
export const robotsConfig = {
  rules: [
    { userAgent: '*', allow: '/' },
  ],
  sitemap: 'https://workspace-shrimp-publish.vercel.app/sitemap.xml',
  host: 'https://workspace-shrimp-publish.vercel.app',
};