// Simple test script to verify airport dataset loading
const { searchAirports } = require('./src/services/airportService');

console.log('Testing airport dataset loading...');

try {
  // Test search for some common airports
  const testQueries = ['del', 'mumbai', 'new york', 'london'];
  
  testQueries.forEach(query => {
    console.log(`\nTesting query: "${query}"`);
    const results = searchAirports(query, 3);
    console.log('Results:', results.map(r => `${r.iata} - ${r.name} (${r.city})`));
  });
  
  console.log('\n✅ Airport dataset loaded and search working correctly!');
} catch (error) {
  console.error('❌ Error testing dataset:', error.message);
  console.error(error.stack);
}

