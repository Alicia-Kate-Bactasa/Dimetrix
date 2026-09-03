/**
 * Duplicate Report Detection Utility
 * 
 * Calculates distance between coordinates and detects duplicate outage reports
 * within a specified radius (default 2 km) and timeframe (default 12 hours) in the same barangay/area.
 */

// Calculate Haversine distance in kilometers between two lat/lng points
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Infinity;
  
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds potential duplicate active/ongoing incidents matching area, barangay, or coordinate proximity.
 */
export function findDuplicateIncident(newReport, existingIncidents = [], radiusKm = 2.0, maxAgeHours = 12) {
  if (!newReport || !existingIncidents || existingIncidents.length === 0) return null;

  const now = Date.now();
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;

  for (const inc of existingIncidents) {
    // Only check active or ongoing incidents
    if (inc.status === "restored") continue;

    // Check timeframe (created within maxAgeHours)
    const incTime = new Date(inc.start_time || inc.created_date).getTime();
    if (isNaN(incTime) || now - incTime > maxAgeMs) continue;

    // Check type match (or both are outage types)
    const sameType = inc.type === newReport.type || 
      (["power_outage", "scheduled_brownout", "exploded_transformer"].includes(inc.type) &&
       ["power_outage", "scheduled_brownout", "exploded_transformer"].includes(newReport.type));

    if (!sameType) continue;

    // Check area / barangay exact match
    const sameArea = (inc.area && newReport.area && inc.area.toLowerCase() === newReport.area.toLowerCase());
    const sameBarangay = (inc.barangay && newReport.barangay && inc.barangay.toLowerCase() === newReport.barangay.toLowerCase());

    // Check geographic proximity
    const dist = calculateDistanceKm(
      newReport.latitude ?? newReport.lat,
      newReport.longitude ?? newReport.lng,
      inc.latitude ?? inc.lat,
      inc.longitude ?? inc.lng
    );

    const isClose = dist <= radiusKm;

    if (sameBarangay || (sameArea && isClose) || dist <= 1.0) {
      return {
        ...inc,
        distanceKm: isFinite(dist) ? Number(dist.toFixed(2)) : null
      };
    }
  }

  return null;
}
