/* jshint node: true */
/* global emit */

var mongoose = require('mongoose');
var Runs = require('../models/runs');
var async = require('async');
var conf = require('../hunter-config').HunterConfig;

mongoose.connect('mongodb://localhost/'+conf.dbName);
  
var o = {};

o.map = function() {
  for (var i = 0; i < this.reward.length; i++) {
    emit(
      i,
      this.reward[i]
    );
  }
};

o.reduce = function(key, value) {
  var revs = [];
  revs.push(value);
  
  return {revs: revs};
};

o.query = {tier: 1, mission: "defense"};

Runs.mapReduce(o, function(err, results) {
  if (err) {
    console.log(err);
  }
  else {
    var coll = [];
    for (var i = 0; i < results.length; i++) {
      if (results[i].value.revs) {
        coll.push(aggregateRound(results[i].value.revs[0]));
      }
      else {
        coll.push([{
          id: results[i].value,
          count: 1
        }]);
      }
      
    }
    console.log(coll);
  }
  mongoose.disconnect();
});

function aggregateRound(data) {
  
  var russian = [];
  
  for (var z = 0; z < data.length; z++) {
    
    if (isInArray(russian, data[z])) {
      //incrementCount(russian, this);
      for (var i = 0; i < russian.length; i++) {
        if (russian[i].id === data[z]) {
          russian[i].count += 1;
          break;
        }
      }
    }
    else {
      russian.push({
        id: data[z],
        count: 1
      });
    }
  }
  
  return russian;
}

function isInArray(arr, val) {
  for (var i = 0 ; i  < arr.length; i++){
    if (arr[i].id === val) {
      return true;
    }
  }
  return false;
}