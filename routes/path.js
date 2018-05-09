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
router.get('/path/all', function (req, se, next) {
  axios.get(url)
    .then(function (res) {
      let json = CircularJSON.stringify(res)
      let data = CircularJSON.parse(json).data
      se.status(200).json({
        success: true,
        result: data
      })
    })
    .catch(function (err) {
      return next(err)
    })
})

// get path with its id
router.get('/path', function (req, se, next) {
  if (req.query.path_id === undefined)
    return next({
      code: 400,
      success: false,
      message: "query path_id missing"
    })
  let request = url + '/path?path_id=' + req.query.path_id
  axios.get(request)
    .then(function (res) {
      let json = CircularJSON.stringify(res)
      let data = CircularJSON.parse(json).data
      se.status(200).json({
        success: true,
        result: data
      })
    })
    .catch(function (err) {
      return next(err)
    })
})

// change the free state of a path
router.post('/path/free', function (req, se, next) {
  if (req.body.path_id === undefined || req.body.path_free === undefined)
    return next({
      code: 400,
      success: false,
      message: "query path_id or path_free missing"
    })
  let request = url + '/path/free'
  axios.post(request, {
    path_id: req.body.path_id,
    path_free: req.body.path_free
  })
    .then(function (res) {
      let json = CircularJSON.stringify(res)
      let data = CircularJSON.parse(json).data
      se.status(200).json({
        success: true,
        result: data
      })
    })
    .catch(function (err) {
      return next(err)
    })
})

module.exports = router
