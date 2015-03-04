/* jshint browser: true */
/* jshint devel: true */
/* globals React */

var MissionChooser = React.createClass({
  onHandleChooseMission: function(evt) {
    this.props.changedMission(evt.target.innerHTML);
  },
  
  missionTypes: [
    "CAP",
    "DEF",
    "EXT",
    "INT",
    "MD",
    "SAB",
    "SUR"
  ],
  
  render: function() {
    var btns = [];
    var that = this;
    this.missionTypes.forEach(function(m) {
      
      if (that.props.selectedTier === 4) {
        if (m === that.props.selectedMission) {
          btns.push(
            <button type="button" 
                    className="btn btn-primary" 
                    key={that.props.selectedTier + "-"+m}>
              {m}
            </button>
          );
        }
        else {
          btns.push(
            <button type="button" 
                    className="btn btn-default" 
                    key={that.props.selectedTier + "-"+m} 
                    onClick={that.onHandleChooseMission}>
              {m}
            </button>
          );
        }  
      }
      else {
        if (m === "INT") {
          btns.push(
            <button type="button" 
                    className="btn btn-default disabled" 
                    key={that.props.selectedTier + "-"+m}>
              {m}
            </button>
          );
        }
        else if (m === that.props.selectedMission) {
          btns.push(
            <button type="button" 
                    className="btn btn-primary" 
                    key={that.props.selectedTier + "-"+m}>
              {m}
            </button>
          );
        }
        else {
          btns.push(
            <button type="button" 
                    className="btn btn-default" 
                    key={that.props.selectedTier + "-"+m} 
                    onClick={that.onHandleChooseMission}>
              {m}
            </button>
          );
        }
      }
      
      
    });
    
    return (
      <div className="btn-group">
        {btns}
      </div>
    );
  }
});

var TierChooser = React.createClass({
  onHandleChooseTier: function(evt) {
    this.props.changedTier(evt.target.innerHTML);
  },
  
  render: function() {
    
    var btns = [];
    for (var i = 1; i <= 4; i++) {
      if (i === this.props.selectedTier) {
        btns.push(<button type="button" className="btn btn-primary" key={this.props.selectedTier + "-"+i}>{i}</button>);
      }
      else {
        btns.push(<button type="button" className="btn btn-default" key={this.props.selectedTier + "-"+i} onClick={this.onHandleChooseTier}>{i}</button>);
      }
    }
    
    return (
      <div className="btn-group">
        {btns}
      </div>
    );
  }
});

var PackEntry = React.createClass({
  getInitialState: function() {
    return {tier: -1, mission: ""};
  },
  
  onChangeTier: function(tier) {
    var newtier = parseInt(tier);
    
    //Make sure if not T4 is selected, disable interception
    if (newtier < 4 && this.state.mission === "INT") {
      this.setState({tier: newtier, mission: "" });  
    }
    else {
      this.setState({tier: newtier });  
    }
    
  },
  
  onChangeMission: function(mission) {
    this.setState({mission: mission });
  },
  
  componentWillUpdate: function(nextProps, nextState) {
    if (nextState.tier !== -1 && nextState.mission !== "") {
      this.props.keyComplete(this.props.number, nextState);
    }
    else {
      this.props.keyIncomplete(this.props.number);
    }
  },
  
  render: function() {
    return (
      <div className="col-lg-4 col-md-4 col-sm-4 random-key-chooser">
        <h2>Key {this.props.number}</h2>
        <p><strong>TIER</strong></p>
        <TierChooser selectedTier={this.state.tier} changedTier={this.onChangeTier} />
        <p><br /><strong>MISSION</strong></p>
        <MissionChooser selectedTier={this.state.tier} selectedMission={this.state.mission} changedMission={this.onChangeMission} />
      </div>
    );
  }
});

var RewardKeypack = React.createClass({
  
  getInitialState: function() {
    return {
      key1: {tier: -1, mission: ""},
      key2: {tier: -1, mission: ""},
      key3: {tier: -1, mission: ""},
      isComplete: false
    };
  },
  
  onKeyComplete: function(key, data) {
    var t = this.state;
    if (t['key'+key].tier !== data.tier || t['key'+key].mission !== data.mission) {
      t['key'+key] = data;
      this.setState(t);  
    }
  },
  
  onKeyIncomplete: function(key) {
    var t = this.state;
    t['key'+key] = {tier: -1, mission: ""};
    //this.setState(t); 
  },
  
  componentDidUpdate: function(prevProps, prevState) {
    if (prevState.key1.tier !== -1 &&
        prevState.key1.mission !== "" &&
        prevState.key2.tier !== -1 &&
        prevState.key2.mission !== "" &&
        prevState.key3.tier !== -1 &&
        prevState.key3.mission !== "") {
      console.log("we have a full keypack, show saving");
      //this.setState({isComplete: true});
    }
    else {
      //this.setState({isComplete: false});
      console.log("not full pack");
    }
  },
  
  render: function() {
    return (
      <div className="row">
        <PackEntry number={1} keyComplete={this.onKeyComplete} keyIncomplete={this.onKeyIncomplete}/>
        <PackEntry number={2} keyComplete={this.onKeyComplete} keyIncomplete={this.onKeyIncomplete}/>
        <PackEntry number={3} keyComplete={this.onKeyComplete} keyIncomplete={this.onKeyIncomplete}/>
      </div>
    );
  }
});

React.render(
  <RewardKeypack />,
  document.getElementById('reward-keypack-holder')
);