/* jshint node:true */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Feedback = new Schema({
  comment: String,
  ts: Date,
  userid: String
});

module.exports = mongoose.model('Feedback', Feedback);