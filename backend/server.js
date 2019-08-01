const five = require('johnny-five');
const http = require('http');

const board = new five.Board();
let led;
board.on('ready', function() {
  led = new five.Led(13);
  // led.strobe(1000);
});

const hostname = '127.0.0.1';
const port = 9001;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end('oO\n');

  const paramsList = req.url.split('?')[1].split('&');
  const params = {};
  paramsList.forEach(string => {
    const param = string.split('=');
    params[param[0]] = Number.parseInt(param[1]);
  });
  console.log(params);
  console.log(params[1]);
});

server.listen(port, hostname, () => {
  console.log(`Server http://${hostname}:${port}/`);
});
