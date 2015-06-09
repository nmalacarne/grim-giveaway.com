var path    = require('path');
var express = require('express');
var app     = express();

// environment
app.set('port',     process.env.PORT      || 3000);
app.set('logType',  process.env.LOG_TYPE  || 'dev');
app.set('root',     process.env.ROOT      || __dirname);
app.set('hostname', process.env.HOST_NAME || 'localhost:' + app.get('port'));

// view setup
app.set('views', path.join(app.get('root'), 'views'));
app.set('view engine', 'jade');

// middleware setup
require(
  path.join(app.get('root'), 'middleware')
)(app);

// routes setup
require(
  path.join(app.get('root'), 'routes')
)(app);

// spin up the server
app.listen(app.get('port'), function server() {
  console.log('Server listening on port: ', app.get('port'));
});
