var express = require('express');
var moment = require('moment');
const redis = require("redis");

var app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


const client = redis.createClient();



app.post('/piws/get_data', function(req, res) {
  console.log(req.body.dateS);
  console.log(req.body.dateE);
  
  dateS = parseFloat(req.body.dateS)
  dateE = parseFloat(req.body.dateE)

  data = {
    error : false,
    error_msg : null,
    data_t : [],
    data_h : [],
    data_time : []
  }

  client.zrangebyscore(["temperature", dateS, dateE], function(rerr, rres){
    console.log("zrangebyscore temperature",dateS,dateE)
    if(rerr) {
      data.error = true;
      data.error_msg = rerr;
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
    client.zrangebyscore(["humidity", dateS, dateE], function(rerr, rres){
      console.log("zrangebyscore humidity",dateS,dateE)
      if(rerr) {
        data.error = true;
        data.error_msg = rerr;
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
      res.send(data);
    });
  });
});

var port = 5000;
app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);
