"use strict";
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/users/login');
});
router.get('/*', (req, res, next) => {
  if(req.isAuthenticated()){
    res.redirect('/');
  }
  else {
    res.render('users', { title: '隨手記帳系統' });
  }
  //res.send('respond with a resource');
});

module.exports = router;
