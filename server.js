// Imports and constants.
const http = require('http');
const app = require('./app'); // Informs server of app.js

// Get PORT from environment. If null, use 8080.
const port = process.env.PORT || 8080;

// Create a server and use app as the request handler.
const server = http.createServer(app);

server.listen(port);
console.log('Server started on port: ' + port);