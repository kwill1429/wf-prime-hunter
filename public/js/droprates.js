/* jshint browser: true */
/* jshint jquery: true */
/* jshint devel: true */

$(document).ready(function() {

  var callbacks = {
    onLoadT1Data: function() {
      fetchTowerData(1, function(err, data) {
        if (err) {
          console.log(err);
        }
        else {
          displayData(1, data);      
        }
      });
    },
    onLoadT2Data: function() {
      fetchTowerData(2, function(err, data) {
        if (err) {
          console.log(err);
        }
        else {
          displayData(2, data);      
        }
      });
    },
    onLoadT3Data: function() {
      fetchTowerData(3, function(err, data) {
        if (err) {
          console.log(err);
        }
        else {
          displayData(3, data);      
        }
      });
    },
    onLoadT4Data: function() {
      fetchTowerData(4, function(err, data) {
        if (err) {
          console.log(err);
        }
        else {
          displayData(4, data);      
        }
      });
    }
  };
  
  function displayData(tier, data) {
    var buffer = "";
    if (tier === 1) {
      buffer = "<div class=row><div class=col-lg-3><h3>T"+tier+"</h3></div></div>";
      buffer += domifyMultiRewardMission(data.def, "Defense", "Wave");
      buffer += domifyMultiRewardMission(data.sur, "Survival", "Minute");
      buffer += domifySingleRewardMission(data.cap, "Capture");
      buffer += domifySingleRewardMission(data.ext, "Exterminate");
      buffer += domifySingleRewardMission(data.md, "Mobile Defense");
      buffer += domifySingleRewardMission(data.sab, "Sabotage");
      
      $('#t1dataholder').empty().append(buffer);
    }
    else if (tier === 2) {
      buffer = "<div class=row><div class=col-lg-3><h3>T"+tier+"</h3></div></div>";
      buffer += domifyMultiRewardMission(data.def, "Defense", "Wave");
      buffer += domifyMultiRewardMission(data.sur, "Survival", "Minute");
      buffer += domifySingleRewardMission(data.cap, "Capture");
      buffer += domifySingleRewardMission(data.ext, "Exterminate");
      buffer += domifySingleRewardMission(data.md, "Mobile Defense");
      buffer += domifySingleRewardMission(data.sab, "Sabotage");
      
      $('#t2dataholder').empty().append(buffer);
    }
    else if (tier === 3) {
      buffer = "<div class=row><div class=col-lg-3><h3>T"+tier+"</h3></div></div>";
      buffer += domifyMultiRewardMission(data.def, "Defense", "Wave");
      buffer += domifyMultiRewardMission(data.sur, "Survival", "Minute");
      buffer += domifySingleRewardMission(data.cap, "Capture");
      buffer += domifySingleRewardMission(data.ext, "Exterminate");
      buffer += domifySingleRewardMission(data.md, "Mobile Defense");
      buffer += domifySingleRewardMission(data.sab, "Sabotage");
      
      $('#t3dataholder').empty().append(buffer);
    }
    else if (tier === 4) {
      buffer = "<div class=row><div class=col-lg-3><h3>T"+tier+"</h3></div></div>";
      buffer += domifyMultiRewardMission(data.def, "Defense", "Wave");
      buffer += domifyMultiRewardMission(data.sur, "Survival", "Minute");
      buffer += domifyMultiRewardMission(data.int, "Interception", "Round");
      buffer += domifySingleRewardMission(data.cap, "Capture");
      buffer += domifySingleRewardMission(data.ext, "Exterminate");
      buffer += domifySingleRewardMission(data.md, "Mobile Defense");
      buffer += domifySingleRewardMission(data.sab, "Sabotage");
      
      $('#t4dataholder').empty().append(buffer);
    }
  }
  
  function domifySingleRewardMission(data, title) {
    var buffer = "<div class=col-lg-3><table class='table table-condensed'>";
    buffer += "<thead><tr><th colspan='2'>"+title+"</th></tr><tr><th>Item</th><th>Drop %</th></tr></thead><tbody>";
    
    var sarr = data.sort();
    var sum = 0;
    
    data.forEach(function(item) {
      sum += item.count;
    });
    
    data.forEach(function(item) {
      buffer += "<tr><td>"+ getItemFromID(item._id) +"</td><td>"+Math.round((item.count/sum)*100)+"% ("+item.count+")</td></tr>";
    });
    
    buffer += "</tbody></table></div>";
    
    return buffer;
  }
  
  function domifyMultiRewardMission(data, title, roundName) {
    var buffer = "<div class=col-lg-3><table class='table table-condensed'>";
    buffer += "<thead><tr><th colspan='2'>"+title+"</th></tr></thead><tbody>";
    console.log(data);
    
    for (var i = 0; i < data.length; i++) {
      var j;
      switch (roundName) {
        case "Wave":
          buffer += "<tr><td colspan='2'><strong>Wave "+(i+1)*5+"</strong></td></tr>";
          break;
        case "Minute":
          buffer += "<tr><td colspan='2'><strong>"+(i+1)*5+" Minutes</strong></td></tr>";
          break;
        case "Round":
          buffer += "<tr><td colspan='2'><strong>Round "+(i+1)+"</strong></td></tr>";
          break;
      }
      
      
      var sum = 0;
      
      for (j = 0; j < data[i].length; j++) {
        sum += data[i][j].count;
      }
      
      for (j = 0; j < data[i].length; j++) {
        buffer += "<tr>";
        buffer += "<td>"+getItemFromID(data[i][j].id)+"</td><td>"+ Math.round((data[i][j].count/sum)*100)+"% ("+data[i][j].count+")</td>";
        buffer += "</tr>";
      }
      
    }
    buffer += "</tbody></table></div>";
    
    return buffer;
  }
  
  function fetchTowerData(tier, callback) {
    $.ajax({
      url: '/ajax/gettower/'+tier,
      //data: JSON.stringify(tosend),
      type: 'POST',
      contentType: 'application/json',
      success: function (data) {
        try {
          var response = jQuery.parseJSON(data);
          var buffer = "";
          
          if (response.success) {
            callback(null, response.data);
          }
          else {
            callback("ERROR on server", null);
          }
        }
        catch(exception) {
          callback("ERROR parsing", null);
        }
      },
      error: function (xhr, status, error) {
        callback("ERROR in conncetion", null);
      },
    });
  }
  
  $('#load-t1-data').click(callbacks.onLoadT1Data);
  $('#load-t2-data').click(callbacks.onLoadT2Data);
  $('#load-t3-data').click(callbacks.onLoadT3Data);
  $('#load-t4-data').click(callbacks.onLoadT4Data);
  
  function getItemFromID(id) {
    return window.PHitems[id];
  }
});