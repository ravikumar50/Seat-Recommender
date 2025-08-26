const NodeCache = require('node-cache');
const airports = require('./airportDataset');

// cache for 24 hours
const cache = new NodeCache({ stdTTL: 86400 });

function getAirportCoordinates(query) {
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid airport query');
  }
  const q = query.trim();
  const cacheKey = `airport:${q.toUpperCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // Determine if input is an IATA code (3 letters) or city name
  const isIata = /^[A-Za-z]{3}$/.test(q);
  let match;
  if (isIata) {
    match = airports.find(a => a.iata.toUpperCase() === q.toUpperCase());
  } else {
    // fuzzy match by city name (case-insensitive substring)
    match = airports.find(a => a.city && a.city.toLowerCase().includes(q.toLowerCase()));
  }
  if (!match) {
    throw new Error(`Airport not found for: ${query}`);
  }

  const coords = { lat: match.lat, lon: match.lon };
  cache.set(cacheKey, coords);
  return coords;
}

// Airport search for autocomplete from local dataset
function searchAirports(query, limit = 6) {
  const q = (query || '').trim();
  console.log('Searching airports for query:', q);
  
  if (q.length < 1) return [];
  
  const cacheKey = `search:${q.toLowerCase()}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('Returning cached results:', cached.length, 'airports');
    return cached;
  }

  console.log('Total airports available:', airports.length);
  
  const suggestions = airports
    .filter(a => 
      (a.iata && a.iata.toLowerCase().startsWith(q.toLowerCase())) ||
      (a.city && a.city.toLowerCase().includes(q.toLowerCase())) ||
      (a.name && a.name.toLowerCase().includes(q.toLowerCase()))
    )
    .slice(0, limit)
    .map(a => ({
      name: a.name,
      city: a.city,
      country: a.country,
      iata: a.iata,
      lat: a.lat,
      lon: a.lon,
    }));

  console.log('Found suggestions:', suggestions.length);
  cache.set(cacheKey, suggestions);
  return suggestions;
}

module.exports = { getAirportCoordinates, searchAirports };
