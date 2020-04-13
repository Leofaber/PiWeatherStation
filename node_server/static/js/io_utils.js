(function(window){
  // You can enable the strict mode commenting the following line
  // 'use strict';

  // This function will contain all our code
  function IOUtils(){
    var _ioUtils = {};

    var socket = io();

    socket.on('connection_status', function(data){
      if(data.connected) {
        $("#connection-status").text("connected");
      } else {
        $("#connection-status").text("disconnected");
      }
    });

    _ioUtils.activate_data_stream = function(){

      socket.on('data-stream', function(data){
        $("#streaming-status").text("activated");
        console.log("new message", data);
        data = JSON.parse(data)
        rtpUtils.add_data("t-plot", data.data_time, data.data_t);
        rtpUtils.add_data("h-plot", data.data_time, data.data_h);
      });
    };

    _ioUtils.deactivate_data_stream = function(){
      $("#streaming-status").text("deactivated");
      socket.off('data-stream');
    };

    _ioUtils.initDatePicker = function(){

        var end = moment();

        $('#datarange').daterangepicker({
            startDate: moment(),
            endDate: moment(),
            timePicker: true,
            ranges: {
               'Today': [moment().set({hours:0, minutes:0, seconds:0}), moment()],
               'Last hour' : [moment().subtract(1, 'hours'), moment()],
               'Past 6 H' : [moment().subtract(6, 'hours'), moment()],
               'Past 12 H' : [moment().subtract(12, 'hours'), moment()], 
               'Past 24 H': [moment().subtract(24, 'hours'), moment()],
               'Last 7 Days': [moment().subtract(6, 'days'), moment()],
               'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            }
        }, cb);
        function cb(start, end){
          $('#datarange span').html(start.format() + ' - ' + end.format());
        }

    };

    _ioUtils.onSelect = function(callback){
      $('#datarange').on('apply.daterangepicker', function(ev, picker) {
        dateS = picker.startDate.unix();
        dateE = moment().unix(); // workaround. pcker.endDate is not updated!!
        callback(dateS, dateE)
      });
    };

    _ioUtils.getData = function(dateS, dateE, success_callback, error_callback){
        console.log("Ajax request to /piws/get_data")
        // call NodeJS API - batch data
        data = {"dateS":dateS, "dateE":dateE};
        console.log("data:",data);
        $.ajax({
            type: 'POST',
            url: "/piws/get_data",
            port: 5000,
            data: data,
            success: function(data){
              console.log("data from server: ", data);

              _ioUtils.deactivate_data_stream()
              rtpUtils.init("t-plot");
              rtpUtils.init("h-plot");
              rtpUtils.add_data("t-plot", data.data_time, data.data_t);
              rtpUtils.add_data("h-plot", data.data_time, data.data_h);
              _ioUtils.activate_data_stream()


            },
            error: function(jqXHR, textStatus, errorThrown){
              console.log(errorThrown);
              $("#error-msg-div").show();
              $("#error-mgs").text(errorThrown);
            }
      });
    };



    return _ioUtils;
  }

  // We need that our library is globally accesible, then we save in the window
  if(typeof(window.ioUtils) === 'undefined'){
    window.ioUtils =IOUtils();
  }
})(window); // We send the window variable withing our function
