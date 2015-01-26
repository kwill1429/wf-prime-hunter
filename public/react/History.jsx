var History = React.createClass({
  
  socket: null,
  sessionid: null,
  
  getInitialState: function() {
    this.socket = io('/history');
    
    this.socket.on('connect', this.onSocketConnected);
    this.socket.on('initialLoadResponse', this.onInitialLoadResponse);
    
    return { };
  },
  
  onSocketConnected: function() {
    //sessionid = socket.socket.sessionid;
    this.sessionid = this.socket.io.engine.id;
    
    this.socket.emit('getInitialLoad', { id:this.sessionid});
  },
  
  onInitialLoadResponse: function(docs) {
    console.log(docs);
  },
  
  render: function() {
    return (
      <h1>Lets try this</h1>
    );
  }
});

React.render(
  <History />,
  document.getElementById('history-holder')
);