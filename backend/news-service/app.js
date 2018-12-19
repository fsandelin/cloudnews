require('dotenv').config();
const express = require('express');
const parser = require('body-parser');
const routes = require('./src/Routes');

const app = express();

app.use(parser.json({ extended: true, limit: '1mb' }));
app.use('/api', routes);

app.listen(process.env.PORT, () => {
  console.log('Listening on ', process.env.PORT);
});
