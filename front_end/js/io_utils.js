(function(window){
  // You can enable the strict mode commenting the following line
  // 'use strict';

  // This function will contain all our code
  function IOUtils(){
    var _ioUtils = {};


    _ioUtils.initDatePicker = function(){

        var end = moment();

        $('#datarange').daterangepicker({
            startDate: moment(),
            endDate: moment(),
            timePicker: true,
            ranges: {
               'Today': [moment().set({hours:0, minutes:0, seconds:0}), moment()],
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
        $("#error-msg-div").hide();
        dateS = picker.startDate.unix();
        dateE = moment().unix(); // workaround. pcker.endDate is not updated!!
        callback(dateS, dateE)
      });
    };

    _ioUtils.getData = function(dateS, dateE, success_callback, error_callback){
        console.log("Ajax request..")
        // call NodeJS API - batch data
        data = {"dateS":dateS, "dateE":dateE};
        console.log("data:",data);
        $.ajax({
            type: 'POST',
            url: "/piws/get_data",
            port: 5000,
            data: data,
            success: function(result){
              success_callback(result)
            },
            error: function(jqXHR, textStatus, errorThrown){
              console.log(errorThrown);
              error_callback(errorThrown)
            }

      });

    }


    _ioUtils.connectToSocket = function(){
        // call SocketIO API - streaming
    };

    return _ioUtils;
  }

  // We need that our library is globally accesible, then we save in the window
  if(typeof(window.ioUtils) === 'undefined'){
    window.ioUtils =IOUtils();
  }
})(window); // We send the window variable withing our function
