/* jshint node: true */

var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var mongoose = require('mongoose');
var Posts = require('../models/posts');
var Users = require('../models/users');
var conf = require('../hunter-config').HunterConfig;

mongoose.connect('mongodb://localhost/'+conf.dbName);

var lastPosts = [];

request('https://forums.warframe.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    
    var $ = cheerio.load(body);
    
    $('.ipsSideBlock').each(function(index) {
      if (index === 1) {
        
        $(this).find('ul li').each(function(index) {
          //find user
          //console.log("=== USER");
          //console.log($(this).find('.ipsUserPhotoLink').attr('href'));
          
          var temp = {
            userurl: "",
            userid: "",
            posturl: ""
          };
          
          temp.userurl = $(this).find('.ipsUserPhotoLink').attr('href');
          var arr = temp.userurl.split('/');
          temp.userid = arr[arr.length-2];
          
          //Find url of post
          $(this).find('.list_content').each(function(index) {
            if (index === 0) {
              //console.log("=== URL");
              //console.log($(this).find('p a').attr('href'));
              //lastPosts.push( $(this).find('p a').attr('href') );
              temp.posturl = $(this).find('p a').attr('href');
              lastPosts.push(temp);
            }
          });  
        });
      }
    });
    
    processTheList();
    
  }
});

var toCheck = [];

function processTheList() {
  
  async.eachSeries(lastPosts, function(item, callback) {
    console.log("Checking "+item.userid);
    //Check if we have a profile on the user
    Users.count({userID: item.userid}, function(err, count) {
      if (err) {
        callback(err);
      }
      else {
        if (parseInt(count) === 0) {
          //We don't have this user in the db, save him/her!
          
          var tosave = {
            userID: item.userid,
            url: item.userurl
          };
          
          var userToSave = new Users(tosave);
          
          userToSave.save(function (err, savedUser) {
            if (err) {
              callback(err); 
            }
            else {
              //User saved!
              console.log("New user saved! "+savedUser.userID);
              
              toCheck.push({url: item.posturl, userid: item.userid});
              
              callback();
            }
          }); 
        }
        else {
          //We have the user in db, proceed with checking if we have the post
          Posts.count({url: item.posturl}, function(err, count) {
            if (err) {
              callback(err);
            }
            else {
              if (count === 0) {
                //We can check out that url for the post
                
                toCheck.push({url: item.posturl, userid: item.userid});
              }
              callback();
            }
          });
        }
      }
    });
    
  }, function(err) {
    //Done
    if (err) {
      console.log("ERROR happened");
      console.log(err);
    }
    else {
      console.log("Saving these topics: "+ toCheck.length);
      console.log("Done with checking users and filtering topics!");
      processTopics(); 
    }
  });
}

function processTopics() {
  async.eachSeries(toCheck, function(item, callback) {
    
    request(item.url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        
        var postID = item.url.substr( item.url.length-7, 7 );
        
        var tosave = {
          userID: item.userid,
          url: item.url,
          title: $('.ipsType_pagetitle').html(),
          date: new Date($('#post_id_'+postID).find('p abbr').attr('title')),
          post: $('#post_id_'+postID).find('.post').html()
        };
        
        var postToSave = new Posts(tosave);
        
        postToSave.save(function (err, savedPost) {
          if (err) {
            callback(err); 
          }
          else {
            //Post saved!
            console.log("New post saved!");
            
            callback();
          }
        }); 
        
      }
      else {
        if (error) {
          callback(error);
        }
        else if (response.statusCode === 400) {
          //Chineese urls are malformed, and can't be requested.
          callback();
        }
        else {
          callback();
        }
      }
    });  
  
  }, function(err) {
    //Done
    if (err) {
      console.log("ERROR happened");
      console.log(err);
    }
    else {
      console.log("Done with saving topics.");
    }
    mongoose.disconnect();
  });
}
