'use strict'

var express = require('express')
var router = express.Router()
const axios = require('axios')
const CircularJSON = require('circular-json')

// configuration of axios
const holdsUrl = 'http://localhost'
const holdsPort = '3000'
let url = holdsUrl + ':' + holdsPort

// get all paths
router.get('/path/all', function (req, se) {
  if (!req.user) {
    return se.status(401).json({ message: 'Unauthorized user!' })
  }
  axios.get(url)
    .then(function (res) {
      let json = CircularJSON.stringify(res)
      let data = CircularJSON.parse(json).data
      se.send(data)
    })
    .catch(function (err) {
      console.log(err)
      se.status(500).send(err)
      return err
    })
})

// get path with its id
router.get('/path', function (req, se) {
  if (!req.user) {
    return se.status(401).json({ message: 'Unauthorized user!' })
  }
  if (req.query.path_id === undefined) {
    se.sendStatus(400)
    return
  }
  let request = url + '/path?path_id=' + req.query.path_id
  axios.get(request)
    .then(function (res) {
      let json = CircularJSON.stringify(res)
      let data = CircularJSON.parse(json).data
      se.send(data)
    })
    .catch(function (err) {
      console.log(err)
      se.status(500).send(err)
      return err
    })
})

// change the free state of a path
router.post('/path/free', function (req, se) {
  if (!req.user) {
    return se.status(401).json({ message: 'Unauthorized user!' })
  }
  if (req.body.path_id === undefined || req.body.path_free === undefined) {
    se.sendStatus(400)
    return
  }
  let request = url + '/path/free'
  axios.post(request, {
    path_id: req.body.path_id,
    path_free: req.body.path_free
  })
    .then(function (res) {
      let json = CircularJSON.stringify(res)
      let data = CircularJSON.parse(json).data
      se.send(data)
    })
    .catch(function (err) {
      console.log(err)
      se.status(500).send(err)
      return err
    })
})

module.exports = router
