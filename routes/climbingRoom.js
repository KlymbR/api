'use strict'

var express = require('express')
var router = express.Router()
var ClimbingRoom = require('../models/climbingRoom')
var isAdmin = require('../functions/isAdmin.js')

// add a new climbing room
router.post('/climbingRoom/add', function (req, se) {
  isAdmin(req.user._id, (err, resp) => {
    if (err) return next(err)
    else {
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
    }
  })
})

// get a climbing room with its title
router.get('/climbingRoom', function (req, se, next) {
  let param = {}
  if (req.query.title)
    param.title = req.query.title
  ClimbingRoom.findOne(param , function (err, user) {
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
  isAdmin(req.user._id, (err, resp) => {
    if (err) return next(err)
    else {
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

    }
  })
})

// add a new climbing room
router.post('/climbingRoom/add', function (req, se) {
  isAdmin(req.user._id, (err, resp) => {
    if (err) return next(err)
    else {
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
    }
  })
})

module.exports = router
