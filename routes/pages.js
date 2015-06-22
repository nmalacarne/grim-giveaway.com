var router = require('express').Router();

router.get('/', getIndex);
router.post('/', [checkParams], postIndex);

module.exports = router;

/*
 * Route handlers
 */

function getIndex(req, res) {
  res.render('pages/index');
}

function postIndex(req, res) {
  var accountName = req.body.accountName;

  res.send(accountName);
}

/*
 * Middleware
 */

function checkParams(req, res, next) {
  if (!req.body.accountName) {
    res.send(req.body);
    res.render('pages/index', {
      error: 'Please enter a Steam account name.'
    });
  } else {
    next();
  }
}
