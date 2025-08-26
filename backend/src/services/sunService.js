const SunCalc = require('suncalc');

// Calculate great circle distance between two points (in km)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate bearing between two points (in degrees)
function calculateBearing(lat1, lon1, lat2, lon2) {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360; // Normalize to 0-360
}

// Calculate midpoint between two coordinates
function calculateMidpoint(lat1, lon1, lat2, lon2) {
  const lat1Rad = lat1 * Math.PI / 180;
  const lon1Rad = lon1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const lon2Rad = lon2 * Math.PI / 180;
  
  const Bx = Math.cos(lat2Rad) * Math.cos(lon2Rad - lon1Rad);
  const By = Math.cos(lat2Rad) * Math.sin(lon2Rad - lon1Rad);
  
  const midLat = Math.atan2(
    Math.sin(lat1Rad) + Math.sin(lat2Rad),
    Math.sqrt((Math.cos(lat1Rad) + Bx) * (Math.cos(lat1Rad) + Bx) + By * By)
  );
  
  const midLon = lon1Rad + Math.atan2(By, Math.cos(lat1Rad) + Bx);
  
  return {
    lat: midLat * 180 / Math.PI,
    lon: midLon * 180 / Math.PI
  };
}

// Calculate flight path information
function calculateFlightPath(departure, arrival) {
  const distance = calculateDistance(departure.lat, departure.lon, arrival.lat, arrival.lon);
  const bearing = calculateBearing(departure.lat, departure.lon, arrival.lat, arrival.lon);
  const midpoint = calculateMidpoint(departure.lat, departure.lon, arrival.lat, arrival.lon);
  // Estimate flight duration assuming average speed 900 km/h
  const durationMinutes = Math.round((distance / 900) * 60);
  
  return {
    distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
    bearing: Math.round(bearing * 10) / 10,
    durationMinutes,
    midpoint
  };
}

// Generate detailed flight path coordinates for mapping
function generateFlightPathCoordinates(departure, arrival) {
  const coordinates = [];
  const steps = 50; // Number of points along the path
  
  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    const lat = departure.lat + (arrival.lat - departure.lat) * fraction;
    const lon = departure.lon + (arrival.lon - departure.lon) * fraction;
    coordinates.push([lat, lon]);
  }
  
  return coordinates;
}

// Calculate sun position for a given date, time, and location
function calculateSunPosition(flightDate, flightTime, location) {
  const dateTime = new Date(`${flightDate}T${flightTime}`);
  const sunPosition = SunCalc.getPosition(dateTime, location.lat, location.lon);
  
  // Convert azimuth from radians to degrees and normalize to 0-360
  let azimuth = (sunPosition.azimuth * 180 / Math.PI + 360) % 360;
  
  // Convert altitude from radians to degrees
  const altitude = sunPosition.altitude * 180 / Math.PI;
  
  // Determine if it's daytime
  const isDaytime = altitude > 0;
  
  return {
    azimuth: Math.round(azimuth * 10) / 10,
    altitude: Math.round(altitude * 10) / 10,
    isDaytime
  };
}

// Determine the best scenic seat based on flight direction and sun position
function determineBestSeat(flightPath, sunPosition) {
  if (!sunPosition.isDaytime) {
    return {
      seat: 'Either',
      reason: 'Night flight - no scenic advantage for either side',
      confidence: 'low'
    };
  }
  
  const flightBearing = flightPath.bearing;
  const sunAzimuth = sunPosition.azimuth;
  
  // Calculate the relative angle between flight direction and sun position
  let relativeAngle = Math.abs(flightBearing - sunAzimuth);
  if (relativeAngle > 180) {
    relativeAngle = 360 - relativeAngle;
  }
  
  // Determine which side of the plane will face the sun
  let leftFacesSun = false;
  let rightFacesSun = false;
  
  // Check if left side faces sun (flight bearing + 90 degrees)
  const leftBearing = (flightBearing + 90) % 360;
  let leftAngle = Math.abs(leftBearing - sunAzimuth);
  if (leftAngle > 180) leftAngle = 360 - leftAngle;
  
  // Check if right side faces sun (flight bearing - 90 degrees)
  const rightBearing = (flightBearing - 90 + 360) % 360;
  let rightAngle = Math.abs(rightBearing - sunAzimuth);
  if (rightAngle > 180) rightAngle = 360 - rightAngle;
  
  if (leftAngle < rightAngle) {
    leftFacesSun = true;
  } else {
    rightFacesSun = true;
  }
  
  // Determine the best seat based on sun position and time of day
  let seat, reason, confidence;
  
  if (sunPosition.altitude > 45) {
    // High sun - overhead lighting
    if (leftFacesSun) {
      seat = 'Left Window';
      reason = 'Left side faces the sun for optimal overhead lighting and scenic views';
      confidence = 'high';
    } else {
      seat = 'Right Window';
      reason = 'Right side faces the sun for optimal overhead lighting and scenic views';
      confidence = 'high';
    }
  } else if (sunPosition.altitude > 15) {
    // Medium sun - good for side lighting
    if (leftFacesSun) {
      seat = 'Left Window';
      reason = 'Left side faces the sun for beautiful side lighting and enhanced scenic views';
      confidence = 'medium';
    } else {
      seat = 'Right Window';
      reason = 'Right side faces the sun for beautiful side lighting and enhanced scenic views';
      confidence = 'medium';
    }
  } else {
    // Low sun - sunrise/sunset conditions
    if (leftFacesSun) {
      seat = 'Left Window';
      reason = 'Left side faces the sun for spectacular sunrise/sunset views';
      confidence = 'high';
    } else {
      seat = 'Right Window';
      reason = 'Right side faces the sun for spectacular sunrise/sunset views';
      confidence = 'high';
    }
  }
  
  return { seat, reason, confidence };
}

// Main function to calculate sun positions along flight path
function calculateSunPositions(departure, arrival, datetime) {
  const flightPath = calculateFlightPath(departure, arrival);
  const pathCoordinates = generateFlightPathCoordinates(departure, arrival);
  
  // Calculate sun position at midpoint for main recommendation
  const midpointSun = calculateSunPosition(datetime.split('T')[0], datetime.split('T')[1], flightPath.midpoint);
  const seatRecommendation = determineBestSeat(flightPath, midpointSun);
  
  // Calculate sun positions along the path for mapping
  const sunPositions = pathCoordinates.map(coord => {
    const location = { lat: coord[0], lon: coord[1] };
    const sunPos = calculateSunPosition(datetime.split('T')[0], datetime.split('T')[1], location);
    return {
      lat: coord[0],
      lon: coord[1],
      azimuth: sunPos.azimuth,
      altitude: sunPos.altitude,
      isDaytime: sunPos.isDaytime
    };
  });
  
  return {
    recommendation: seatRecommendation.seat.toLowerCase().includes('left') ? 'left' : 'right',
    reason: seatRecommendation.reason,
    confidence: seatRecommendation.confidence,
    flightInfo: {
      distance: flightPath.distance,
      bearing: flightPath.bearing,
      duration: flightPath.durationMinutes
    },
    sunInfo: midpointSun,
    positions: sunPositions
  };
}

module.exports = {
  calculateFlightPath,
  generateFlightPathCoordinates,
  calculateSunPosition,
  determineBestSeat,
  calculateSunPositions
};
