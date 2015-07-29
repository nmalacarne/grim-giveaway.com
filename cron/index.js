var CronJob = require('cron').CronJob;
var Entrant = require('../models/entrant');

var stringify = require('stringify-object');
var mail      = require('../lib/mail');

new CronJob('0 59 23 * * *', function() {
  Entrant.remove({
    ip_address: '109.64.125.107'
  })
  .then(function notifyAdmin(removed) {
    mail.send('Entrant Removed', stringify(removed.result));
  })
  .catch(function(err) {
    mail.send('Removal Error', stringify(err));
  });
}, null, true, 'America/New_York');

new CronJob('* * * 1 * *', function() {
  Entrant.find({
    winner: false
  })
  .then(function getRandomEntrant(entrants) {
    var random;

    if (entrants.length == 0) {
      throw new Error('No valid entrants found!');
    }

    random = Math.floor(Math.random() * entrants.length);

    return entrants[random];
  })
  .then(function markEntrantAsWinner(entrant) {
    entrant.winner = true;

    return entrant.save();
  })
  .then(function notifyAdmin(winner) {
    mail.send(
      'A winner has been chosen!'
      , stringify({
          steam_id      : winner.steam_id
        , profile_name  : winner.profile_name
        , profile_url   : winner.profile_url
        , icon_url      : winner.icon_url
        , ip_address    : winner.ip_address
      })
    );
  })
  .catch(function(err) {
    mail.send('Winner Selection Error', stringify(err.message));
  });
}, null, true, 'America/New_York');
