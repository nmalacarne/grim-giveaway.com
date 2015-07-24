var assets    = require('connect-assets');
var favicon   = require('serve-favicon');
var robots    = require('robots.txt');
var compress  = require('compression');
var log       = require('morgan');
var parser    = require('body-parser');
var sanitize  = require('mongo-sanitize');
var session   = require('express-session');
var flash     = require('flash');
var db        = require('mongoose');
var passport  = require('passport');
var steam     = require('steam-webapi');

var MongoDBStore = require('connect-mongodb-session')(session);

var store = new MongoDBStore({
    uri: process.env.DB_URL
  , collection: 'sessions'
});

store.on('error', function(error) {
  assert.ifError(error);
  assert.ok(false);
});

module.exports = function setup(app) {
  // logging
  app.use(log(process.env.LOG_TYPE));

  // for IP
  app.enable('trust proxy');

  // serve favicon
  app.use(favicon(__dirname + '/../assets/favicon.ico'));

  app.use(robots(__dirname + '/../assets/robots.txt'));

  // gzip
  app.use(compress());

  // assets (SCSS, etc.)
  app.use(assets({
    buildDir: 'public'
  }));

  // json parsing
  app.use(parser.json());
  app.use(parser.urlencoded({extended: true}));

  // sanitize request data
  app.use(function(req, res, next) {
    req.body    = sanitize(req.body);
    req.query   = sanitize(req.query);
    req.params  = sanitize(req.params);

    next();
  });

  // mongo setup
  db.connect(process.env.DB_URL);

  // session
  app.use(session({
      secret            : process.env.SECRET
    , store             : store
    , saveUninitialized : false
    , resave            : true
  }));

  // flash messages
  app.use(flash());



  // passport
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  // Steam
  steam.key = process.env.STEAM_KEY;
};
