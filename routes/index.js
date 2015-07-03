var Promise   = require('bluebird');
var Passport  = require('passport');
var Strategy  = require('passport-steam').Strategy;
var Steam     = require('steam-webapi');
var Entrant   = require('../models/entrant');

Passport.use(new Strategy({
      returnURL: 'http://localhost:3000/callback'
    , realm: 'http://localhost:3000'
    , apiKey: process.env.STEAM_KEY
  },
  function(identifier, profile, done) {
    return done(null, profile._json);
  }
));

module.exports = function routes(app) {
  app.get('/', function indexGet(req, res) {
    res.render('pages/home');
  });

  app.get('/auth',
    Passport.authenticate('steam', {
        failureRedirect: '/'
      , failureFlash: true
    }),
    function authGet(req, res) {
      res.redirect('/');
    }
  );

  app.get('/callback',
    Passport.authenticate('steam', {
        failureRedirect: '/'
      , failureFlash: true
    }),
    function callbackGet(req, res) {
      Steam.ready(function(err) {
        Promise.promisifyAll(Steam.prototype);

        var steam = new Steam();

        steam.getOwnedGamesAsync({
            steamid                   : req.user.steamid
          , include_appinfo           : false
          , include_played_free_games : false
          , appids_filter             : null
        })
        .then(function checkOwnership(library) {
          if (typeof library.games !== 'undefined') {
            library.games.forEach(function(game) {
              if (game.appid == 219990) {
              }
            });
          }
        })
        .then(function countEntrantById() {
          return Entrant.count({
            steam_id: req.user.steamid
          });
        })
        .then(function checkIfEntered(count) {
          if (count > 0) {
            throw new Error(req.user.personaname + ' has already entered the contest.');
          }
        })
        .then(function createEntrant() {
          return new Entrant({
              steam_id      : req.user.steamid
            , profile_name  : req.user.personaname
            , profile_url   : req.user.profileurl
            , icon_url      : req.user.avatarfull
          }).save();
        })
        .then(function congratulateEntrant(entrant) {
          return res.redirect('/congrats/' + entrant.profile_name);
        })
        .catch(function(err) {
          console.log(err);
          req.flash(err.message);
          return res.redirect('/');
        });
      });
    }
  );

  app.get('/congrats/:profile_name', function congratsGet(req, res) {
    Entrant.findOne({
      profile_name: req.params.profile_name
    })
    .exec()
    .then(function(entrant) {
      if (!entrant) {
        req.flash(req.params.profile_name + ' has not entered the contest.');
        return res.redirect('/');
      }

      return res.render('pages/congrats', {
        data: entrant
      });
    });
  });

  // 404
  app.use(function PageNotFound(req, res) {
    res.redirect('/');
  });
};

