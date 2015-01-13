/* jshint -W097 */ //Disables warning about use strict not being function level
/* jshint node: true */ 
"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var conf = require('./hunter-config').HunterConfig;
var Account = require('./models/account');

var app = express();
var http = require('http').Server(app);

//config
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use('/public', express.static(__dirname + '/public'));

//middlware
app.use(bodyParser.json());
app.use(session({ secret: conf.sessionSecret, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:'+conf.port+'/auth/steam/return',
    realm: 'http://localhost:'+conf.port+'/',
    profile: false
  },
  function(identifier, profile, done) {
    var id = identifier.split('/')[identifier.split('/').length-1];
    Account.findOne({steamid: id}, function(err, user) {
      if (err) {
        console.log("ERROR");
        console.log(err);
        return done(err, null);
      }
      else if (user === null) {
        //console.log("No result on user. Register him");
        
        var tosave = {
          steamid: id,
          role: "member"
        };
        
        var newAcc = new Account(tosave);
  
        newAcc.save(function (err, newaccount) {
          if (err) {
            console.log(err);
            return done(err, null);
          }
          else {
            return done(null, newaccount);  
          }
        });
      }
      else {
        //console.log("found user in db. log him in");
        return done(null, user);
      }
    });
  }
));

mongoose.connect('mongodb://localhost/'+conf.dbName);

//Load routes
var general = require('./routes/general');
var site = require('./routes/site');

app.get('/', site.index);
app.get('/record', ensureAuthenticated, site.record);
app.get('/history', ensureAuthenticated, site.history);
app.get('/drop-rates', ensureAuthenticated, site.droprates);
app.post('/ajax/saverun', site.saverun);
app.post('/ajax/savefeedback', site.savefeedback);
app.post('/ajax/gettower/:tier', site.fetchtowerdata);

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', general.login);
app.get('/logout', general.logout);
app.get('/auth/steam', 
  passport.authenticate('steam', { failureRedirect: '/login' }),
  general.authSteam);
app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/login' }),
  general.authSteamReturn);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

http.listen(conf.port, function(){
  console.log("Warframe Prime Hunter started at port "+conf.port);
});