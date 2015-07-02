var Promise   = require('bluebird');
var Passport  = require('passport');
var Strategy  = require('passport-steam').Strategy;
var Entrant   = require('../models/entrant');

Passport.use(new Strategy({
      returnURL: 'http://localhost:3000/callback'
    , realm: 'http://localhost:3000'
    , apiKey: process.env.STEAM_KEY
  },
  function(identifier, profile, done) {
    return done(null, profile);
  }
));

module.exports = function routes(app) {
  app.get('/', function indexGet(req, res) {
    res.render('pages/home');
  });

  app.get('/auth',
    Passport.authenticate('steam', {
      failureRedirect: '/'
    }),
    function authGet(req, res) {
      res.redirect('/');
    }
  );

  app.get('/callback',
    Passport.authenticate('steam', {
      failureRedirect: '/'
    }),
    function callbackGet(req, res) {
      var user = req.session.passport.user._json;
      res.send(JSON.stringify(user));
    }
  );

  // 404
  app.use(function PageNotFound(req, res) {
    res.redirect('/');
  });
};

