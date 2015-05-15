var app = require('express')();

// view setup
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// routes setup
require(__dirname + '/routes')(app);

app.listen(3000, function server() {
  console.log('Server listening on port: ', 3000);
});
