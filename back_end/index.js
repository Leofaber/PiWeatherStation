var express = require('express');
var moment = require('moment');

var app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/piws/get_data', function(req, res) {
  console.log(req.body.dateS);
  console.log(req.body.dateE);

  dateS = moment(req.body.dateS)
  dateE = moment(req.body.dateE)

  var diffInMinutes = dateE.diff(dateS, 'minutes');

  console.log("diffInMinutes: ",diffInMinutes)

  data = {
    data_t : [],
    data_h : [],
    data_time : []
  }

  for(i=0; i < diffInMinutes; i++){

    var newDateObj = moment(dateS).add(i, 'm').toDate();

    data.data_t.push(Math.sin(i)*(Math.random()*10));
    data.data_h.push(Math.floor(Math.random() * 20));
    data.data_time.push(newDateObj);

  }

  res.send(data);
});

var port = 5000;
app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);
