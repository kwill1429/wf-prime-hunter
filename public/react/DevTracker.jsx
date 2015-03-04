/* jshint browser: true */
/* jshint devel: true */
/* global React, io */

var DevTracker = React.createClass({
  socket: null,
  
  getInitialState: function() {
    return {data: []};
  },
  
  componentDidMount: function() {
    this.socket = io(document.URL);
    this.socket.on('initData', this.onReceivedInitData);
  },
  
  onReceivedInitData: function(response) {
    if (response.success) {
      this.setState({data: response.data});
    }
  },
  
  render: function() {
    var lis = [];
    console.log(this.state.data);
    this.state.data.forEach(function(item) {
      lis.push(
        <li key={item.date}>
          <div className="dev-post-title"><a href={item.url}>{item.title}</a></div>
          <div className="dev-post" dangerouslySetInnerHTML={{__html: item.post}}></div>
          <div className="dev-profile">
            <img src="http://placehold.it/150/150" />
            <a href={item.developer.url}>{item.developer.userID}</a>
          </div>
        </li>);
    });
    
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-10 col-lg-offset-1">
            <div className="filter-options">
              controls and filter options come here
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-10 col-lg-offset-1">
            <ol id="dev-post-list">{lis}</ol>
          </div>
        </div>
      </div>
    );
  }
});


React.render(
  <DevTracker />,
  document.getElementById('devtracker-holder')
);