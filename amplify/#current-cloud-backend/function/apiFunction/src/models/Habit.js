const mongoose = require('mongoose');

const dateSchema = new mongoose.Schema({
  date: Date,
});

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  private_bool:{
    type:Boolean,
    default:false
  },
  dates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Dates'
  }]
});

mongoose.model('Habit', habitSchema);
mongoose.model('Dates', dateSchema);
