var express = require('express')
var app = express()
var port = 5000

app.use(express.static('public'))

app.listen(port, function () {
  console.log('App running on port ' + port + '!')
})
