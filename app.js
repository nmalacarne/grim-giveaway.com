var app = require('express')();
var log = require('morgan')('dev');

// view setup
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// app config
app.use(require('connect-assets')());

// logging
app.use(log);

// routes setup
require(__dirname + '/routes')(app);

app.listen(3000, function server() {
  console.log('Server listening on port: ', 3000);
});
