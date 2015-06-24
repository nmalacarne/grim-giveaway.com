module.exports = function routes(app) {
  app.get('/', function(req, res) { res.render('pages/home'); });

  app.post('/', function(req, res) {
    if (!req.body.profileName) res.render('pages/home', {error: 'Please enter a profile name.'});

    res.send(req.body.profileName);
  });

  // 404
  app.use(function PageNotFound(req, res) {
    res.redirect('/');
  });
};
