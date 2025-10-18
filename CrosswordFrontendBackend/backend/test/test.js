const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testEndpoints() {
  console.log('Testing Crossword Backend API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test random endpoint
    console.log('\n2. Testing random crossword endpoint...');
    const randomResponse = await axios.get(`${BASE_URL}/api/crossword/random`);
    console.log('✅ Random crossword:', randomResponse.data);

    // Test random details endpoint
    console.log('\n3. Testing random crossword details...');
    const detailsResponse = await axios.get(`${BASE_URL}/api/crossword/random/details`);
    console.log('✅ Random details:', detailsResponse.data);

    // Test random clues endpoint
    console.log('\n4. Testing random crossword with clues...');
    const cluesResponse = await axios.get(`${BASE_URL}/api/crossword/random/clues`);
    console.log('✅ Random clues:', cluesResponse.data);

    console.log('\n🎉 All tests passed! Backend is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testEndpoints();
}

module.exports = testEndpoints;
