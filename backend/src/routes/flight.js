const express = require('express');
const router = express.Router();
const { getAirportCoordinates, searchAirports } = require('../services/airportService');
const { calculateFlightPath } = require('../services/flightPathService');
const { calculateSunPositions } = require('../services/sunService');

// Autocomplete endpoint
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const limit = parseInt(req.query.limit || '6', 10);
    console.log('API /search endpoint called with query:', q, 'limit:', limit);
    
    const results = await searchAirports(q, limit);
    console.log('Returning results:', results.length, 'airports');
    
    res.json({ results });
  } catch (error) {
    console.error('Error in /search endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// Main flight recommendation endpoint
router.post('/', async (req, res) => {
  try {
    const { departure, arrival, datetime } = req.body;
    if (!departure || !arrival || !datetime) {
      return res.status(400).json({ error: 'departure, arrival and datetime are required' });
    }
    const depCoords = await getAirportCoordinates(departure);
    const arrCoords = await getAirportCoordinates(arrival);
    const sunData = calculateSunPositions(depCoords, arrCoords, datetime);
    res.json({ 
      recommendation: sunData.recommendation, 
      reason: sunData.reason,
      confidence: sunData.confidence,
      flightInfo: sunData.flightInfo,
      sunInfo: sunData.sunInfo,
      path: sunData.positions, 
      sunPositions: sunData.positions 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint for AWS load balancer
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

module.exports = router;
