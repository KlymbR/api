'use strict'

var express = require('express')
var app = express()
var port = process.env.PORT || 3001
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var jsonwebtoken = require('jsonwebtoken')

// connect to database
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mobile')
mongoose.connection.on('error', (err) => {
  console.error(err)
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.')
  process.exit()
})

// configuration of the server
app.set('port', process.env.PORT || port)
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(function (req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function (err, decode) {
      if (err) req.user = undefined
      req.user = decode
      next()
    })
  } else {
    req.user = undefined
    next()
  }
})

// routes
app.use('/', require('./routes/user'))
app.use('/', require('./routes/path'))

// basic 404 handler
app.use((req, res) => {
  res.status(404).send({url: req.originalUrl + ' Not Found'})
})

// basic error handler
app.use((err, req, res, next) => {
  console.error()
  res.status(500).send(err.response || 'Something broke!')
})

// start the server
if (module === require.main) {
  const server = app.listen(app.get('port'), () => {
    const port = server.address().port
    console.log(`App listening on port ${port}`)
  })
}

module.exports = app
