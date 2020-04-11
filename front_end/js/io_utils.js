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
               'Today': [moment(), moment().set({hours:0, minutes:0, seconds:0})],
               'Past 24 H': [moment(), moment().subtract(24, 'hours')],
               'Last 7 Days': [moment().subtract(6, 'days'), moment()],
               'Last 30 Days': [moment().subtract(29, 'days'), moment()],
               'This Month': [moment().startOf('month'), moment().endOf('month')],
               'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);
        function cb(start, end){
          $('#datarange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }

    };

    _ioUtils.onSelect = function(callback){
      $('#datarange').on('apply.daterangepicker', function(ev, picker) {
        dateE = picker.startDate.toISOString();
        dateS = picker.endDate.toISOString();
        callback(dateS, dateE)
      });
    };

    _ioUtils.getData = function(dateS, dateE, callback){
        console.log("Ajax request..")
        // call NodeJS API - batch data

        $.ajax({
            type: 'POST',
            url: "/piws/get_data",
            port: 5000,
            data: {"dateS":dateS, "dateE":dateE},
            success: function(result){
              console.log("Ajax request success!")
              callback(result)
            },
            error: function(jqXHR, textStatus, errorThrown){
              console.log("Error!")
              console.log(textStatus)
              console.log(errorThrown)
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
