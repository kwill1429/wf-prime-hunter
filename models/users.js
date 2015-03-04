/* jshint node:true */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  userID: String,
  url: String
});

module.exports = mongoose.model('User', User);