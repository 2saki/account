"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var moment = require('moment');

// database params
const USERNAME = process.env.OPENSHIFT_MONGODB_DB_USERNAME || 'account_admin';
const PASSWORD = process.env.OPENSHIFT_MONGODB_DB_PASSWORD || 'mongodb123';
const HOST = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost';
const PORT = process.env.OPENSHIFT_MONGODB_DB_PORT || '27017';
const CONNECT_URL = 'mongodb://' + USERNAME + ':' + PASSWORD + '@' + HOST + ':' + PORT + '/account';


// Mongodb connection
mongoose.connect(CONNECT_URL);
var db = mongoose.connection;

// Mongoose Schema Define
var membersSchema = Schema({
  email: String,
  username: String,
  password: String,
  fb_id: String
});
var outlaysSchema = Schema({
  title: String,
  amount: Number,
  currency: String,
  time: Date,
  memberId: Schema.Types.ObjectId
});
var incomesSchema = Schema({
  amount: Number,
  currency: String,
  time: Date,
  memberId: Schema.Types.ObjectId
});

// Mogoose Model Define
var Members = mongoose.model('Members', membersSchema);
var Incomes = mongoose.model('Incomes', incomesSchema);
var Outlays = mongoose.model('Outlays', outlaysSchema);

// const executeDatabase = (action, cb) => {
//   MongoClient.connect(CONNECT_URL, function(err, db){
//     assert.equal(null, err);
//     action(db, function(){
//       db.close();
//       if(cb)
//         cb();
//     });
//   });
// };
class Database {
  findUserById (data, cb) {
    Members.findById(data.id, (err,user) => {
      assert.equal(null, err);
      cb(user);
    })
  }
  verifyUser (data, cb) {
    Members.findOne(data, (err, user) => {
      assert.equal(null, err);
      cb(user);
    })
  }
  createUser (data, cb) {
    const email = data.email;
    const username = data.username;
    const password = data.password;
    const fb_id = data.fb_id;
    var member = new Members({
      email: email,
      username: username,
      password: password,
      fb_id: fb_id
    });
    member.save((err, member) => {
      assert.equal(null, err);
      cb(member);
    });
  }
  getAllIncome(cb){
    Incomes.find((err, doc) => {
      assert.equal(null, err);
      if(doc != null) {
        cb(doc);
      }
    });
    // let action = (db, callback) => {
    //   db.collection('incomes').find().toArray(function(err, doc){
    //     assert.equal(null, err);
    //     if(doc != null) {
    //       cb(doc);
    //     }
    //   });
    // }
    // executeDatabase(action);
  }
  getAllOutlay(cb){
    Outlays.find((err, doc) => {
      assert.equal(null, err);
      if(doc != null) {
        cb(doc);
      }
    })
    // let action = (db, callback) => {
    //   db.collection('outlays').find().toArray(function(err, doc){
    //     assert.equal(null, err);
    //     if(doc != null) {
    //       cb(doc);
    //     }
    //   });
    // }
    // executeDatabase(action);
  }
  getIncomeLastMonth(time, cb) {
    var selector = {};
    if(time.trim().length !== 0){
      let lastDate = new Date(time);
      selector = {
        "time": { $gte: lastDate }
      };
    }
    Incomes.find(selector, (err, doc) => {
      assert.equal(null, err);
      if(doc != null) {
        cb(doc);
      }
    });
    // let action = (db, callback) => {
    //   db.collection('incomes').find(selector).toArray(function(err, doc){
    //     assert.equal(null, err);
    //     if(doc != null) {
    //       cb(doc);
    //     }
    //   });
    // }
    // executeDatabase(action);
  }
  getOutlayLastMonth(time, cb) {
    var selector = {};
    if(time.trim().length !== 0){
      let lastDate = new Date(time);
      selector = {
        "time": { $gte: lastDate }
      };
    }
    Outlays.find(selector, (err, doc) => {
      assert.equal(null, err);
      if(doc != null) {
        cb(doc);
      }
    });
    // let action = (db, callback) => {
    //   db.collection('outlays').find(selector).toArray(function(err, doc){
    //     assert.equal(null, err);
    //     if(doc != null) {
    //       cb(doc);
    //     }
    //   });
    // }
    // executeDatabase(action);
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
    Incomes.find({
      "time": { $gte: startDate, $lte:endDate }
    }, (err, doc) => {
      assert.equal(null, err);
      if(doc != null) {
        cb(doc);
      }
    });
    // let action = (db, callback) => {
    //   db.collection('incomes').find({
    //     "time": { $gte: startDate, $lte:endDate }
    //   }).toArray(function(err, doc){
    //     assert.equal(null, err);
    //     if(doc != null) {
    //       cb(doc);
    //     }
    //   });
    // }
    // executeDatabase(action);
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
    Outlays.find({
      "time": { $gte: startDate, $lte: endDate }
    }, (err, doc) => {
      assert.equal(null, err);
      if(doc != null) {
        cb(doc);
      }
    });
    // let action = (db, callback) => {
    //   db.collection('outlays').find({
    //     "time": { $gte: startDate, $lte: endDate }
    //   }).toArray(function(err, doc){
    //     assert.equal(null, err);
    //     if(doc != null) {
    //       cb(doc);
    //     }
    //   });
    // }
    // executeDatabase(action);
  }
  addOutlay(data, cb){
    const amount = data.amount;
    const title = data.title;
    const currency = data.currency;
    const memberId = data.memberId;
    var outlay = new Outlays({
      title:title,
      amount:amount,
      currency: currency,
      time: new Date(),
      memberId: memberId
    });
    outlay.save((err, outlay) => {
      assert.equal(err, null);
      callback();
    })
    // var action = (db, callback) => {
    //   db.collection('outlays').insertOne({
    //     title:title,
    //     amount:amount,
    //     currency: currency,
    //     time: new Date()
    //   }, function(err, result){
    //     assert.equal(err, null);
    //     callback();
    //   });
    // };
    // executeDatabase(action, cb);
  }
  addIncome(data, cb){
    const amount = data.amount;
    const currency = data.currency;
    const memberId = data.memberId;
    var income = new Incomes({
      amount:amount,
      currency: currency,
      time: new Date(),
      memberId: memberId
    });
    income.save((err, income) => {
      assert.equal(err, null);
      callback();
    })
    // var action = (db, callback) => {
    //   db.collection('incomes').insertOne({
    //     amount:amount,
    //     currency: currency,
    //     time: new Date()
    //   }, function(err, result){
    //     assert.equal(err, null);
    //     callback();
    //   });
    // };
    // executeDatabase(action, cb);
  }
}
module.exports = Database;
