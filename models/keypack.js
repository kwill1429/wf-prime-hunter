/* jshint node:true */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Keypack = new Schema({
  keys: [{
    tier: Number,
    mission: String
  }],
  ts: Date,
  userid: String
});

module.exports = mongoose.model('Keypack', Keypack);