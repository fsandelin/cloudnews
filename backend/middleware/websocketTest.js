require('dotenv').config();
const io = require('socket.io-client');
const readline = require('readline');

const hostname = process.env.WS_HOST;
const port = process.env.WS_PORT;
const services = '{"services": ["svt", "tt"]}';
const bServices = Buffer.from(services).toString('base64');
const socket = new io(`http://${hostname}:${port}/?services=${bServices}`);

function readStuffs() {
  const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  r1.question('Input something to send to server: ', (answer) => {
    console.log(`Your message is: ${answer}`);
    socket.emit('timespan_request', `${answer}`);
    r1.close();
    readStuffs();
  });
}

socket.on('connect', () => {
  console.log('Has now connected to the node middleware');
  readStuffs();
});
socket.on('news', (data) => {
  console.log(`Has received the following news items: ${JSON.stringify(data)}`);
});
socket.on('news_list', (data) => {
  console.log(`Has received the following news items: ${data[0].title}`);
});
socket.on('error', (data) => {
  console.log(data);
});
socket.on('warning', (data) => {
  console.log(data);
});
socket.on('complete_request', (message) => {
  console.log(`Getting the following articles since I sent request ${message.requestId}:`);
  console.log(message.articles);
});
