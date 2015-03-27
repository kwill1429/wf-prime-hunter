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
var io = require('socket.io')(http);

//config
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use('/public', express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components')); //There is no need for this in prod.

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
    returnURL: conf.steamReturnUrl,
    realm: conf.steamRealm,
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
        return done(null, user);
      }
    });
  }
));

mongoose.connect('mongodb://localhost/'+conf.dbName);

//Load routes
var general = require('./routes/general');
var site = require('./routes/site');
var trackerSocket = require('./routes/trackerSocket');

app.get('/', site.index);
app.get('/record', site.record);
app.get('/record-keypack', site.recordKeypack);
app.get('/history', ensureAuthenticated, site.history);
app.get('/drop-rates', site.droprates);
app.get('/drop-rates-key-pack', site.droprateskeypack);
app.get('/dev-tracker', site.devTracker);
app.post('/ajax/saverun', site.saverun);
app.post('/ajax/savefeedback', site.savefeedback);
app.post('/ajax/savekeypack', site.savekeypack);
//app.post('/ajax/gettower/:tier', site.fetchtowerdata);
app.post('/ajax/gettower/:tier/:gversion', site.fetchtowerdata);
app.post('/ajax/getkeypack', site.getkeypack);
app.post('/ajax/gethistory', site.gethistory);

var ioTracker = io.of('/dev-tracker');
ioTracker.on('connection', trackerSocket.onConnect);

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