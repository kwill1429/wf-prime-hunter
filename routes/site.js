/* jshint -W097 */ //Disables warning about use strict not being function level
/* jshint node: true */ 
/* global emit */
"use strict";

var Runs = require('../models/runs');
var Feedback = require('../models/feedback');
var async = require('async');

exports.index = function(req, res){
  res.render('index', { user: req.user, activeMenu: "homepage" });
};

exports.record = function(req, res){
  res.render('record', { user: req.user, activeMenu: "record" });
};

exports.saverun = function(req, res){
  
  var tosave = req.body;
  tosave.ts = Date.now();
  if (req.user) {
    tosave.userid = req.user.steamid;
  }
  
  var newrun = new Runs(tosave);

  newrun.save(function (err, run) {
    var toclient;
    if (err) {
      toclient = {success: false, error: err};  
    }
    else {
      toclient = {success: true};  
    }
    res.send(JSON.stringify(toclient));
  }); 
};

exports.savefeedback = function(req, res){
  
  var tosave = req.body;
  tosave.ts = Date.now();
  tosave.userid = req.user.steamid;
  
  var newfb = new Feedback(tosave);

  newfb.save(function (err, fb) {
    var toclient;
    if (err) {
      toclient = {success: false, error: err};  
    }
    else {
      toclient = {success: true};  
    }
    res.send(JSON.stringify(toclient));
  }); 
};

exports.history = function(req, res){
  Runs.find({userid: req.user.steamid}, null, {sort: {ts: -1}}, function(err, runs) {
    if (err) {
      console.log(err);
    }
    
    res.render('history', {user: req.user, runs: runs, activeMenu: "history"});
  });
};

exports.droprates = function(req, res){
  res.render('droprates', {user: req.user, activeMenu: "droprates"});  
};

exports.fetchtowerdata = function(req, res){
  if (req.params.tier == 1) {
    async.parallel({
      cap: function(callback) {
        aggregateSingleRewardMissionData("capture", 1, callback);
      },
      def: function(callback) {
        aggregateMultiRewardMissionData("defense", 1, callback);
      },
      ext: function(callback) {
        aggregateSingleRewardMissionData("exterminate", 1, callback);
      },
      md: function(callback) {
        aggregateSingleRewardMissionData("mobiledefense", 1, callback);
      },
      sab: function(callback) {
        aggregateSingleRewardMissionData("sabotage", 1, callback);
      },
      sur: function(callback) {
        aggregateMultiRewardMissionData("survival", 1, callback);
      }
    }, function(err, results) {
      if (err) {
        res.send(JSON.stringify({ success: false, error: err}));
      }
      else {
        res.send(JSON.stringify({ success: true, data: results}));
      }
    });
  }
  else if (req.params.tier == 2) {
    async.parallel({
      cap: function(callback) {
        aggregateSingleRewardMissionData("capture", 2, callback);
      },
      def: function(callback) {
        aggregateMultiRewardMissionData("defense", 2, callback);
      },
      ext: function(callback) {
        aggregateSingleRewardMissionData("exterminate", 2, callback);
      },
      md: function(callback) {
        aggregateSingleRewardMissionData("mobiledefense", 2, callback);
      },
      sab: function(callback) {
        aggregateSingleRewardMissionData("sabotage", 2, callback);
      },
      sur: function(callback) {
        aggregateMultiRewardMissionData("survival", 2, callback);
      }
    }, function(err, results) {
      if (err) {
        res.send(JSON.stringify({ success: false, error: err}));
      }
      else {
        res.send(JSON.stringify({ success: true, data: results}));
      }
    });
  }
  else if (req.params.tier == 3) {
    async.parallel({
      cap: function(callback) {
        aggregateSingleRewardMissionData("capture", 3, callback);
      },
      def: function(callback) {
        aggregateMultiRewardMissionData("defense", 3, callback);
      },
      ext: function(callback) {
        aggregateSingleRewardMissionData("exterminate", 3, callback);
      },
      md: function(callback) {
        aggregateSingleRewardMissionData("mobiledefense", 3, callback);
      },
      sab: function(callback) {
        aggregateSingleRewardMissionData("sabotage", 3, callback);
      },
      sur: function(callback) {
        aggregateMultiRewardMissionData("survival", 3, callback);
      }
    }, function(err, results) {
      if (err) {
        res.send(JSON.stringify({ success: false, error: err}));
      }
      else {
        res.send(JSON.stringify({ success: true, data: results}));
      }
    });
  }
  else if (req.params.tier == 4) {
    async.parallel({
      cap: function(callback) {
        aggregateSingleRewardMissionData("capture", 4, callback);
      },
      def: function(callback) {
        aggregateMultiRewardMissionData("defense", 4, callback);
      },
      ext: function(callback) {
        aggregateSingleRewardMissionData("exterminate", 4, callback);
      },
      md: function(callback) {
        aggregateSingleRewardMissionData("mobiledefense", 4, callback);
      },
      sab: function(callback) {
        aggregateSingleRewardMissionData("sabotage", 4, callback);
      },
      sur: function(callback) {
        aggregateMultiRewardMissionData("survival", 4, callback);
      },
      int: function(callback) {
        aggregateMultiRewardMissionData("interception", 4, callback);
      }
    }, function(err, results) {
      if (err) {
        res.send(JSON.stringify({ success: false, error: err}));
      }
      else {
        res.send(JSON.stringify({ success: true, data: results}));
      }
    });
  }
};

function aggregateSingleRewardMissionData(mission, tier, callback) {
  Runs.aggregate([
    {	
      $match: {
        mission: mission,
        tier: tier
      }
    },
    {
      $project:{
        reward: 1
      }
    },
    {
      $unwind: '$reward'
    },
    {
      $group:{
        _id: '$reward',
        count: {$sum: 1}
      }
    }
  ], function(err, result) {
    if (err) {
      console.log('ERROR');
      console.log(err);
      callback(err, null);
    }
    else {
      callback(null, result.sort(compareArrayItems));
    }
  });
}

function aggregateMultiRewardMissionData(mission, tier, callback) {
  var o = {};

  o.map = function() {
    for (var i = 0; i < this.reward.length; i++) {
      emit( i, this.reward[i] );
    }
  };
  
  o.reduce = function(key, value) {
    var revs = [];
    revs.push(value);  
    return {revs: revs};
  };
  
  o.query = {tier: tier, mission: mission};
  
  Runs.mapReduce(o, function(err, results) {
    if (err) {
      console.log(err);
      callback(err, null);
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
      //console.log(coll);
      callback(null, coll);
    }
  });
      //callback(null, result.sort(compareArrayItems));
}

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

//Watch out, reversed order is happening here!
function compareArrayItems(a, b) {
  if (a.count < b.count) {
    return 1;
  }
  if (a.count > b.count) {
    return -1;
  }
  return 0;
}