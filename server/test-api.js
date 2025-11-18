/**
 * Simple test script for API endpoints
 * 
 * Usage:
 * 1. Start the server: npm run dev
 * 2. Get a Firebase ID token from your frontend app
 * 3. Set TOKEN environment variable: export TOKEN="your-firebase-id-token"
 * 4. Run: node test-api.js
 */

require('dotenv').config();
const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const TOKEN = process.env.TOKEN || '';

if (!TOKEN) {
  console.error('❌ Please set TOKEN environment variable with your Firebase ID token');
  console.log('Example: export TOKEN="your-token-here" node test-api.js');
  process.exit(1);
}

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function testEndpoint(method, path, body = null) {
  try {
    const options = {
      method,
      headers,
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${path}`, options);
    const data = await response.json();
    
    console.log(`\n${method} ${path}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error testing ${method} ${path}:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Testing Roomify API Endpoints\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Token: ${TOKEN.substring(0, 20)}...\n`);

  // Health check
  await testEndpoint('GET', '/health');

  // Auth - Login
  await testEndpoint('POST', '/api/auth/login');

  // Users - Get current user (using token's uid)
  // Note: You'll need to extract userId from the token or login response
  // For now, we'll skip this and test room endpoints

  // Rooms - Get all rooms
  await testEndpoint('GET', '/api/rooms');

  // Rooms - Get rooms with filters
  await testEndpoint('GET', '/api/rooms?roomType=Living Room&limit=5');

  // Rooms - Create a test room
  const newRoom = await testEndpoint('POST', '/api/rooms', {
    title: 'Test Modern Living Room',
    uri: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200',
    roomType: 'Living Room',
    color: 'Neutral',
    style: 'Modern',
    description: 'A beautiful test room created via API',
  });

  // If room was created, test getting it by ID
  if (newRoom && newRoom.data && newRoom.data.id) {
    await testEndpoint('GET', `/api/rooms/${newRoom.data.id}`);
  }

  console.log('\n✅ Tests completed!');
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or install node-fetch');
  console.log('Alternatively, use curl commands from the README.md');
} else {
  runTests();
}

