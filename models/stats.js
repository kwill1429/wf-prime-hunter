/* jshint node:true */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stats = new Schema({
  mid : String, //Mission id, example: mobiledefense1 - T1MD
  rewards: [{itemId: Number, count: Number}]
});

module.exports = mongoose.model('Stats', Stats);