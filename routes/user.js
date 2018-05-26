'use strict'

var express = require('express')
var routerBeforeAuth = express.Router()
var routerAfterAuth = express.Router()
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var User = require('../models/user')
const config = require('../config')
var isAdmin = require('../functions/isAdmin.js')

// register a new user
routerBeforeAuth.post('/auth/register', function (req, res, next) {
  var newUser = new User(req.body)
  newUser.hashPassword = bcrypt.hashSync(req.body.password, 10)
  newUser.createdDate = Date.now()
  newUser.save(function (err, user) {
    if (err) {
      res.status(401).json({
        success: false,
        message: err
      })
    } else {
      res.status(201).json({
        success: true,
        message: 'Created'
      })
    }
  })
})

// sign_in a user
routerBeforeAuth.post('/auth/sign_in', function (req, res, next) {
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) return next(err)
    if (!user) {
      return next({
        code: 401,
        success: false,
        message: 'Authentication failed. User not found.'
      })
    } else if (user) {
      if (!user.comparePassword(req.body.password)) {
        return next({
          code: 401,
          success: false,
          message: 'Authentication failed. Wrong password.'
        })
      } else {
        const token = jwt.sign({
          _id: user._id,
          email: user.email,
          fullName: user.fullName
        }, config.secret)
        res.cookie('token', token)
        res.set('Authorization', token)
        return res.status(200).json({
          success: true,
          token: token
        })
      }
    }
  })
})

// get a user
routerAfterAuth.get('/user', function (req, se, next) {
  User.findOne({
    '_id': req.user._id
  }, function (err, user) {
    if (err) return next(err)
    if (!user) {
      return next({
        code: 404,
        success: false,
        message: 'User not found'
      })
    } else {
      se.status(200).send({
        success: true,
        result: user
      })
    }
  })
})

// get all user
routerAfterAuth.get('/user/all', function (req, se, next) {
  isAdmin(req.user._id, (err, resp) => {
    if (err) return next(err)
    else {
      User.find({}, (err, res) => {
        if (err) {
          console.log(err)
          se.status(500).send(err)
          return err
        }
        if (!res) {
          se.status(204).json({
            success: false,
            message: 'No users.'
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
})

// Admin only
// get all users with specific club Id license
routerAfterAuth.get('/user/license', function (req, se, next) {
  isAdmin(req.user._id, (err, resp) => {
    if (err) return next(err)
    else {
      var id = parseInt(req.query.clubId)
      User.find({
        'licenses': {
          $elemMatch: {
            clubId: id
          }
        }
      }).exec(function (err, user) {
        if (err) return next(err)
        if (!user) {
          return next({
            code: 404,
            success: false,
            message: 'Users not found'
          })
        } else {
          se.status(201).send({
            success: true,
            result: user
          })
        }
      })
    }
  })
})

// update user information
routerAfterAuth.patch('/user/update', function (req, se, next) {
  User.findOne({
    '_id': req.user._id
  }, (err, user) => {
    if (err) return next(err)
    else if (!user) {
      return next({
        code: 404,
        success: false,
        message: 'User not found'
      })
    } else {
      if (req.body.address) {
        req.body.address = Object.assign(user.address, req.body.address)
      }
      var UpdatedUser = new User(Object.assign(user, req.body))
      UpdatedUser.save((err, resp) => {
        if (err) return next(err)
        else if (!resp) {
          return next({
            code: 404,
            success: false,
            message: 'User not updated'
          })
        } else {
          se.status(200).json({
            success: true,
            result: resp
          })
        }
      })
    }
  })
})

// Admin only
// delete a user
routerAfterAuth.delete('/user/delete/:id', function (req, se, next) {
  isAdmin(req.user._id, (err, resp) => {
    if (err) return next(err)
    else {
      User.findOne({
        _id: req.params.id
      })
        .exec(function (err, res) {
          if (err) return next(err)
          if (!res) {
            return next({
              code: 404,
              success: false,
              message: 'User to delete not found'
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

module.exports = {
  bAuth: routerBeforeAuth,
  aAuth: routerAfterAuth
}
