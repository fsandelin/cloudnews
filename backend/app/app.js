const express = require('express')
const app = express()
const port = 5000

app.use(express.static('public'))

app.listen(port, function () {
  console.log('App running on port ' + port + '!')
})
