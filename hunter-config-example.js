/* jshint -W097 */ //Disables warning about use strict not being function level
/* jshint node: true */ 
"use strict";

exports.HunterConfig = {
  sessionSecret : "ENTER-LONG-STRING-HERE",
  dbName: "ENTER-DATABASE-NAME-HERE", 
  port: 80,
  steamReturnUrl: "RETURN URL",  //ex.: http://localhost:3000/auth/steam/return
  steamRealm: "REALM" //ex.: http://localhost:3000
};