// Looks up a US zip code's coordinates using Zippopotam.us — a free, no-key
// public API. Returns null if the zip is invalid or the lookup fails, so
// callers should handle that gracefully rather than crashing the page.
export async function geocodeZip(zip: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${encodeURIComponent(zip)}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()
    const place = data?.places?.[0]
    if (!place) return null
    return { lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) }
  } catch {
    return null
  }
}

// Haversine formula — great-circle distance between two points, in miles.
export function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8 // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
