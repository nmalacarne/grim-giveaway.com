var path    = require('path');
var express = require('express');
var app     = express();

// view setup
app.set('views', './views');
app.set('view engine', 'jade');

// load environment
require('dotenv').load();

// app setup
require('./setup')(app);

// routes setup
require('./routes')(app);

// cron jobs
require('./cron');

// spin up the server
app.listen(process.env.PORT, function server() {
  console.log('Server listening on port: ', process.env.PORT);
});

