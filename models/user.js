'use strict'

var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var userSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  hashPassword: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  gender: {
    type: Number
  },
  birthday: {
    type: Date
  },
  licenses: {
    type: Array,
    licenseNbr: {
      type: Number
    },
    clubName: {
      type: String
    },
    clubIb: {
      type: Number
    },
    fedIb: {
      type: Number
    },
    endDate: {
      type: Date
    },
    status: {
      type: Number
    }
  },
  address: {
    number: {
      type: Number
    },
    street: {
      type: String
    },
    postalCode: {
      type: Number
    },
    city: {
      type: String
    }
  },
  createdDate: {
    type: Date
  }
})

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.hashPassword)
}

const User = mongoose.model('User', userSchema)
module.exports = User
