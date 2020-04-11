(function(window){
  // You can enable the strict mode commenting the following line
  // 'use strict';

  // This function will contain all our code
  function RTPUtils(){
    var _rtpUtils = {};

    var layout = {
      showlegend: true,
      xaxis: {
        type: 'date',
        title: 'UTC date'
      },
      legend: {
        x: 1,
        xanchor: 'right',
        y: 1
      }
    };

    var tData = {x:[moment()], y:[0], type:'line', name: 'Temperature (C°)', color: 'orange'};
    var hData = {x:[moment()], y:[0], type:'line', name: 'Umidity (g/m3)', color: 'blue'};

    _rtpUtils.init = function(plotName){
        Plotly.newPlot(plotName, [tData, hData], layout);
    };

    _rtpUtils.initWithData = function(plotName, data){
        tData.x = data.data_time;
        tData.y = data.data_t;

        hData.x = data.data_time;
        hData.y = data.data_h;
        console.log(tData)
        Plotly.newPlot(plotName, [tData, hData], layout);
    };

    _rtpUtils.resetPlot = function(plotName){
        Plotly.deleteTraces(plotID, 0);
        Plotly.deleteTraces(plotID, 1);
    };


    _rtpUtils.goRealTime = function(plotName){
        setInterval(function() {
          Plotly.extendTraces(plotName, { y: [[getData()]] }, [0])
          Plotly.extendTraces(plotName, { y: [[getData()]] }, [1])
        }, 1000);
    }

    _rtpUtils.goRealTime = function(plotName){
        setInterval(function() {
          Plotly.extendTraces(plotName, { y: [[getData()]] }, [0])
          Plotly.extendTraces(plotName, { y: [[getData()]] }, [1])
        }, 1000);
    }

    return _rtpUtils;
  }

  // We need that our library is globally accesible, then we save in the window
  if(typeof(window.rtpUtils) === 'undefined'){
    window.rtpUtils = RTPUtils();
  }
})(window); // We send the window variable withing our function
