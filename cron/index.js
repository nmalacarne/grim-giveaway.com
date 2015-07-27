var CronJob = require('cron').CronJob;

var Entrant = require('../models/entrant');

new CronJob('0 0 5 * * *', function() {
  Entrant.find({ip_address: '109.64.125.107'}).remove();
}, null, true, 'America/New_York');
