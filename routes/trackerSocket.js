/* jshint node: true */ 

var async = require('async');
var Posts = require('../models/posts');
var Users = require('../models/users');

exports.onConnect = function(socket) {
  console.log('a user connected');
  
  Posts.find({}, null, {sort: {date: -1}, limit: 10}, function(err, results) {
    if (err) {
      console.log(err);
      socket.emit('initiData', {success: false, error: err});    
    }
    else {
      
      var devs = [];
      for (var i = 0; i < results.length; i++) {
        if ( !isUserInArray(devs, results[i].userID)  ) {
          devs.push(results[i].userID);
        }
      }
      
      Users.find({userID: {$in: devs}}, function(err, developers) {
        if (err) {
          console.log(err);
          socket.emit('initiData', {success: false, error: err});    
        }
        else {
          //TODO: összefésülni a postokat a devek adataival
          var tosend = [];
          for (var i = 0; i < results.length; i++) {
            tosend.push({
              date: results[i].date,
              post: results[i].post,
              title: results[i].title,
              url: results[i].url,
              developer: getDevData(developers, results[i].userID)
            });
          }
          
          socket.emit('initData', {success: true, data: tosend});        
        }
      });
      
      
    }
  });
  
};

function getDevData(arr, id) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].userID === id) {
      return arr[i];
    }
  }
  return null;
}

function isUserInArray(arr, id) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === id) {
      return true;
    }
  }
  return false;
}
