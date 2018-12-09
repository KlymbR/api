'use strict'

var mongoose = require('mongoose')

var climbingRoomSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  latitude: {
    type: Number,
    unique: false,
    required: true,
    trim: true
  },
  longitude: {
    type: Number,
    unique: false,
    required: true,
    trim: true
  }
})

const ClimbingRoom = mongoose.model('climbing_rooms', climbingRoomSchema)
module.exports = ClimbingRoom
