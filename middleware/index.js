var assets    = require('connect-assets');
var path      = require('path');
var compress  = require('compression');
var log       = require('morgan');
var parser    = require('body-parser');

module.exports = function middleware(app) {
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
};
