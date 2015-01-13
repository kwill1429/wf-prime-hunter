/* jshint browser: true */
/* jshint jquery: true */
/* global moment */

$(document).ready(function() {
  "use strict";
  
  $('#data-table tbody tr').each(function() {
    
    //Format date
    var newDate = moment( new Date($(this).find('td:first-child').text())  ).format('MMMM Do YYYY, h:mm:ss a');
    $(this).find('td:first-child').text(newDate);
    
    $(this).find('td:nth-child(3)').text( transformMissionName($(this).find('td:nth-child(3)').text()) );
    
    $(this).find('td ul li').each(function() {
      $(this).text( getItemFromID( $(this).text() ) );    
    });
  });
  
  function getItemFromID(id) {
    return window.PHitems[id];
  }
  
  function transformMissionName(mission) {
    switch(mission) {
      case "capture":
        return "Capture";
      case "exterminate":
        return "Exterminate";
      case "defense":
        return "Defense";
      case "survival":
        return "Survival";
      case "interception":
        return "Interception";
      case "mobiledefense":
        return "Mobile Defense";
    }
  }
});