exports.get = function(req, res) {
  res.render('pages/home');
}

exports.post = function(req, res) {
  var accountName = req.body.accountName;

  res.send(accountName);
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
  // TODO: check if account name is unique in db
  next();
}
