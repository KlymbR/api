'use strict'

var User = require('../models/user')

// check if a user is an admin
function isAdmin(id, cb) {
  User.findOne({
    _id: id
  }, function (err, user) {
    if (err) return cb(err)
    if (user && user.isAdmin) {
      return cb(null, true)
    } else {
      return cb({
        code: 401,
        message: "Unauthorized, is not admin"
      })
    }
  })
}

module.exports = isAdmin
