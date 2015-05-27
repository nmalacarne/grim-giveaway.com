var assets  = require('connect-assets');
var log     = require('morgan');

module.exports = function config(app) {
  // logging
  app.use(log(app.get('logType')));

  // assets (SCSS, etc.)
  app.use(assets());
};