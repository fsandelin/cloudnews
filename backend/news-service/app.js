require('dotenv').config();
const express = require('express');
const routes = require('./src/Routes');

const app = express();

app.use('/api', routes);
app.listen(process.env.PORT, () => {
  console.log('Listenning on 3030');
});
