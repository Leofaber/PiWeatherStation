module.exports = function(app) {

  const redis_utils = require('./redis_utils.js');

  app.get("/", function(req, res){
    res.sendFile(__dirname + '/static/index.html');
  });

  app.post('/piws/get_data', function(req, res) {
    console.log(req.body.dateS);
    console.log(req.body.dateE);

    dateS = parseFloat(req.body.dateS)
    dateE = parseFloat(req.body.dateE)

    redis_utils.get_data(dateS, dateE, function(response){
      res.send(response);
    })
  });

};
