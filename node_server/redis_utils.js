const redis = require("redis");
const redis_client = redis.createClient();
var redis_client_pubsub = null;

subscribe_to_data_stream = function(channel, callback) {
  redis_client_pubsub = redis.createClient();
  console.log("Subscribed to channel: " + channel);
  redis_client_pubsub.on("message", function (channel, message) {
    // console.log("Message: " + message + " on channel: " + channel + " is arrived!");
    callback(channel, message);
  });
  redis_client_pubsub.subscribe(channel);
}

unsubscribe_to_data_stream = function(channel) {
  redis_client_pubsub.unsubscribe(channel);
  console.log("Unsubscribed to channel: " + channel);
}

get_data = function(dateS, dateE, callback) {

  data = {
    error : false,
    error_msg : null,
    data_t : [],
    data_h : [],
    data_time : []
  }

  redis_client.zrangebyscore(["temperature", dateS, dateE], function(rerr, rres){
    console.log("zrangebyscore temperature",dateS,dateE)
    if(rerr) {
      data.error = true;
      data.error_msg = rerr;
      console.log("Error:",rerr);
    }
    else {
       console.log(rres.length,"results")
       data.data_t = rres.map(function(e){
         return parseFloat(e.split(":")[0])
       });
       data.data_time = rres.map(function(e){
         return parseFloat(e.split(":")[1])
       });
    }
    redis_client.zrangebyscore(["humidity", dateS, dateE], function(rerr, rres){
      console.log("zrangebyscore humidity",dateS,dateE)
      if(rerr) {
        data.error = true;
        data.error_msg = rerr;
        console.log("Error:",rerr);
      }
      else {
         console.log(rres.length,"results")
         data.data_h = rres.map(function(e){
           return parseFloat(e.split(":")[0])
         });
         data.data_time = rres.map(function(e){
           return parseFloat(e.split(":")[1])
         });
      }
      callback(data);
    });
  });
};

stream_data = function(callback) {

    data = {
      error : false,
      error_msg : null,
      data_t : [],
      data_h : [],
      data_time : []
    }

    setInterval(function(){
      console.log("generating data..")
      data.data_t = [Math.random()];
      data.data_h = [Math.random()];

      callback(data)

    }, 2500);
}



exports.get_data = get_data
exports.stream_data = stream_data
exports.subscribe_to_data_stream = subscribe_to_data_stream
exports.unsubscribe_to_data_stream = unsubscribe_to_data_stream
