init = function() {
  

}

load_data = function(){
  Plotly.plot('tu-chart',[{
         y:[real_time_plot_utils.getData()],
         type:'line'
  }]);
}
