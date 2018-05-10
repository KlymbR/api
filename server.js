'use strict'

var express = require('express')
var app = express()
var port = process.env.PORT || 3001
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
const morgan = require('morgan')
var jsonwebtoken = require('jsonwebtoken')

const config = require('./config')

// connect to database
mongoose.Promise = global.Promise
mongoose.connect(config.database || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/klymbr')
mongoose.connection.on('error', (err) => {
  console.error(err)
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.')
  process.exit()
})

// configuration of the server
app.set('port', process.env.PORT || port)
app.set('superSecret', config.secret)
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(morgan('dev'))

// Add headers
router.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Pass to next layer of middleware
  next();
});

router.options("/*", function (req, res) {

  // Request methods you wish to allow

  // Request headers you wish to allow
  //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  //res.setHeader('Access-Control-Allow-Credentials', true);
  res.sendStatus(200);
});

app.use('/', require('./routes/user').bAuth)

app.use(function (req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], app.get('superSecret'), function (err, decode) {
      if (err) {
        return next(err)
      } else {
        req.user = decode
        next()
      }
    })
  } else {
    req.user = undefined
    return next({
      success: false,
      message: 'No token provided.'
    })
  }
})

// routes
app.use('/', require('./routes/user').aAuth)
app.use('/', require('./routes/path'))
app.use('/', require('./routes/climbingRoom'))
app.use('/', require('./routes/stat'))

// basic 404 handler
app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' Not Found' })
})

// basic error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.code || 500).json({
    success: false,
    message: err.message || 'Something broke!'
  })
})

// start the server
if (module === require.main) {
  const server = app.listen(app.get('port'), () => {
    const port = server.address().port
    console.log(`App listening on port ${port}`)
  })
}

module.exports = app
