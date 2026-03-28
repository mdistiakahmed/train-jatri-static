import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.trainjatri.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [], // Add any paths you want to disallow
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}