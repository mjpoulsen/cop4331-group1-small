const http = require('http');
const app = require('./app');

// Get PORT from environment. If null, use 8080.
// TODO find a way to retrieve PORT from Environment Variable.
const port = process.env.PORT;

// app is a request handler.
const server = http.createServer(app);

server.listen(port);
console.log('Server started on port: ' + port);