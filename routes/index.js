var pages = require(__dirname + '/pages');

module.exports = function routes(app) {
  app.use('/', pages);
};
