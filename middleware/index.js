var assets    = require('connect-assets');
var path      = require('path');
var compress  = require('compression');
var log       = require('morgan');

module.exports = function middleware(app) {
  // logging
  app.use(log(app.get('logType')));

  // gzip
  app.use(compress());

  // assets (SCSS, etc.)
  app.use(assets({
    buildDir: 'public'
  }));
};
