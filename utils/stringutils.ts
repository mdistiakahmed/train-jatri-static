// Helper function to format station name for URL
export function formatStationNameForUrl(stationName: string): string {
  return stationName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/-+/g, '-');
}

// Helper function to create filename from route name
export function createFilenameFromRoute(routeName: string): string {
  const [from, to] = routeName.split(' - ');
  return `${formatStationNameForUrl(from)}-to-${formatStationNameForUrl(to)}`;
}