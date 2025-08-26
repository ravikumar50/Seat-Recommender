// Fallback implementation without Turf.js to avoid ESM issues

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

function calculateFlightPath(start, end) {
  const lat1 = toRadians(start.lat);
  const lon1 = toRadians(start.lon);
  const lat2 = toRadians(end.lat);
  const lon2 = toRadians(end.lon);
  
  const deltaLon = lon2 - lon1;
  
  // Generate 64 points along the great circle route
  const npoints = 64;
  const path = [];
  
  for (let i = 0; i <= npoints; i++) {
    const f = i / npoints;
    
    // Spherical interpolation
    const a = Math.sin((1 - f) * deltaLon) / Math.sin(deltaLon);
    const b = Math.sin(f * deltaLon) / Math.sin(deltaLon);
    
    const x = a * Math.cos(lat1) * Math.cos(lon1) + b * Math.cos(lat2) * Math.cos(lon2);
    const y = a * Math.cos(lat1) * Math.sin(lon1) + b * Math.cos(lat2) * Math.sin(lon2);
    const z = a * Math.sin(lat1) + b * Math.sin(lat2);
    
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lon = Math.atan2(y, x);
    
    path.push({
      lat: toDegrees(lat),
      lon: toDegrees(lon)
    });
  }
  
  return path;
}

module.exports = { calculateFlightPath };