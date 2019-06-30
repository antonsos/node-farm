const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  res.end('Hello form the server!');
});

server.listen(3000, 'localhost', () => {
  console.log('Server starting in 3000 port');
});
