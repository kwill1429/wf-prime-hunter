var RewardRow = React.createClass({

  transformIDtoText: function(id) {
    return window.PHitems[id];
  },
  
  render: function() {
    return (
      <li>{ this.transformIDtoText(this.props.id) }</li>
    );
  }
});

var HistoryRow = React.createClass({
  
  transformMissionName: function(mission) {
    switch(mission) {
      case "capture":
        return "Capture";
      case "exterminate":
        return "Exterminate";
      case "defense":
        return "Defense";
      case "sabotage":
        return "Sabotage";
      case "survival":
        return "Survival";
      case "interception":
        return "Interception";
      case "mobiledefense":
        return "Mobile Defense";
      default:
        return mission;
    }
  },

  transformTier: function(tier) {
    if (tier <= 4) {
      return "Tier "+tier;
    }
    else {
      return "Orokin Derelict";
    }
  },
  
  render: function() {
    var rewards = [];
    this.props.data.reward.forEach(function(item, index) {
      rewards.push(<RewardRow id={item} key={"r-"+index} />);
    });
    
    return (
      <tr>
        <td>{moment( new Date(this.props.data.ts) ).format('MMMM Do YYYY, h:mm:ss a')}</td>
        <td>{this.transformTier(this.props.data.tier)}</td>
        <td>{this.transformMissionName(this.props.data.mission)}</td>
        <td><ul>{rewards}</ul></td>
      </tr>
    );
  }
});

var History = React.createClass({
  
  getInitialState: function() {
    return {data: [] };
  },
  
  componentDidMount: function() {
    $.ajax({
      url: '/ajax/gethistory',
      type: 'POST',
      contentType: 'application/json',
      success: function (data) {
        try {
          var response = jQuery.parseJSON(data);
          
          if (response.success) {
            this.setState({data: response.data});
          }
          else {
            console.error(response.error);
          }
        }
        catch(exception) {
          console.error(exception);
        }
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  
  render: function() {
    
    var rows = [];
    this.state.data.forEach(function(row, index) {
      rows.push( 
        <HistoryRow data={row} key={"h-"+index}/>
      );
    });
    
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Tier</th>
            <th>Mission</th>
            <th>Reward</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});

React.render(
  <History />,
  document.getElementById('history-holder')
);