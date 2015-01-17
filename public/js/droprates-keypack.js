/* jshint browser: true */
/* jshint jquery: true */
/* jshint devel: true */
/* globals Chart */

$(document).ready(function() {
  
  getDataLoad();
  
  function getDataLoad() {
    $.ajax({
      url: '/ajax/getkeypack',
      type: 'POST',
      contentType: 'application/json',
      success: function (data) {
        try {
          var response = jQuery.parseJSON(data);
          var buffer = "";
          
          if (response.success) {
            //console.log(response.data);
            displayTierChart(response.data);
            displayMissionChart(response.data);
          }
          else {
            console.log(response.error);
          }
        }
        catch(exception) {
          console.log(exception);
        }
      },
      error: function (xhr, status, error) {
        console.log(error);
      },
    });
  }
  
  function displayTierChart(data) {
    var i;
    var t = [{
      value: 0,
      label: "Tier 1",
      color: "#001F3F"
      //highlight: "#FF5A5E"
    },
    {
      value: 0,
      label: "Tier 2",
      color: "#0074D9"
    },
    {
      value: 0,
      label: "Tier 3",
      color: "#39CCCC"
    },
    {
      value: 0,
      label: "Tier 4",
      color: "#2ECC40"
    }];
    
    var sum = 0;
    
    //Summarize keys by tier
    for(i in data) {
      sum += data[i].count;
      switch(data[i]._id.t) {
        case 1:
          t[0].value += data[i].count;
          break;
        case 2:
          t[1].value += data[i].count;
          break;
        case 3:
          t[2].value += data[i].count;
          break;
        case 4:
          t[3].value += data[i].count;
          break;
      }
    }
    
    for(i in t) {
      t[i].value = Math.round((t[i].value / sum)*100);
    }
    
    var ctx = document.getElementById("tier-canvas").getContext("2d");
    var tierDoughnut = new Chart(ctx).Doughnut(t, {tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>%"});
    
    $('.tier-legend-holder').append(tierDoughnut.generateLegend());
  }
  
  function displayMissionChart(data) {
    var i;
    var t = [{
      value: 0,
      label: "Capture",
      color: "#095AB2"
    },
    {
      value: 0,
      label: "Defense",
      color: "#CC0B40"
    },
    {
      value: 0,
      label: "Exterminate",
      color: "#B21E12"
    },
    {
      value: 0,
      label: "Interception",
      color: "#19FF49"
    },
    {
      value: 0,
      label: "Mobile Defense",
      color: "#FF8B00"
    },
    {
      value: 0,
      label: "Sabotage",
      color: "#CC14C4"
    },
    {
      value: 0,
      label: "Survival",
      color: "#FFF027"
    }];
    
    var sum = 0;
    
    //Summarize keys by mission
    for(i in data) {
      sum += data[i].count;
      switch(data[i]._id.m) {
        case "CAP":
          t[0].value += data[i].count;
          break;
        case "DEF":
          t[1].value += data[i].count;
          break;
        case "EXT":
          t[2].value += data[i].count;
          break;
        case "INT":
          t[3].value += data[i].count;
          break;
        case "MD":
          t[4].value += data[i].count;
          break;
        case "SAB":
          t[5].value += data[i].count;
          break;
        case "SUR":
          t[6].value += data[i].count;
          break;
      }
    }
    
    for(i in t) {
      t[i].value = Math.round((t[i].value / sum)*100);
    }
    
    var ctx = document.getElementById("mission-canvas").getContext("2d");
    var missionDoughnut = new Chart(ctx).Doughnut(t, {tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>%"});
    
    $('.mission-legend-holder').append(missionDoughnut.generateLegend());
  }
  
});