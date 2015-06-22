var home = require('./home');

module.exports = function routes(app) {
  app.get('/', home.get);
  app.post('/', [home.checkParams, home.checkUnique], home.post);

  // 404
  app.use(function PageNotFound(req, res) {
    res.redirect('/');
  });
};
