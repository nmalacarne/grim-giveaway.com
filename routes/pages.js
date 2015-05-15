var router = require('express').Router();

router.get('/', function pagesIndex(req, res) {
  res.render('pages/index');
});

module.exports = router;
