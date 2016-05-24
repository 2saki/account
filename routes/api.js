"use strict";
var express = require('express');
var router = express.Router();
var Database = require('../db');
var conn = new Database();
var crypto = require('crypto');
var passport = require('passport');
var validator = require("email-validator");

router.post('/users/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info, type) => {
    if (!user) {
      return res.json({
        status: 'failed',
        message: info.message,
        error: type
      });
    }
    req.login(user, (err) => {
      return res.json({
        status: 'success',
        user: {
          email: req.user.email,
          username: req.user.username,
          fb_id: req.user.fb_id,
          memberId: req.user._id
        }
      });
    });
  })(req, res, next);
})
router.post('/users/register', (req, res, next) => {
  const email = req.body.email.trim();
  const username = req.body.username.trim();
  const password = req.body.password.trim();
  const confirm_password = req.body.confirm_password.trim();
  if(!validator.validate(email)){
    res.json({
      status: 'failed',
      message: 'Wrong email format!',
      error: 0
    });
    return;
  }
  else if(username.length === 0) {
    res.json({
      status: 'failed',
      message: 'Username cannot be empty!',
      error: 1
    });
    return;
  }
  else if(password.length === 0 || confirm_password.length === 0){
    res.json({
      status: 'failed',
      message: 'Password cannot be empty!',
      error: 2
    });
    return;
  }
  else if(password != confirm_password){
    res.json({
      status: 'failed',
      message: 'Password does not match!',
      error: 2
    });
    return;
  }
  else {
    const encrypt = crypto.createHash('sha256').update(password+email).digest('hex');
    conn.createUser({
      email: email,
      username: username,
      password: encrypt,
      fb_id: "",
    }, (member) => {
      res.json({
        status: 'success',
        member: member
      });
    });
    return;
  }
});
router.get('/summary', (req, res, next) => {
  const start = req.query.start;
  const end = req.query.end;
  new Promise(
    (resolve, reject) => {
      conn.getIncomeByMonth(start, end, (result) => {
        resolve(result);
      });
    }
  ).then((incomeResult) => {
    return new Promise(
      (resolve, reject) => {
        conn.getOutlayByMonth(start, end, (outlayResult) => {
          resolve({
            income: incomeResult,
            outlay: outlayResult
          });
        })
      }
    )
  }).then((result) => {
    result.status = 'success';
    res.json(result);
  });
});
router.get('/all', (req, res, next) => {
  const time = req.query.time;
  new Promise(
    (resolve, reject) => {
      conn.getIncomeLastMonth(time, (result) =>{
        resolve(result);
      });
    }
  ).then((incomeResult) => {
    return new Promise(
      (resolve, reject) => {
        conn.getOutlayLastMonth(time, (outlayResult) => {
          resolve({
            income: incomeResult,
            outlay: outlayResult
          });
        })
      }
    )
  }).then((result) => {
    result.status = 'success';
    res.json(result);
  });
});
router.post('/income', (req, res, next) => {
  const amount = req.body.amount;
  const currency = req.body.currency;
  if(!isNaN(amount)){
    conn.addIncome({
      amount: amount,
      currency: currency
    }, () => {
      res.json({
        status: 'success'
      });
    });
  }
  else {
    res.json({
      status: 'failed'
    });
  }
});

router.post('/outlay', (req, res, next) => {
  const amount = req.body.amount;
  const title = req.body.title;
  const currency = req.body.currency;
  if(!isNaN(amount) && (title.trim()).length != 0){
    conn.addOutlay({
      amount: amount,
      title: title,
      currency: currency
    }, () => {
      res.json({
        status: 'success'
      });
    });
  }
  else {
    res.json({
      status: 'failed'
    });
  }
});
module.exports = router;
