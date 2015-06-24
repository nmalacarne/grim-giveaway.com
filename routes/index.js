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
      Steam.key = process.env.STEAM_KEY;

      Steam.ready(function(err) {
        if (err) return res.render('pages/home', {error: 'An error has occurred; Please try again.'});

        var steam = new Steam();

        steam.resolveVanityURL({vanityurl: req.body.profileName}, function(err, profile) {
          if (err) return res.render('pages/home', {error: 'An error occurred; Please try again.'});

          switch(profile.success) {
            case 1:
              new Entrant({steam_id: profile.steamid}).save(function(err, entrant) {
                if (err) return res.render('pages/home', {error: req.body.profileName + ' has already been entered into the contest.'});

                steam.getPlayerSummaries({steamids: profile.steamid}, function(err, summary) {
                  if (err) return res.render('pages/home', {error: 'An error has occurred; Please try again.'});
                  console.log(summary.players);
                  return res.render('pages/congrats', {
                    user: summary.players.shift()
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

