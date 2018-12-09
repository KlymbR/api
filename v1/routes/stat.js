'use strict'

var express = require('express')
var router = express.Router()
var Stat = require('../models/stat')
var isAdmin = require('../functions/isAdmin.js')

// get all stats
router.get('/stat', function (req, se) {
  if (req.query.path_id === undefined) {
    Stat.find({}, (err, res) => {
      if (err) {
        console.log(err)
        se.status(500).send(err)
        return err
      }
      if (!res) {
        se.status(204).json({
          success: false,
          message: 'No stats.'
        })
      } else {
        se.status(201).json({
          success: true,
          result: res
        })
      }
    })
  } else {
    Stat.findOne({path_id: req.query.path_id}, (err, res) => {
      if (err) {
        console.log(err)
        se.status(500).send(err)
        return err
      }
      if (!res) {
        se.status(204).json({
          success: false,
          message: 'Stat not found.'
        })
      } else {
        se.status(201).json({
          success: true,
          result: res
        })
      }
    })
  }
})

// Admin only
// add a new stat
router.post('/stat/add', function (req, se, next) {
  isAdmin(req.user._id, (err, resp) => {
    if (err) return next(err)
    else {
      Stat.findOne(
        {path_id: req.body.path_id})
        .exec(function (err, res) {
          if (err) return next(err)
          if (res) {
            se.status(400).json({
              success: false,
              message: 'Stat already exist.'
            })
          } else {
            var newStat = new Stat(req.body)
            newStat.save(function (err, user) {
              if (err) return next(err)
              else {
                se.status(201).json({
                  success: true,
                  message: 'Created'
                })
              }
            })
          }
        })
    }
  })
})

// update a stat
router.patch('/stat/update', function (req, se, next) {
  Stat.findOneAndUpdate({
    path_id: req.body.path_id
  }, {
    '$set': {
      path_id: req.body.path_id,
      path_difficulty: req.body.path_difficulty,
      average_time: req.body.average_time,
      best_time: req.body.best_time,
      best_firstName: req.body.best_firstName,
      best_lastName: req.body.best_lastName
    }
  }, { new: true }, function (err, res) {
    if (err) return next(err)
    if (!res) {
      return next({
        code: 204,
        success: true,
        message: 'Updated'
      })
    } else {
      se.status(200).json({
        success: true,
        result: res
      })
    }
  }
  )
})

// Admin only
// delete a stat
router.delete('/stat/delete', function (req, se, next) {
  isAdmin(req.user._id, (err, resp) => {
    if (err) return next(err)
    else {
      Stat.findOne(
        {path_id: req.body.path_id})
        .exec(function (err, res) {
          if (err) return next(err)
          if (!res) {
            return next({
              code: 204,
              success: false,
              message: 'Stat not found.'
            })
          } else {
            res.remove()
            se.status(200).json({
              success: true,
              result: res,
              message: 'Deleted'
            })
          }
        })
    }
  })
})

module.exports = router
