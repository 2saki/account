var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var moment = require('moment');

// database connect for private
const executeDatabase = (action, cb) => {
  MongoClient.connect('mongodb://localhost:27017/account', function(err, db){
    assert.equal(null, err);
    action(db, function(){
      db.close();
      if(cb)
        cb();
    });
  });
};
class Database {
  getAllIncome(cb){
    let action = (db, callback) => {
      db.collection('incomes').find().toArray(function(err, doc){
        assert.equal(null, err);
        if(doc != null) {
          cb(doc);
        }
      });
    }
    executeDatabase(action);
  }
  getAllOutlay(cb){
    let action = (db, callback) => {
      db.collection('outlays').find().toArray(function(err, doc){
        assert.equal(null, err);
        if(doc != null) {
          cb(doc);
        }
      });
    }
    executeDatabase(action);
  }
  getIncomeLastMonth(time, cb) {
    var selector = {};
    if(time.trim().length !== 0){
      let lastDate = moment(time)
        .toDate();
      selector = {
        "time": { $gte: lastDate }
      };
    }
    let action = (db, callback) => {
      db.collection('incomes').find(selector).toArray(function(err, doc){
        assert.equal(null, err);
        if(doc != null) {
          cb(doc);
        }
      });
    }
    executeDatabase(action);
  }
  getOutlayLastMonth(time, cb) {
    var selector = {};
    if(time.trim().length !== 0){
      let lastDate = moment(time)
        .toDate();
      selector = {
        "time": { $gte: lastDate }
      };
    }
    let action = (db, callback) => {
      db.collection('outlays').find(selector).toArray(function(err, doc){
        assert.equal(null, err);
        if(doc != null) {
          cb(doc);
        }
      });
    }
    executeDatabase(action);
  }
  getIncomeByMonth(start, end, cb) {
    let startDate = moment()
      .subtract(start, 'months')
      .startOf('month')
      .toDate();
    let endDate = moment()
      .subtract(end, 'months')
      .endOf('month')
      .toDate();
    let action = (db, callback) => {
      db.collection('incomes').find({
        "time": { $gte: startDate, $lte:endDate }
      }).toArray(function(err, doc){
        assert.equal(null, err);
        if(doc != null) {
          cb(doc);
        }
      });
    }
    executeDatabase(action);
  }
  getOutlayByMonth(start, end, cb) {
    let startDate = moment()
      .subtract(start, 'months')
      .startOf('month')
      .toDate();
    let endDate = moment()
      .subtract(end, 'months')
      .endOf('month')
      .toDate();
    let action = (db, callback) => {
      db.collection('outlays').find({
        "time": { $gte: startDate, $lte: endDate }
      }).toArray(function(err, doc){
        assert.equal(null, err);
        if(doc != null) {
          cb(doc);
        }
      });
    }
    executeDatabase(action);
  }
  addOutlay(amount, title, currency, cb){
    var action = (db, callback) => {
      db.collection('outlays').insertOne({
        title:title,
        amount:amount,
        currency: currency,
        time: new Date()
      }, function(err, result){
        assert.equal(err, null);
        callback();
      });
    };
    executeDatabase(action, cb);
  }
  addIncome(amount, currency, cb){
    var action = (db, callback) => {
      db.collection('incomes').insertOne({
        amount:amount,
        currency: currency,
        time: new Date()
      }, function(err, result){
        assert.equal(err, null);
        callback();
      });
    };
    executeDatabase(action, cb);
  }
}
module.exports = Database;
