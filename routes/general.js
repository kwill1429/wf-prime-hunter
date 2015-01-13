/* jshint -W097 */ //Disables warning about use strict not being function level
/* jshint node: true */ 
"use strict";

var Account = require('../models/account');
var conf = require('../hunter-config').HunterConfig;

exports.login = function(req, res){
  res.render('login', { user: req.user });
};

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};

exports.authSteam = function(req, res) {
  res.redirect('/');
};

exports.authSteamReturn = function(req, res) {
  res.redirect('/');
};