/* jshint node:true */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
  steamid: String,
  role: String
});

module.exports = mongoose.model('Account', Account);