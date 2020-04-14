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
      },
      shapes: [
        // 1st highlight during Feb 4 - Feb 6
        {
            type: 'rect',
            // x-reference is assigned to the x-values
            xref: 'paper',
            // y-reference is assigned to the plot paper [0,1]
            yref: 'y',
            x0: 0,
            x1: 1,
            y0: 18,
            y1: 24,
            fillcolor: '#c2f0c2',
            opacity: 0.3,
            line: {
                width: 0
            }
        }]
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
      },
      shapes: [
        // 1st highlight during Feb 4 - Feb 6
        {
            type: 'rect',
            // x-reference is assigned to the x-values
            xref: 'paper',
            // y-reference is assigned to the plot paper [0,1]
            yref: 'y',
            x0: 0,
            x1: 1,
            y0: 45,
            y1: 55,
            fillcolor: '#c2f0c2',
            opacity: 0.3,
            line: {
                width: 0
            }
        }]
    };

    var tData = {x:[moment()], y:[0], type:'line', name: 'Temp (C°)', line: {color: '#ff9933'}, error_y: {type: 'constant', color: '#ffcc99', value: 0.5, thickness: 0.5, width: 1, opacity: 2} };

    var hData = {x:[moment()], y:[0], type:'line', name: 'Hum (%)', line: {color: '#00ccff'}, error_y: {type: 'constant', color: '#99ebff', value: 2.5, thickness: 0.5, width: 1, opacity: 2} };

    var maxNumberOfPointToKeep = 34560 // 86400 / 2.5

    _rtpUtils.init = function(plotName){

        if (plotName == "t-plot") {
          tData.x = [moment()];
          tData.y = [0];
          Plotly.newPlot(plotName, [tData], t_layout);
        }
        if (plotName == "h-plot") {
          hData.x = [moment()];
          hData.y = [0];
          Plotly.newPlot(plotName, [hData], h_layout);
        }
    };

    /*
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
    */

    _rtpUtils.add_data = function(plotName, data_x, data_y){

      data_x = data_x.map(function(v){
        return moment.unix(v).add(2, 'hours').toISOString();
      });

      Plotly.extendTraces(plotName, { x: [data_x], y: [data_y] }, [0], maxNumberOfPointToKeep)
    }



    return _rtpUtils;
  }

  // We need that our library is globally accesible, then we save in the window
  if(typeof(window.rtpUtils) === 'undefined'){
    window.rtpUtils = RTPUtils();
  }
})(window); // We send the window variable withing our function
