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
    var i, j, r;
    var buffer = "<div class=col-lg-3><table class='table table-condensed'>";
    buffer += "<thead><tr><th colspan='2'>"+title+"</th></tr></thead><tbody>";
    
    var t = {
      rotA: [],
      rotB: [],
      rotC: []
    };
    
    //Iterate over rounds
    for (i = 0; i < data.length; i++) {
      //Filter out everything into the rotations, and merge identical items
      for (j = 0; j < data[i].length; j++) {
        r = parseInt(i)+1;
        
        if ( r % 4 === 1 || r % 4 === 2 ) {
          //Rotation A
          mergeIntoArray( t.rotA, data[i][j] );
        }
        else if ( r % 4 === 3 ) {
          //Rotation B
          mergeIntoArray( t.rotB, data[i][j] );
        }
        else if ( r % 4 === 0 ) {
          //Rotation C
          mergeIntoArray( t.rotC, data[i][j] );
        }  
      }
      
    }
    
    //Calculate sums per rotation
    var sumA = 0;
    var sumB = 0;
    var sumC = 0;
    for (i in t.rotA) {
      sumA += t.rotA[i].count;
    }
    for (i in t.rotB) {
      sumB += t.rotB[i].count;
    }
    for (i in t.rotC) {
      sumC += t.rotC[i].count;
    }
    
    //Create DOM
    buffer += "<tr><td colspan='2'><strong>Rotation A</strong></td></tr>";
    for (i in t.rotA) {
      buffer += "<tr><td>"+getItemFromID(t.rotA[i].id)+"</td><td>"+ Math.round((t.rotA[i].count/sumA)*100)+"% ("+t.rotA[i].count+")</td></tr>";
    }
    buffer += "<tr><td colspan='2'><strong>Rotation B</strong></td></tr>";
    for (i in t.rotB) {
      buffer += "<tr><td>"+getItemFromID(t.rotB[i].id)+"</td><td>"+ Math.round((t.rotB[i].count/sumB)*100)+"% ("+t.rotB[i].count+")</td></tr>";
    }
    buffer += "<tr><td colspan='2'><strong>Rotation C</strong></td></tr>";
    for (i in t.rotC) {
      buffer += "<tr><td>"+getItemFromID(t.rotC[i].id)+"</td><td>"+ Math.round((t.rotC[i].count/sumC)*100)+"% ("+t.rotC[i].count+")</td></tr>";
    }
    
    buffer += "</tbody></table></div>";
    
    return buffer;
  }
  
  function mergeIntoArray(arr, item) {
    for(var i in arr) {
      if (arr[i].id === item.id) {
        arr[i].count += item.count;
        return;
      }
    }
    arr.push(item);
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