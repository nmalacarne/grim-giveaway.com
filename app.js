var app = require('express')();

// view setup
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// environment
app.set('port',     process.env.PORT      || 3000);
app.set('logType',  process.env.LOG_TYPE  || 'dev');

// app config
require(__dirname + '/config')(app);

// routes setup
require(__dirname + '/routes')(app);

// spin up the server
app.listen(app.get('port'), function server() {
  console.log('Server listening on port: ', app.get('port'));
});
