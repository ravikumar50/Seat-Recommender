const fs = require('fs');
const path = require('path');

// Load airports dataset from OpenFlights DAT format (airports.dat) placed in backend/data/
const datPath = path.join(__dirname, '..', 'data', 'airports.dat');
console.log('Loading airport dataset from:', datPath);

let fileContent;
try {
  fileContent = fs.readFileSync(datPath, 'utf8');
  console.log('Airport dataset loaded successfully, file size:', fileContent.length, 'bytes');
} catch (error) {
  console.error('Error loading airport dataset:', error.message);
  console.error('Current working directory:', process.cwd());
  console.error('Expected file path:', datPath);
  throw new Error(`Failed to load airport dataset: ${error.message}`);
}

// Parse DAT format: each line is a record with fields separated by commas
// Format: Airport ID, Name, City, Country, IATA, ICAO, Latitude, Longitude, Altitude, Timezone, DST, Tz database time zone, Type, Source
const lines = fileContent.split('\n').filter(line => line.trim());
console.log('Total lines in dataset:', lines.length);

const airports = lines.map((line, index) => {
  try {
    const fields = line.split(',').map(field => field.replace(/"/g, '').trim());
    return {
      id: fields[0],
      name: fields[1],
      city: fields[2],
      country: fields[3],
      iata: fields[4],
      icao: fields[5],
      lat: parseFloat(fields[6]),
      lon: parseFloat(fields[7]),
      altitude: parseFloat(fields[8]),
      timezone: fields[9],
      dst: fields[10],
      tz: fields[11],
      type: fields[12],
      source: fields[13]
    };
  } catch (error) {
    console.error(`Error parsing line ${index + 1}:`, line);
    return null;
  }
}).filter(a => a && a.iata && a.iata !== '\\N' && !isNaN(a.lat) && !isNaN(a.lon));

console.log('Parsed airports:', airports.length);
console.log('Sample airports:', airports.slice(0, 3).map(a => `${a.iata} - ${a.name} (${a.city})`));

module.exports = airports;
