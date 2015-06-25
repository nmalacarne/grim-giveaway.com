var Steam   = require('steam-webapi');
var Entrant = require('../models/entrant');

module.exports = function routes(app) {
  app.get('/', function indexGet(req, res) { res.render('pages/home'); });

  app.post('/',
    function checkParams(req, res, next) {
      if (!req.body.profileName) {
        return res.render('pages/home', {error: 'Please enter a Steam profile name.'});
      } else {
        next();
      }
    },
    function indexPost(req, res) {
      Steam.ready(function(err) {
        if (err) return res.render('pages/home', {error: 'An error has occurred; Please contact an administrator.'});

        var steam = new Steam();

        // lookup entrant's steam id
        steam.resolveVanityURL({
          vanityurl: req.body.profileName
        }, function(err, profile) {
          if (err) return res.render('pages/home', {error: 'An error occurred; Please contact an administrator.'});
          // 1: success
          // 46: user not found
          switch(profile.success) {
            case 1:
              steam.getOwnedGames({
                steamid                   : profile.steamid
              , include_appinfo           : false
              , include_played_free_games : false
              , appids_filter             : null
              }, function(err, library) {
                // check if grim dawn is on list of owned games
                for (var i = 0; i < library.games.length; i++) {
                  if (library.games[i].appid === 219990) return res.render('pages/home', {error: req.body.profileName + ' already owns a copy of Grim Dawn.'});
                }
                // create new entrant
                new Entrant({
                  steam_id: profile.steamid
                }).save(function(err, entrant) {
                  if (err) return res.render('pages/home', {error: req.body.profileName + ' has already been entered into the contest.'});
                  // query steam api for user profile data (name, icon, etc)
                  steam.getPlayerSummaries({
                    steamids: profile.steamid
                  }, function(err, summary) {
                    if (err) return res.render('pages/home', {error: 'An error has occurred; Please contact an administrator.'});
                    return res.render('pages/congrats', {
                      user: summary.players.shift()
                    });
                  });
                });
              });
              break;
            default:
              return res.render('pages/home', {error: 'Steam profile not found.'});
              break;
          }
        });
      });
    }
  );

  // 404
  app.use(function PageNotFound(req, res) {
    res.redirect('/');
  });
};

