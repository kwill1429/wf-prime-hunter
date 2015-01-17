/* jshint browser: true */
/* jshint jquery: true */

$(document).ready(function() {
  
  var keydata = {
    key1: {
      tier: -1,
      mission: ""
    },
    key2: {
      tier: -1,
      mission: ""
    },
    key3: {
      tier: -1,
      mission: ""
    }
  };
  
  var callbacks = {
    onChooseTier: function() {
      //Save data
      keydata['key'+$(this).data('key')].tier = $(this).data('tier');
      
      //Update DOM
      $(this).siblings().removeClass('btn-primary').addClass('btn-default');
      $(this).removeClass('btn-default').addClass('btn-primary');
      
      //If it is T4, enable interception. if not, disable it
      if ( $(this).data('tier') == 4 ) {
        $('.key'+$(this).data('key')+'-mission button[data-mission="INT"]').removeClass('disabled');
      }
      else {
        $('.key'+$(this).data('key')+'-mission button[data-mission="INT"]').addClass('disabled').removeClass('btn-primary').addClass('btn-default');
      }
      
      if (checkIfCanSubmit()) {
        displaySavePrompt();
      }
    },
    onChooseMission: function() {
      //Save data
      keydata['key'+$(this).data('key')].mission = $(this).data('mission');
      
      //Update DOM
      $(this).siblings().removeClass('btn-primary').addClass('btn-default');
      $(this).removeClass('btn-default').addClass('btn-primary');
      
      if (checkIfCanSubmit()) {
        displaySavePrompt();
      }
    },
    onReset: function() {
      resetAll();
    },
    onSaveKeypack: function() {
      sendData(keydata);  
    }
  };
  
  function sendData(tosend) {
    $('.action-result').empty();
    
    $.ajax({
      url: '/ajax/savekeypack',
      data: JSON.stringify(tosend),
      type: 'POST',
      contentType: 'application/json',
      success: function (data) {
        try {
          var response = jQuery.parseJSON(data);
          var buffer = "";
          
          if (response.success) {
            buffer = "<div class='alert alert-success'>Successfully saved. Thank you for contributing! ";
            buffer += "<button id='start-new-keypack' class='btn btn-success'>Add another keypack!</button>";
            buffer += "</div>";
          }
          else {
            buffer = "<div class='alert alert-danger'>Error in saving.</div>";
          }
          $('.action-result').append(buffer);
        }
        catch(exception) {
          var buffer = "<div class='alert alert-danger'>Error parsing the response.</div>";
          $('.action-result').append(buffer);
        }
      },
      error: function (xhr, status, error) {
        var buffer = "<div class='alert alert-danger'>Error in server connection. Please try again later.</div>";
        $('.action-result').append(buffer);
      },
    });
  }
  
  function checkIfCanSubmit() {
    if (keydata.key1.tier !== -1 && 
        keydata.key2.tier !== -1 && 
        keydata.key3.tier !== -1 &&
        keydata.key1.mission !== "" && 
        keydata.key2.mission !== "" && 
        keydata.key3.mission !== "") {
      return true;
    }
    else {
      return false;
    }
  }
  
  function resetAll() {
    //Reset data
    keydata = {
      key1: {
        tier: -1,
        mission: ""
      },
      key2: {
        tier: -1,
        mission: ""
      },
      key3: {
        tier: -1,
        mission: ""
      }
    };
    
    //Reset DOM
    $('.key1-tier button').removeClass('btn-primary').addClass('btn-default');
    $('.key2-tier button').removeClass('btn-primary').addClass('btn-default');
    $('.key3-tier button').removeClass('btn-primary').addClass('btn-default');
    $('.key1-mission button').removeClass('btn-primary').addClass('btn-default');
    $('.key2-mission button').removeClass('btn-primary').addClass('btn-default');
    $('.key3-mission button').removeClass('btn-primary').addClass('btn-default');
    $('.key1-mission button[data-mission="INT"]').addClass('disabled');
    $('.key2-mission button[data-mission="INT"]').addClass('disabled');
    $('.key3-mission button[data-mission="INT"]').addClass('disabled');
    $('#save-prompt').addClass('hidden');
    $('.action-result').empty();
  } 
  
  function displaySavePrompt() {
    if ( $('#save-prompt').hasClass('hidden') ) {
      $('#save-prompt').removeClass('hidden');
    }
  }
  
  $('.key1-tier button').click(callbacks.onChooseTier);
  $('.key2-tier button').click(callbacks.onChooseTier);
  $('.key3-tier button').click(callbacks.onChooseTier);
  $('.key1-mission button').click(callbacks.onChooseMission);
  $('.key2-mission button').click(callbacks.onChooseMission);
  $('.key3-mission button').click(callbacks.onChooseMission);
  $('#save-keypack').click(callbacks.onSaveKeypack);
  $('#reset-keypack').click(callbacks.onReset);
  $('body').on('click', '#start-new-keypack', callbacks.onReset);
  
});