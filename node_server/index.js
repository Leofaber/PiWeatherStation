var express = require('express');
var app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/static')); //Serves resources from public folder

var http = require('http').createServer(app);

require('./routes.js')(app);
const redis_utils = require('./redis_utils.js');
const io = require("socket.io")(http)


var port = 5000;

http.listen(port, function(){

  console.log(`App listening on port ${port}!`);

  io.on('connection', function(socket){

    console.log('PiWeatherStation app connected');

    socket.emit("connection_status", {"connected": true});

    socket.on('disconnect', function(){
      console.log('PiWeatherStation app disconnected');

      redis_utils.unsubscribe_to_data_stream("data-stream");

    });


    redis_utils.subscribe_to_data_stream("data-stream", function(channel, message){

      socket.emit("data-stream", message);

    });
  });
});
