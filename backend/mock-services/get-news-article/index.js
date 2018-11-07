require('dotenv').config();

const express = require("express")
const moment = require("moment")

const app = express()

const article = {
    title: "Fake news",
    datetime: moment().toISOString(),
    lead: "This is fake news.",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    link: "http://www.google.se",
    img: "https://i.imgur.com/PpAEewg.jpg",
    region: "Uppsala"
}

// HTTP API
app.get("/api/article", (req, res) => {
    res.json(article)
})

const port = 8080

app.listen(port, () => {
  console.log(`get-news-article listening on ${port}`)
})


// Socket.io API
const io = require('socket.io')();
const wsPort = process.env.MOCK_PORT;

// Hook up the websocket server to the http server
io.on('connect', () => {
    console.log('Someone connected to this microservice');
  });
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // ms.disconnect();
  });
  socket.on('message', (message) => {
    console.log(`This is a microservice sily you!`);
  });
  setInterval(() => { socket.emit('news', article)}, 1000);
});

io.listen(wsPort);
// const { services } = JSON.parse(Buffer.from(query_params.services, 'base64').toString().trim());
  