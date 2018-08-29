var cors = require('cors');
var express = require('express');
var mongoose = require('mongoose');
var twitch = require('twitch-api-v5');
var bodyParser = require('body-parser');

var validateAccess = require('./src/validateAccess');
var ObjectsModel = require('./src/models/objects');
var getData = require('./src/getData');

require('dotenv').config();

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept' }));
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/twitch', { useNewUrlParser: true });

ObjectsModel.findOne({ _key: 'clientId' }, function(modelError, clientId) {
  if (clientId) twitch.clientID = clientId.toObject().value;
});

app.get('/', function (req, res) {
  validateAccess(function (auth, id, name) {
    var result = { access: (auth === 'NOT OK') ? auth : 'OK' };
    if (auth === 'NOT OK') result.error = id;
    res.json(result);
  });
});

app.get('/v1/data', function (req, res) {
  validateAccess(function (auth, id, name) {
    getData(auth, id, function (data) {
      res.json(data);
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
