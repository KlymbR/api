'use strict'

var express = require('express')
var router = express.Router()
var ClimbingRoom = require('../models/climbingRoom')
var isAdmin = require('../functions/isAdmin.js')

// add a new climbing room
router.post('/climbingRoom/add', function (req, se, next) {
  isAdmin(req.user._id, (err, resp) => {
    if (err) return next(err)
    else {
      ClimbingRoom.findOne({ title: req.query.title }, function (err, user) {
        if (err) {
          se.status(401).json({
            success: false,
            message: err
          })
        }
        if (!user) {
          var newClimbingRoom = new ClimbingRoom(req.body)
          newClimbingRoom.save(function (err, user) {
            if (err) {
              return next(err)
            } else {
              se.status(201).json({
                success: true,
                message: 'Created'
              })
            }
          })
        } else {
          return next({
            code: 400,
            success: false,
            message: 'This climbing room already exist'
          })
        }
      })
    }
  })
})

// get a climbing room with its title
router.get('/climbingRoom', function (req, se, next) {
  let param = {}
  if (req.query.title) {
    param.title = req.query.title
  }
  ClimbingRoom.find(param, function (err, user) {
    if (err) return next(err)
    if (!user) {
      return next({
        code: 404,
        success: false,
        message: Object.keys(param).length > 1 ? 'No climbing room with this title found' : 'Not Found'
      })
    } else {
      console.log(user.length)
      if (user.length < 1) {
        se.status(200).json({
          success: 'false',
          message: Object.keys(param).length > 1 ? 'No climbing room' : 'Not Found'
        })
      } else {
        se.status(200).json({
          success: 'true',
          result: Object.keys(param).length > 1 ? user : user
        })
      }
    }
  })
})

// delete a climbing room
router.delete('/climbingRoom/delete/:title', function (req, se, next) {
  isAdmin(req.user._id, (err, resp) => {
    if (err) return next(err)
    else {
      ClimbingRoom.findOne(
        { title: req.params.title })
        .exec(function (err, res) {
          if (err) return next(err)
          if (!res) {
            return next({
              code: 204,
              success: false
            })
          } else {
            res.remove()
            se.status(200).json({
              success: 'true',
              result: 'Deleted'
            })
          }
        })
    }
  })
})

module.exports = router
