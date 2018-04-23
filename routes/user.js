'use strict'

var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var User = require('../models/user')

// register a new user
router.post('/auth/register', function (req, res) {
  var newUser = new User(req.body)
  newUser.hashPassword = bcrypt.hashSync(req.body.password, 10)
  newUser.createdDate = Date.now()
  console.log(newUser)
  newUser.save(function (err, user) {
    if (err) {
      return res.status(400).send({
        message: err
      })
    } else {
      newUser.hashPassword = undefined
      return res.json(newUser)
    }
  })
})

// sign_in a user
router.post('/auth/sign_in', function (req, res) {
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
        return res.json({token: jwt.sign({email: user.email, fullName: user.fullName, _id: user._id}, 'RESTFULAPIs')})
      }
    }
  })
})

// get a user by his id
router.get('/user', function (req, se) {
  if (!req.user) {
    return se.status(401).json({ message: 'Unauthorized user!' })
  }
  User.findOne({
    id: req.query.id
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

// update user information
router.post('/user/update', function (req, se) {
  if (!req.user) {
    return se.status(401).json({ message: 'Unauthorized user!' })
  }
  User.findOneAndUpdate({
    id: req.body.id
  }, {
    '$set': {
      email: req.body.email,
      phone: req.body.phone
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

// delete a user
router.post('/user/delete', function (req, se) {
  if (!req.user) {
    return se.status(401).json({ message: 'Unauthorized user!' })
  }
  User.findOne(
    {id: req.body.id})
    .exec(function (err, res) {
      if (err) {
        console.log(err)
        se.status(500).send(err)
        return err
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
