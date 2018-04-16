'use strict'

var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var userSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
    trim: true
  },
  hashPassword: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  gender: {
    type: Number,
    unique: false,
    required: true,
    trim: true
  },
  birthdate: {
    type: Date,
    unique: false,
    required: true,
    trim: true
  },
  licenses: {
    type: Array,
    licenseNbr: {
      type: Number,
      unique: false,
      required: true,
      trim: true
    },
    clubName: {
      type: String,
      unique: false,
      required: true,
      trim: true
    },
    clubIb: {
      type: Number,
      unique: false,
      required: true,
      trim: true
    },
    fedIb: {
      type: Number,
      unique: false,
      required: true,
      trim: true
    },
    endDate: {
      type: Date,
      unique: false,
      required: true,
      trim: true
    },
    status: {
      type: Number,
      unique: false,
      required: true,
      trim: true
    }
  },
  address: {
    number: {
      type: Number,
      unique: false,
      required: true,
      trim: true
    },
    street: {
      type: String,
      unique: false,
      required: true,
      trim: true
    },
    postalCode: {
      type: Number,
      unique: false,
      required: true,
      trim: true
    },
    city: {
      type: String,
      unique: false,
      required: true,
      trim: true
    }
  },
  createdDate: {
    type: Date,
    unique: false,
    required: true,
    trim: true
  }
})

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.hashPassword)
}

const User = mongoose.model('User', userSchema)
module.exports = User
