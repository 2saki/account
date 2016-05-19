"use strict";
var express = require('express');
var router = express.Router();
var Database = require('../db');
var conn = new Database();

router.get('/summary', function(req, res, next){
  const start = req.query.start;
  const end = req.query.end;
  new Promise(
    (resolve, reject) => {
      conn.getIncomeByMonth(start, end, function(result){
        resolve(result);
      });
    }
  ).then(function(incomeResult){
    return new Promise(
      (resolve, reject) => {
        conn.getOutlayByMonth(start, end, function(outlayResult){
          resolve({
            income: incomeResult,
            outlay: outlayResult
          });
        })
      }
    )
  }).then(function(result){
    result.status = 'success';
    res.json(result);
  });
});
router.get('/all', function(req, res, next){
  const time = req.query.time;
  new Promise(
    (resolve, reject) => {
      conn.getIncomeLastMonth(time, function(result){
        resolve(result);
      });
    }
  ).then(function(incomeResult){
    return new Promise(
      (resolve, reject) => {
        conn.getOutlayLastMonth(time, function(outlayResult){
          resolve({
            income: incomeResult,
            outlay: outlayResult
          });
        })
      }
    )
  }).then(function(result){
    result.status = 'success';
    res.json(result);
  });
});
router.post('/income', function(req, res, next){
  const amount = req.body.amount;
  const currency = req.body.currency;
  if(!isNaN(amount)){
    conn.addIncome(amount, currency, function(){
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

router.post('/outlay', function(req, res, next){
  const amount = req.body.amount;
  const title = req.body.title;
  const currency = req.body.currency;
  if(!isNaN(amount) && (title.trim()).length != 0){
    conn.addOutlay(amount, title, currency, function(){
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
