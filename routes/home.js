var Entrant = require('../models/entrant');

exports.get = function(req, res) {
  res.render('pages/home');
}

exports.post = function(req, res) {
  var accountName = req.body.accountName;

  var entrant = new Entrant({account_name: accountName});

  entrant.save(function(err, entrant) {
    if (err) res.render('pages/home', {error: 'An error has occurred.'});

    res.send(entrant);
  });
}

exports.checkParams = function(req, res, next) {
  if (!req.body.accountName) {
    res.render('pages/home', {
      error: 'Please enter a Steam account name.'
    });
  } else {
    next();
  }
}

exports.checkUnique = function(req, res, next) {
  Entrant.count({account_name: req.body.accountName}, function(err, count) {
    if (count > 0) {
      res.render('pages/home', {error: req.body.accountName + ' has already been entered into this contest.'});
    } else {
      next();
    }
  });
}
