var Promise = require('bluebird');
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
      var RESPONSES = {FOUND: 1, NOT_FOUND: 42};
      var GD_ID   = 219990;

      Steam.ready(function(err) {
        Promise.promisifyAll(Steam.prototype);

        var user  = {};
        var steam = new Steam();

        steam.resolveVanityURLAsync({
          vanityurl: req.body.profileName
        })
        .then(function getSummary(profile) {
          switch(profile.success) {
            case RESPONSES.FOUND:
              return steam.getPlayerSummariesAsync({
                steamids: profile.steamid
              });
              break;
            case RESPONSES.NOT_FOUND:
              throw new Error('Steam profile not found.');
              break;
            default:
              throw new Error('An error has occurred; please contact an administrator.');
              break;
          }
        })
        .then(function setUser(summary) {
          user = summary.players.shift();
        })
        .then(function getLibrary() {
          return steam.getOwnedGamesAsync({
              steamid                   : user.steamid
            , include_appinfo           : false
            , include_played_free_games : false
            , appids_filter             : null
          });
        })
        .then(function checkOwnership(library) {
          library.games.forEach(function(game) {
            if (game.appid == GD_ID) {
              throw new Error(req.body.profileName + ' already owns Grim Dawn.');
            }
          });
        })
        .then(function countEntrantById() {
          return Entrant.count({
            steam_id: user.steamid
          });
        })
        .then(function checkIfEntered(count) {
          if (count > 0) {
            throw new Error(req.body.profileName + ' has already entered the contest.');
          }
        })
        .then(function createEntrant() {
          return new Entrant({
              steam_id      : user.steamid
            , profile_name  : user.personaname
            , profile_url   : user.profileurl
            , icon_url      : user.avatarfull
          }).save();
        })
        .then(function congratulateEntrant(entrant) {
          return res.render('pages/congrats', {
            data: entrant
          });
        })
        .catch(function(err) {
          return res.render('pages/home', {error: err.message});
        });
      });
    });

  // 404
  app.use(function PageNotFound(req, res) {
    res.redirect('/');
  });
};

