import { MetadataRoute } from 'next'
import { trainDataSummary } from '@/data/trainDataSummary'
import { allStationNames } from '@/data/Stations/0_all_station_name'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.trainjatri.com' // Replace with your actual domain

  // Static routes
  const staticRoutes = [
    '',
    '/about-us',
    '/live-tracking',
    '/metro-rail',
    '/places-to-visit',
    '/station',
    '/trains'
  ]

  // Dynamic train routes - convert train names to URL-friendly format
  const trainRoutes = trainDataSummary.map(train => {
    const trainName = train.name.replace(/\s+/g, '-').toLowerCase()
    return {
      url: `${baseUrl}/trains/${trainName}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  })

  // Dynamic station routes
  const stationRoutes = allStationNames.map(stationName => ({
    url: `${baseUrl}/station/${stationName}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Static routes with higher priority
  const staticSitemapEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [
    ...staticSitemapEntries,
    ...trainRoutes,
    ...stationRoutes
  ]
}