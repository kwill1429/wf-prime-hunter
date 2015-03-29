/* jshint browser: true */
/* jshint jquery: true */
/* global React */

var PureRenderMixin = React.addons.PureRenderMixin;
var FluxMixin = window.Fluxxor.FluxMixin(React);
var StoreWatchMixin = window.Fluxxor.StoreWatchMixin;

///////////////////////////////////////////////////////////////////////////////
// Flux Stores

var constants = {
  SET_TIER_ON_KEY: "SET_TIER_ON_KEY",
  SET_MISSION_ON_KEY: "SET_MISSION_ON_KEY",
  RESET_KEYPACK: "RESET_KEYPACK",
  SAVE_KEYPACK: "SAVE_KEYPACK"
};

var KeypackStore = window.Fluxxor.createStore({
  
  initialize: function() {
    this.keypack = this.resetKeypack();
    
    this.canBeSaved = false;
    this.isLoading = false;

    this.bindActions(
      constants.SET_TIER_ON_KEY, this.onSetTierOnKey,
      constants.SET_MISSION_ON_KEY, this.onSetMissionOnKey,
      constants.RESET_KEYPACK, this.onResetKeypack,
      constants.SAVE_KEYPACK, this.onSaveKeypack
    );
    
  },
  
  onSetTierOnKey: function(payload) {
    this.keypack[payload.keyNum].tier = payload.newTier;
    
    this.checkInvalidStates();
    this.checkIfCanBeSaved();
    
    this.emit("change");
  },
  
  onSetMissionOnKey: function(payload) {
    this.keypack[payload.keyNum].mission = payload.newMission;
    
    this.checkInvalidStates();
    this.checkIfCanBeSaved();
    
    this.emit("change");
  },
  
  onResetKeypack: function() {
    this.keypack = this.resetKeypack();
    
    this.canBeSaved = false;
    
    this.emit("change");
  },
  
  onSaveKeypack: function() {
    //Fire off ajax
    
    //Transform data into this stupid format
    var tosend = {
      key1: {
        tier: this.keypack[0].tier,
        mission: this.keypack[0].mission
      },
      key2: {
        tier: this.keypack[1].tier,
        mission: this.keypack[1].mission
      },
      key3: {
        tier: this.keypack[2].tier,
        mission: this.keypack[2].mission
      }
    };
    
    var that = this;
    
    $.ajax({
      url: '/ajax/savekeypack',
      data: JSON.stringify(tosend),
      type: 'POST',
      contentType: 'application/json',
      success: function (data) {
        try {
          //var response = jQuery.parseJSON(data);
          //if (response.success) {}
          that.onFinishedSaving();
          
        }
        catch(exception) {
          //TODO: add proper error display
        }
      },
      error: function (xhr, status, error) {
        //TODO: add proper error display
      },
    });
    
    this.isLoading = true;
    
    this.emit("change");
  },
  
  onFinishedSaving: function() {
    this.keypack = this.resetKeypack();
    this.canBeSaved = false;
    this.isLoading = false;
    
    this.emit("change");
  },
  
  resetKeypack: function() {
    return [
      {
        tier: 0,
        mission: ""
      },
      {
        tier: 0,
        mission: ""
      },
      {
        tier: 0,
        mission: ""
      }
    ];
  },
  
  checkIfCanBeSaved: function() {
    if (this.keypack[0].tier !== 0 &&
        this.keypack[1].tier !== 0 &&
        this.keypack[2].tier !== 0 &&
        this.keypack[0].mission !== "" &&
        this.keypack[1].mission !== "" &&
        this.keypack[2].mission !== "") {
      this.canBeSaved = true;
    }
  },
  
  checkInvalidStates: function() {
    //Interception only happens on T4
    for (var i = 0; i < this.keypack.length; i++) {
      if (this.keypack[i].tier < 4 && this.keypack[i].mission === "INT") {
        this.keypack[i].mission = "";
      }
    }
  },
  
  getState: function() {
    return {
      keypack: this.keypack,
      canBeSaved: this.canBeSaved,
      isLoading: this.isLoading
    };
  }
});

var actions = {
  setTierOnKey: function(payload) {
    this.dispatch(constants.SET_TIER_ON_KEY, payload);
  },
  
  setMissionOnKey: function(payload) {
    this.dispatch(constants.SET_MISSION_ON_KEY, payload);
  },
  
  resetKeypack: function() {
    this.dispatch(constants.RESET_KEYPACK);
  },
  
  saveKeypack: function() {
    this.dispatch(constants.SAVE_KEYPACK);
  }
};

var stores = {
  KeypackStore: new KeypackStore()
};

var flux = new window.Fluxxor.Flux(stores, actions);
window.flux = flux;

//flux.on("dispatch", function(type, payload) {
//  console.log("[Dispatch]", type, payload);
//});

///////////////////////////////////////////////////////////////////////////////
//  Page components

var TierChooser = React.createClass({
  
  mixins: [PureRenderMixin, FluxMixin],
  
  handleChooseTier: function(btnTier, evt) {
    this.getFlux().actions.setTierOnKey({keyNum: this.props.keyNum-1, newTier: parseInt(btnTier)});
  },
  
  render: function() {
    
    var btns = [];
    for (var i = 1; i <= 4; i++) {
      if (i === this.props.tier) {
        btns.push(
          <button type="button" 
                  className="btn btn-primary" 
                  key={this.props.tier + "-"+i}
                  >
          {i}
          </button>
        );
      }
      else {
        btns.push(
          <button type="button" 
                  className="btn btn-default" 
                  key={this.props.tier + "-"+i}
                  onClick={this.handleChooseTier.bind(this, i)}
                  >
          {i}
          </button>
        );
      }
    }
    
    return (
      <div className="btn-group">
        {btns}
      </div>
    );
  }
});

var MissionChooser = React.createClass({
  
  mixins: [PureRenderMixin, FluxMixin],
  
  handleChooseMission: function(btnMission, evt) {
    this.getFlux().actions.setMissionOnKey({keyNum: this.props.keyNum-1, newMission: btnMission});
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
    
    for (var i = 0; i < this.missionTypes.length; i++) {
      if (this.props.tier === 4) {
        if (this.missionTypes[i] === this.props.mission) {
          btns.push(
            <button type="button" 
                    className="btn btn-primary" 
                    key={this.keyNum + "-"+this.missionTypes[i]}>
            {this.missionTypes[i]}
            </button>
          );
        }
        else {
          //Simple Unselected one  
          btns.push(
            <button type="button" 
                    className="btn btn-default" 
                    key={this.keyNum + "-"+this.missionTypes[i]}
                    onClick={this.handleChooseMission.bind(this, this.missionTypes[i])}>
            {this.missionTypes[i]}
            </button>
          );
        }
      }
      else {
        if (this.missionTypes[i] === "INT") {
          //Disabled int button
          btns.push(
            <button type="button" 
                    className="btn btn-default disabled" 
                    key={this.keyNum + "-"+this.missionTypes[i]}>
            {this.missionTypes[i]}
            </button>
          );
        }
        else if (this.missionTypes[i] === this.props.mission) {
          btns.push(
            <button type="button" 
                    className="btn btn-primary" 
                    key={this.keyNum + "-"+this.missionTypes[i]}>
            {this.missionTypes[i]}
            </button>
          );
        }
        else {
          //Simple Unselected one  
          btns.push(
            <button type="button" 
                    className="btn btn-default" 
                    key={this.keyNum + "-"+this.missionTypes[i]}
                    onClick={this.handleChooseMission.bind(this, this.missionTypes[i])}>
            {this.missionTypes[i]}
            </button>
          );
        }
      }
      
    }
    
    return (
      <div className="btn-group">
        {btns}
      </div>
    );
  }
});

var KeyRecorder = React.createClass({
  
  mixins: [PureRenderMixin],
  
  render: function() {
    return (
      <div className="col-lg-4 col-md-4 col-sm-4">
        <h2>Key {this.props.number}</h2>
        <p><strong>TIER</strong></p>
      
        <TierChooser tier={this.props.tier} keyNum={this.props.number}/>
        <p><br /><strong>MISSION</strong></p>
      
        <MissionChooser tier={this.props.tier} mission={this.props.mission} keyNum={this.props.number}/>
      </div>
    );
  }
});

var RecordKeypack = React.createClass({
  
  mixins: [FluxMixin, StoreWatchMixin("KeypackStore")],
  
  getStateFromFlux: function() {
    var flux = this.getFlux();
    return  {
      keypack: flux.store("KeypackStore").getState().keypack,
      canBeSaved: flux.store("KeypackStore").getState().canBeSaved,
      isLoading: flux.store("KeypackStore").getState().isLoading
    };
  },
  
  handleReset: function() {
    this.getFlux().actions.resetKeypack();
  },
  
  handleSave: function() {
    this.getFlux().actions.saveKeypack();
  },
  
  render: function() {
    var keyRecorders = [];
    for (var i = 0; i < this.state.keypack.length; i++) {
      keyRecorders.push(
        <KeyRecorder 
          key={"key-recorder-"+i}
          number={i+1}
          tier={this.state.keypack[i].tier}
          mission={this.state.keypack[i].mission}
        />
      );  
    }
    
    var spinner = this.state.isLoading ? <i key="spinner" className="fa fa-circle-o-notch fa-spin"></i> : null;
    
    return (
      <div>
        <div className="row">
          {keyRecorders}
        </div>
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 record-keypack-save-form">
            <button type="button" className={this.state.canBeSaved ? "btn btn-primary" : "btn btn-primary disabled"} onClick={this.handleSave}>Save Void Keypack {spinner}</button>
            <button type="button" className="btn btn-default" onClick={this.handleReset}>RESET</button>
          </div>
        </div>
      </div>
    );
  }
  
});

React.render(
  <RecordKeypack flux={flux} />,
  document.getElementById('record-keypack-holder')
);