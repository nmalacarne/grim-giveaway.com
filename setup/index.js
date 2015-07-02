var assets    = require('connect-assets');
var favicon   = require('serve-favicon');
var compress  = require('compression');
var log       = require('morgan');
var parser    = require('body-parser');
var sanitize  = require('mongo-sanitize');
var session   = require('express-session');
var flash     = require('flash');
var db        = require('mongoose');
var passport  = require('passport');
var steam     = require('steam-webapi');

module.exports = function setup(app) {
  // logging
  app.use(log(process.env.LOG_TYPE));

  // serve favicon
  app.use(favicon(__dirname + '/../assets/favicon.ico'));

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

  // session
  app.use(session({
    secret: process.env.SECRET
  }));

  // flash messages
  app.use(flash());

  // mongo setup
  db.connect(process.env.DB_URL);

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
