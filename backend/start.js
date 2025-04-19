try {
  require('./server.js');
} catch (error) {
  console.error('Error starting server:');
  console.error(error.stack);
  process.exit(1);
} 