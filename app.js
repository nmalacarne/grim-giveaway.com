var path    = require('path');
var express = require('express');
var app     = express();

// view setup
app.set('views', './views');
app.set('view engine', 'jade');

// load environment
require('dotenv').load();

// middleware setup
require('./middleware')(app);

// routes setup
require('./routes')(app);

// spin up the server
app.listen(process.env.PORT, function server() {
  console.log('Server listening on port: ', process.env.PORT);
});
