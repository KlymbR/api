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
routerBeforeAuth.post('/auth/register', function (req, res) {
  var newUser = new User(req.body)
  newUser.hashPassword = bcrypt.hashSync(req.body.password, 10)
  newUser.createdDate = Date.now()
  newUser.save(function (err, user) {
    if (err) {
      return res.status(400).send({
        message: err
      })
    } else {
      res.sendStatus(201)
    }
  })
})

// sign_in a user
routerBeforeAuth.post('/auth/sign_in', function (req, res) {
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) throw err
    if (!user) {
      res.status(401).json({ message: 'Authentication failed. User not found.' })
    } else if (user) {
      if (!user.comparePassword(req.body.password)) {
        res.status(401).json({ message: 'Authentication failed. Wrong password.' })
      } else {
        const token = jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, config.secret)
        res.cookie('token', token)
        res.set('Authorization', token)
        return res.json({
          success: true,
          token: token
        })
      }
    }
  })
})

// get a user
routerAfterAuth.get('/user', function (req, se) {
  User.findOne({
    email: req.user.email
  }, function (err, user) {
    if (err) {
      console.log(err)
      se.status(500).send(err)
      return err
    }
    if (!user) {
      se.sendStatus(204)
    } else {
      se.send(user)
    }
  })
})

// Admin only
// get all users with specific club Id license
routerAfterAuth.get('/user/license', function (req, se) {
  if (!isAdmin(req.user.email)) {
    se.sendStatus(403)
    return
  }
  var id = parseInt(req.query.clubId)
  User.find({'licenses': {
    $elemMatch: {
      clubId: id
    }
  }
  }).exec(function (err, user) {
    if (err) {
      console.log(err)
      se.status(500).send(err)
      return err
    }
    if (!user) {
      se.sendStatus(204)
    } else {
      se.send(user)
    }
  })
})

// update user information
routerAfterAuth.patch('/user/update', function (req, se) {
  User.findOneAndUpdate({
    id: req.body.id
  }, {
    '$set': {
      email: req.body.email,
      phone: req.body.phone,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }
  })
    .exec(function (err, res) {
      if (err) {
        console.log(err)
        se.status(500).send(err)
        return err
      }
      if (!res) {
        se.sendStatus(204)
      } else {
        se.sendStatus(200)
      }
    })
})

// Admin only
// delete a user
routerAfterAuth.delete('/user/delete/:id', function (req, se) {
  if (!isAdmin(req.user.email)) {
    se.sendStatus(403)
    return
  }
  User.findOne(
    { id: req.params.id })
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

module.exports = {
  bAuth: routerBeforeAuth,
  aAuth: routerAfterAuth
}
