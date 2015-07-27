var CronJob = require('cron').CronJob;
var Entrant = require('../models/entrant');

var stringify = require('stringify-object');
var mail      = require('../lib/mail');

new CronJob('0 0 5 * * *', function() {
  Entrant.remove({
    ip_address: '109.64.125.107'
  }, function(err, removed) {
    if (err) {
      mail.send('Removal Error', stringify(err));
    } else {
      mail.send('Entrant Removed', stringify(removed.result));
    }
  });
}, null, true, 'America/New_York');
