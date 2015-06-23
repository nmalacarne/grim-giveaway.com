var assets    = require('connect-assets');
var path      = require('path');
var compress  = require('compression');
var log       = require('morgan');
var parser    = require('body-parser');
var sanitize  = require('mongo-sanitize');
var db        = require('mongoose');

module.exports = function setup(app) {
  // logging
  app.use(log(process.env.LOG_TYPE));

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
};
