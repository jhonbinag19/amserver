const http = require('http');

// Configuration
const config = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/test/health',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Create the request
const req = http.request(config, (res) => {
  let data = '';

  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers, null, 2)}`);

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const parsedData = JSON.parse(data);
      console.log('Response Body:', JSON.stringify(parsedData, null, 2));
    } catch (e) {
      console.error('Error parsing response:', e.message);
      console.log('Raw response:', data);
    }
    console.log('No more data in response.');
  });
});

// Handle request errors
req.on('error', (e) => {
  console.error(`Request error: ${e.message}`);
  if (e.code === 'ECONNREFUSED') {
    console.error('Connection refused. Is the server running?');
  }
});

// Handle timeout
req.on('timeout', () => {
  console.error('Request timeout');
  req.destroy();
});

// Set timeout
req.setTimeout(5000);

// Send the request
req.end(); 