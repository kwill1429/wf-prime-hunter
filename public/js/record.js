/* jshint browser: true */
/* jshint jquery: true */
/* jshint devel: true */

$(document).ready(function() {
  "use strict";
  
  var items = window.PHitems;
  
  var rewards = [
    { //T1
      capture: [0, 1, 2, 5, 24, 38, 42],
      defense: {
        rotA: [0, 1, 2],
        rotB: [0, 1, 2],
        rotC: [0, 1, 2, 39, 48, 49, 104]
      },
      exterminate: [0, 1, 2, 10, 70, 74],
      mobiledefense: [0, 1, 2, 3, 10, 102],
      sabotage: [0, 1, 2, 18, 19, 20, 39, 72, 93],
      survival: {
        rotA: [1, 2, 19, 53, 105],
        rotB: [1, 2, 105],
        rotC: [0, 1, 2, 18, 20, 26, 27, 72, 87, 105]
      },
    },
    { //T2
      capture: [0, 2, 22, 25, 65, 66, 79, 85],
      defense: {
        rotA: [0, 1, 2, 28, 65, 105],
        rotB: [0, 1, 2, 18, 23, 105],
        rotC: [0, 1, 2, 14, 26, 58, 60, 63, 105]
      },
      exterminate: [0, 2, 57, 64, 73, 78, 83, 104],
      mobiledefense: [0, 2, 11, 47, 52, 69, 98, 102],
      sabotage: [0, 2, 22, 34, 38, 75, 85, 98],
      survival: {
        rotA: [0, 1, 2, 27, 32, 105],
        rotB: [0, 1, 2, 20, 37, 56, 105],
        rotC: [0, 1, 2, 17, 23, 30, 51, 67, 91, 105]
      }
    },
    { //T3
      capture: [0, 2, 16, 33, 35, 36, 41, 81],
      defense: {
        rotA: [0, 1, 2, 49, 105],
        rotB: [0, 1, 2, 15, 25, 40, 105],
        rotC: [0, 1, 2, 12, 13, 14, 50, 89, 105]
      },
      exterminate: [0, 2, 8, 31, 44, 89, 91, 99, 101],
      mobiledefense: [0, 2, 3, 4, 7, 67, 70, 80],
      sabotage: [0, 2, 21, 43, 50, 62, 71, 92],
      survival: {
        rotA: [0, 2, 21, 59, 78, 105],
        rotB: [0, 2, 41, 56, 69, 105],
        rotC: [0, 2, 43, 45, 82, 92, 95, 103, 105]
      }
    },
    { //T4
      capture: [0, 2, 33, 36, 81, 100],
      defense: {
        rotA: [0, 2, 40, 55, 66, 105],
        rotB: [0, 2, 12, 13, 105],
        rotC: [0, 2, 9, 17, 51, 77, 88, 97, 105]
      },
      exterminate: [0, 2, 8, 44, 54, 61, 101],
      interception: {
        rotA: [0, 2, 32, 56, 62, 105],
        rotB: [0, 2, 5, 92, 105],
        rotC: [0, 2, 24, 29, 42, 57, 60, 76, 105]
      },
      mobiledefense: [0, 2, 4, 7, 68, 80],
      sabotage: [0, 2, 55, 63, 68, 86, 90, 94, 100],
      survival: {
        rotA: [0, 2, 6, 53, 105],
        rotB: [0, 2, 82, 103, 105],
        rotC: [0, 2, 7, 46, 79, 84, 86, 90, 105]
      }
    }
  ];
  
  var runData = {
    tier: -1,
    mission: "",
    reward: [],
    ts: "" //Set at the bottom where we reset it functionally
  };
  
  var callbacks = {
    onStartManualEntry: function(evt) {
      evt.preventDefault();
      
      $('#manual-entry').removeClass('btn-default').addClass('btn-primary');
      
      $('.choose-tier').removeClass('hidden');
      
      $('html, body').animate({scrollTop: $(document).height()}, 100);
    },
    onChooseTier: function(evt) {
      evt.preventDefault();
      
      runData.tier = $(this).data('tier');
      
      $('.tier-button').removeClass('btn-primary').addClass('btn-default');
      
      $(this).removeClass('btn-default').addClass('btn-primary');
      $('.choose-mission').removeClass('hidden');
      
      //Based on tier level show/hide interception button
      if (runData.tier === 4) {
        //Show interception
        $('#interception').removeClass('hidden');
      }
      else {
        //Hide interception
        $('#interception').addClass('hidden');
      }
      
      $('html, body').animate({scrollTop: $(document).height()}, 100);
    },
    onChooseMission: function(evt) {
      evt.preventDefault();
      
      runData.mission = $(this).data('mission');
      
      $('.mission-button').removeClass('btn-primary').addClass('btn-default');
      
      $(this).removeClass('btn-default').addClass('btn-primary');
      
      switch(runData.mission) {
        case "capture":
        case "exterminate":
        case "mobiledefense":
        case "sabotage":
          displaySingleRewards();
          break;
        case "defense":
        case "survival":
        case "interception":
          displayMultipleRewards();
          break;
      }
      
      $('html, body').animate({scrollTop: $(document).height()}, 100);
    },
    onChooseSingleReward: function(evt) {
      evt.preventDefault();
      
      runData.reward = [];
      runData.reward.push($(this).data('id'));
      
      $('.single-reward-button').removeClass('btn-primary').addClass('btn-default');
      
      $(this).removeClass('btn-default').addClass('btn-primary');
      
      displaySavePrompt();
      
      $('html, body').animate({scrollTop: $(document).height()}, 100);
    },
    onSaveSingleRun: function(evt) {
      evt.preventDefault();
      
      console.log("Run data:");
      console.log(runData);
      
      sendData(runData);
    },
    onResetSingleRun: function(evt) {
      evt.preventDefault();
      
      //Reset data
      runData = {
        tier: -1,
        mission: "",
        reward: [],
        ts: ""
      };
      
      //Reset DOM
      $('#manual-entry').removeClass('btn-primary').addClass('btn-default');
      $('#live-entry').removeClass('btn-primary').addClass('btn-default');
      $('.choose-tier').addClass('hidden');
      $('.tier-button').removeClass('btn-primary').addClass('btn-default');
      $('.choose-mission').addClass('hidden');
      $('.mission-button').removeClass('btn-primary').addClass('btn-default');
      $('.single-rewards').empty();  
      $('.choose-single-reward').addClass('hidden');
      $('.single-reward-action').addClass('hidden');  
      $('.action-result').empty();
      $('.choose-multiple-reward').empty().addClass('hidden');
    },
    onChooseMultipleReward: function(evt) {
      evt.preventDefault();
      console.log("handle multipl reward button click");
      
      if (typeof runData.reward[ $(this).data('index') ] !== "undefined" ) {
        //We overwrite the reward
        runData.reward[ $(this).data('index') ] = $(this).data('id');
      }
      else {
        //Push new reward at the end
        runData.reward.push($(this).data('id'));
        //Only need to display next round if we modified the last round
        displayNextRound();
      }
      
      $(".multiple-reward-button[data-index='"+$(this).data('index')+"']").removeClass('btn-primary').addClass('btn-default');
      
      $(this).removeClass('btn-default').addClass('btn-primary');
      
      $('html, body').animate({scrollTop: $(document).height()}, 100);
    }
  };
  
  function displaySingleRewards() {
    $('.single-rewards').empty();
    
    var buffer = "";
    
    rewards[runData.tier-1][runData.mission].forEach(function(item) {
      buffer += "<div class='col-lg-3'>";
      buffer += "<button data-id='"+item+"' class='single-reward-button btn btn-default btn-lg btn-block'>"+items[item]+"</button>";
      buffer += "</div>";
    });
    
    $('.single-rewards').append(buffer);
    $('.choose-single-reward').removeClass('hidden');
  }
  
  function displayMultipleRewards() {
    $('.choose-multiple-reward').empty();
    
    displayNextRound();
    displaySavePrompt();
    
    $('.choose-multiple-reward').removeClass('hidden');
  }
  
  function displayNextRound() {
    var buffer = "";
    
    if (runData.mission === "defense") {
      var wave = (runData.reward.length+1)*5;
      buffer = "<div class=mission-round>";
      buffer += "<div class=row><div class=col-lg-12><p class=center-text><strong>Choose Wave "+wave+" reward:</strong></p></div></div>";
      buffer += "<div class=row>";
    }
    else if (runData.mission === "survival") {
      var min = (runData.reward.length+1)*5;
      buffer = "<div class=mission-round>";
      buffer += "<div class=row><div class=col-lg-12><p class=center-text><strong>Choose "+min+" minute reward:</strong></p></div></div>";
      buffer += "<div class=row>";
    }
    else if (runData.mission === "interception") {
      var round = runData.reward.length+1;
      buffer = "<div class=mission-round>";
      buffer += "<div class=row><div class=col-lg-12><p class=center-text><strong>Choose round "+round+" reward:</strong></p></div></div>";
      buffer += "<div class=row>";
    }
    
    switch (getRotation(runData.reward.length+1)) {
      case "A":
        rewards[runData.tier-1][runData.mission].rotA.forEach(function(item) {
          buffer += "<div class='col-lg-3'>";
          buffer += "<button data-index="+ runData.reward.length +" data-id='"+item+"' class='multiple-reward-button btn btn-default btn-lg btn-block'>"+items[item]+"</button>";
          buffer += "</div>";
        });
        break;
      case "B":
        rewards[runData.tier-1][runData.mission].rotB.forEach(function(item) {
          buffer += "<div class='col-lg-3'>";
          buffer += "<button data-index="+ runData.reward.length +" data-id='"+item+"' class='multiple-reward-button btn btn-default btn-lg btn-block'>"+items[item]+"</button>";
          buffer += "</div>";
        });
        break;
      case "C":
        rewards[runData.tier-1][runData.mission].rotC.forEach(function(item) {
          buffer += "<div class='col-lg-3'>";
          buffer += "<button data-index="+ runData.reward.length +" data-id='"+item+"' class='multiple-reward-button btn btn-default btn-lg btn-block'>"+items[item]+"</button>";
          buffer += "</div>";
        });
        break;
    }
    buffer += "</div></div>";
    
    $('.choose-multiple-reward').append(buffer);
  }
  
  //r == round
  function getRotation(r) {
    if (r % 4 === 1 || r % 4 === 2) {
      return "A";
    }
    else if (r % 4 === 3) {
      return "B";
    }
    else if (r % 4 === 0) {
      return "C";
    }
    else {
      throw new Error("NO ROUNDS LIKE THIS ONE. BUG THE DEV TO ADD MORE ROUNDS. OR COME UP WITH A CLEVERER SOLUTION.");
    }
  }
  
  function addReportButton() {
    var buffer = "";
    
    return buffer;
  }
  
  function displaySavePrompt() {
    $('.single-reward-action').removeClass('hidden');
  }
  
  function sendData(tosend) {
    $('.action-result').empty();
    
    //tosend.ts = Date.now();
    console.log("Sending data");
    console.log(tosend);
    
    $.ajax({
      url: '/ajax/saverun',
      data: JSON.stringify(tosend),
      type: 'POST',
      contentType: 'application/json',
      success: function (data) {
        try {
          var response = jQuery.parseJSON(data);
          var buffer = "";
          
          if (response.success) {
            buffer = "<div class='alert alert-success'>Successfully saved. Thank you for contributing! ";
            buffer += "<button id='start-new-run' class='btn btn-success'>Add another run!</button>";
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
  
  $('#manual-entry').click(callbacks.onStartManualEntry);
  $('#live-entry').click(callbacks.onStartLiveEntry);
  $('.tier-button').click(callbacks.onChooseTier);
  $('.mission-button').click(callbacks.onChooseMission);
  $('.single-rewards').on('click', '.single-reward-button', callbacks.onChooseSingleReward);
  $('body').on('click', '.multiple-reward-button', callbacks.onChooseMultipleReward);
  $('#save-single-run').click(callbacks.onSaveSingleRun);
  $('#reset-single-run').click(callbacks.onResetSingleRun);
  $('.action-result').on('click', '#start-new-run', callbacks.onResetSingleRun);
  
});