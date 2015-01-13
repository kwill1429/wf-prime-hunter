/* jshint browser: true */
/* jshint jquery: true */

$(document).ready(function() {
  "use strict";
  
  var reportWidget = "<div class=report-widget><button class='btn btn-primary' data-toggle='modal' data-target='#feedback-modal'>Send Feedback</button></div>";
  var modalWidget = "<div id='feedback-modal' class='modal fade'><div class=modal-dialog><div class=modal-content><div class=modal-header>";
  modalWidget += "<button type=button class=close data-dismiss=modal><span>&times;</span></button>";
  modalWidget += "<h4 class=modal-title>Feedback</h4></div><div id=feedback-modal-body class=modal-body>";
  
  modalWidget += "<p>Did you find an error, missing prime parts, or bugs? Do you have any positive or negative comments? Go ahead and send it to me.</p>";
  
  modalWidget += "<form>";
  modalWidget += "<div class=form-group><label for=feedback-textarea>Feedback</label>";
  modalWidget += "<textarea class=form-control id=feedback-textarea rows=5></textarea></div>";
  
  modalWidget += "</form></div>";
  modalWidget += "<div class=modal-footer><button type=button class='btn btn-default' data-dismiss=modal>Close</button>";
  modalWidget += "<button id=send-feedback type=button class='btn btn-primary'>Send Feedback</button></div></div></div></div>";
      
  
  $('body').append(reportWidget);
  $('body').append(modalWidget);
  
  var callbacks = {
    onSendFeedback: function(evt) {
      evt.preventDefault();
      
      var data = {
        comment: $('#feedback-textarea').val()
      };
      
      sendAjax(data, function(err) {
        closeModal();
        if (err) {
          $.toaster({ 
            title : 'Error sending the feedback', 
            priority : 'danger', 
            message : err,
            settings: {
              timeout: 5000
            }
          });
        }
        else {
          $.toaster({ 
            title : 'Successfully sent feedback.', 
            priority : 'success', 
            message : 'Thank You!',
            settings: {
              timeout: 5000
            }
          });
        }
        
      });
    }
  };
  
  function closeModal() {
    $('#feedback-modal').modal('hide');
  }
  
  function sendAjax(tosend, callback) {
    $.ajax({
      url: '/ajax/savefeedback',
      data: JSON.stringify(tosend),
      type: 'POST',
      contentType: 'application/json',
      success: function (data) {
        try {
          var response = jQuery.parseJSON(data);
          
          if (response.success) {
            callback(null);
          }
          else {
            callback("ERROR not saved");
          }
        }
        catch(exception) {
          callback("ERROR parsing");
        }
      },
      error: function (xhr, status, error) {
        callback("ERROR no connection");
      },
    });
  }
  
  $('body').on('click', '#send-feedback', callbacks.onSendFeedback);
});