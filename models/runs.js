/* jshint node:true */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Runs = new Schema({
  tier: Number,
  mission: String,
  reward: [Number],
  ts: Date,
  userid: String,
  version: String
});

module.exports = mongoose.model('Runs', Runs);