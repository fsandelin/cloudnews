require('dotenv').config();
const io = require('socket.io-client');
const readline = require('readline');

const hostname = process.env.WS_HOST;
const port = process.env.WS_PORT;
const socket = new io(`http://${hostname}:${port}`);

socket.on('connect', () => {
  console.log('Has now connected to the node middleware');
  readStuffs();
});

function readStuffs() {
  const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  r1.question('Input something to send to server: ', (answer) => {
    console.log(`Your message is: ${answer}`);
    socket.emit('message', `${answer}`);
    r1.close();
    readStuffs();
  });
}
