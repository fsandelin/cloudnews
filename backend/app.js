const http = require('http');
require('dotenv').config();

const hostname = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  const responseObject = { Hello: 'World' };
  res.end(JSON.stringify(responseObject));
});

server.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}/`);
});
