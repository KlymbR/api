'use strict'

var User = require('../models/user')

// check if a user is an admin
function isAdmin (mail) {
  User.findOne({
    email: mail
  }, function (err, user) {
    if (err) {
      console.log(err)
      return false
    }
    if (!user) {
      return false
    } else {
      return true
    }
  })
}

module.exports = isAdmin
