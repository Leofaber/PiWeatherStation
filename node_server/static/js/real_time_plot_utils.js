(function(window){
  // You can enable the strict mode commenting the following line
  // 'use strict';

  // This function will contain all our code
  function RTPUtils(){
    var _rtpUtils = {};

    var t_layout = {
      showlegend: true,
      xaxis: {
        type: 'date',
        title: 'UTC date'
      },
      yaxis: {
        title: 'Temperature (C°)',
        range: [15,35]
      },
      legend: {
        x: 1,
        xanchor: 'right',
        y: 1
      }
    };
    var h_layout = {
      showlegend: true,
      xaxis: {
        type: 'date',
        title: 'UTC date'
      },
      yaxis: {
        title: 'Humidity (%)',
        range: [20,80]
      },
      legend: {
        x: 1,
        xanchor: 'right',
        y: 1
      }
    };

    var tData = {x:[moment()], y:[0], type:'line', name: 'Temp (C°)', line: {color: 'orange'}, error_y: {type: 'constant', color: 'orange', value: 0.5, thickness: 0.5, width: 2, opacity: 2} };

    var hData = {x:[moment()], y:[0], type:'line', name: 'Hum (%)', line: {color: 'blue'}, error_y: {type: 'constant', color: 'blue', value: 2.5, thickness: 0.5, width: 2, opacity: 2} };

    _rtpUtils.init = function(plotName){
        if (plotName == "t-plot") {
          Plotly.newPlot(plotName, [tData], t_layout);
        }
        if (plotName == "h-plot") {
          Plotly.newPlot(plotName, [hData], h_layout);
        }
    };

    _rtpUtils.initWithData = function(plotName, data_x, data_y){
        if (plotName == "t-plot") {
          tData.x = data_x.map(function(v){
            return moment.unix(v).add(2, 'hours').toISOString();
          });
          tData.y = data_y
          console.log("tData:",tData)
          Plotly.newPlot(plotName, [tData], t_layout);
        }  else {
          hData.x = data_x.map(function(v){
            return moment.unix(v).add(2, 'hours').toISOString();
          });
          hData.y = data_y
          console.log("hData:",hData)
          Plotly.newPlot(plotName, [hData], h_layout);
        }
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
