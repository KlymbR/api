var mongoose = require('mongoose')

var statsSchema = new mongoose.Schema({
  path_id: {
    type: Number,
    unique: true,
    required: true,
    trim: true
  },
  path_difficulty: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  average_time: {
    type: Number,
    unique: false,
    required: true,
    trim: true
  },
  best_time: {
    type: Number,
    unique: false,
    required: true,
    trim: true
  },
  best_firstName: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  best_lastName: {
    type: String,
    unique: false,
    required: true,
    trim: true
  }
})

const Stats = mongoose.model('paths_stats', statsSchema)
module.exports = Stats
