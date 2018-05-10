'use strict'

var express = require('express')
var router = express.Router()
var ClimbingRoom = require('../models/climbingRoom')
var isAdmin = require('../functions/isAdmin.js')

// add a new climbing room
router.post('/climbingRoom/add', function (req, se) {
  if (!isAdmin(req.user.email)) {
    se.sendStatus(403)
    return
  }
  var newClimbingRoom = new ClimbingRoom(req.body)
  newClimbingRoom.save(function (err, user) {
    if (err) {
      return se.status(400).send({
        message: err
      })
    } else {
      se.sendStatus(201)
    }
  })
})

// get a climbing room with its title
router.get('/climbingRoom', function (req, se, next) {
  ClimbingRoom.findOne({
    title: req.query.title
  }, function (err, user) {
    if (err) {
      console.log(err)
      se.status(500).send(err)
      return err
    }
    if (!user) {
      return next({
        code: 404,
        success: false,
        message: 'No climbing room with this title found'
      })
    } else {
      se.send(user)
    }
  })
})

// delete a climbing room
router.delete('/climbingRoom/delete/:title', function (req, se) {
  if (!isAdmin(req.user.email)) {
    se.sendStatus(403)
    return
  }
  ClimbingRoom.findOne(
    { title: req.params.title })
    .exec(function (err, res) {
      if (err) {
        console.log(err)
        return se.status(500).send(err)
      }
      if (!res) {
        se.sendStatus(204)
      } else {
        res.remove()
        se.sendStatus(200)
      }
    })
})

module.exports = router
