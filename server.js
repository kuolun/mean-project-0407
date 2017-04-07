var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');


var app = express();
var port = 3000;
var config = require('./config/db');
var api = require('./app/routes');
var fakerapi = require('./api/faker');



//connect DB
mongoose.connect(config.dbURI);

//check connection
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + config.dbURI);
});

//check error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error ' + err);
});

app.use(morgan('dev'));
app.use(cors());


// static folder
app.use(express.static(__dirname + '/public'));

//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//set routes
app.use('/api', api);
app.use('/fakerapi', fakerapi);


app.get('/r/:subreddit', function (req, res) {
  res.send('Welcome ' + req.params.sub);
});

app.get('/r/:subreddit/comments/:id/:title', function (req, res) {
  console.log(req.params);
  res.send('Welcome ' + req.params.id);
});




app.listen(port, () => console.log('server starting...'));
