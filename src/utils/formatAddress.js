/** Build a short "Place, City" label from Nominatim reverse-geocode JSON. */
export function formatShortAddressFromNominatim(data) {
  if (!data) return "";

  const a = data.address;
  if (!a) {
    const parts = (data.display_name || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]}, ${parts[1]}`;
    }
    return parts[0] || "";
  }

  const placeName =
    a.amenity ||
    a.building ||
    a.shop ||
    a.tourism ||
    a.leisure ||
    a.office ||
    a.road ||
    a.neighbourhood ||
    a.suburb ||
    a.quarter ||
    a.hamlet ||
    "";

  const city =
    a.city ||
    a.town ||
    a.village ||
    a.municipality ||
    a.state_district ||
    "";

  if (placeName && city) {
    const placeLower = placeName.toLowerCase();
    const cityLower = city.toLowerCase();
    if (placeLower.includes(cityLower)) return placeName;
    return `${placeName}, ${city}`;
  }

  return placeName || city || "";
}

export async function reverseGeocodeShort(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    return formatShortAddressFromNominatim(data);
  } catch {
    return "";
  }
}
