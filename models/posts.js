/* jshint node:true */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema({
  userID: String,
  url: String,
  title: String,
  date: Date,
  post: String
});

module.exports = mongoose.model('Post', Post);