import _ from 'lodash'
import moment from 'moment'

const MONTH_FORMAT = 'YYYY-MM';
var totalCombine = {};
var defaultProperty = {
  isFetching: false,
  total: {
    current:{
      currency:'PHP',
      amount:0
    },
    original: [{
      currency:'PHP',
      amount:0
    }]
  },
  currentMonth: {
    current: {
      currency:'PHP',
      amount:0
    },
    original: [{
      currency:'PHP',
      amount:0
    }]
  },
  lastMonth: {
    current: {
      currency: 'PHP',
      amount: 0
    },
    original: [{
      currency:'PHP',
      amount:0
    }]
  }
}
if(localStorage.getItem("totalCombine")){
  totalCombine = JSON.parse(localStorage.getItem("totalCombine"));
}
if(localStorage.getItem("defaultProperty")){
  defaultProperty = JSON.parse(localStorage.getItem("defaultProperty"));
}
const changeRate = (property, rate) => { //換匯
  _.forEach(property, (value, key) => {
    let original = value.original;
    let currentCurrency = 'USD'+value.current.currency;
    let currentAmount = 0;
    _.forEach(original, (originals) => {
      let currencyExchange = 'USD'+originals.currency;
      let rateToUSD = _.find(rate, { 'id': currencyExchange });
      let rateToCurrency = _.find(rate, { 'id': currentCurrency });
      let amountToUSD = parseFloat(originals.amount) / parseFloat(rateToUSD.Rate);
      let amountToCurrency = parseFloat(amountToUSD) * parseFloat(rateToCurrency.Rate);
      currentAmount += amountToCurrency;
    });
    property[key].current.amount = parseFloat(currentAmount.toFixed(2));
  });
  return property;
};
const sumTotal = (state, rate) => {
  let totalFinal = [];
  let totalMonthly = [];
  _.forEach(totalCombine, (val, month) => { // 每個月
    _.forEach(val, function(data, currency){ // 每個幣值
      totalMonthly.push({
        amount: parseFloat((_.sumBy(data, 'amount')).toFixed(2)),
        currency: currency,
        month: month
      });
    });
  });
  let groupByMonth = _.groupBy(totalMonthly, 'month');
  let groupByCurrency = _.groupBy(totalMonthly, 'currency');
  totalFinal = _.map(groupByCurrency, (o, currency) => {
    return {
      amount: _.sumBy(o, 'amount'),
      currency: currency
    }
  });
  const thisMonth = moment();
  const lastMonth = moment().subtract('1', 'months');
  var property = _.merge(state, {
    total:{
      original:totalFinal
    },
    currentMonth: {
      original:groupByMonth[thisMonth.format(MONTH_FORMAT)]
    },
    lastMonth: {
      original:groupByMonth[lastMonth.format(MONTH_FORMAT)]
    }
  });
  delete property.isFetching;
  const finalResult = Object.assign({}, {isFetching: false}, changeRate(property, rate));
  localStorage.setItem("defaultProperty", JSON.stringify(finalResult));
  localStorage.setItem("totalCombine", JSON.stringify(totalCombine));
  return finalResult;
}
const property = (state=defaultProperty, action) => {
  switch (action.type) {
    case 'REQUEST_START':
      return Object.assign({}, state, {
        isFetching: true
      });
    case 'REQUEST_FAILURE':
      return Object.assign({}, state, {
        isFetching: false
      });
    case 'GET_ALL':
      const data = action.data;
      const income = data.income;
      const outlay = data.outlay;
      var rate = data.rate;
      let total = [];
      const incomeGroup = _.groupBy(income, function(v){
        let totalTime = moment(v.time);
        return totalTime.format(MONTH_FORMAT);
      });
      const outlayGroup = _.groupBy(outlay, function(v){
        let totalTime = moment(v.time);
        return totalTime.format(MONTH_FORMAT);
      });
      _(incomeGroup).forEach((val, currency) => {
        _(val).forEach((data) => {
          total.push({
            amount: data.amount,
            currency: currency,
            title: data.title,
            time: data.time,
            type: 'income'
          });
        });
      });
      _(outlayGroup).forEach((val, currency) => {
        _(val).forEach((data) => {
          total.push({
            amount: 0 - data.amount,
            currency: data.currency,
            title: data.title,
            time: data.time,
            type: 'outlay'
          });
        });
      });
      let totalGroupByMonth = _
        .groupBy(total, (v) => {
          let totalTime = moment(v.time);
          return totalTime.format(MONTH_FORMAT);
        });
      _.forEach(totalGroupByMonth, (val, month) => {
        var totalTmp = _.groupBy(val, 'currency');
        totalGroupByMonth[month] = totalTmp;
      });
      _.mergeWith(totalCombine, totalGroupByMonth, (o, s) => {
        if(_.isArray(o)) return o.concat(s);
      });
      return sumTotal(state, rate);
    case 'ADD_INCOME':
      var rate = action.data.rate;
      var time = moment(action.data.time).format(MONTH_FORMAT);
      if(time in totalCombine && action.currency in totalCombine[time]) { // 時間和幣值都有
        totalCombine[time][action.currency].push({
          amount: parseFloat(action.amount),
          currency: action.currency
        });
      }
      else if(time in totalCombine) { // 有時間，無幣值
        totalCombine[time][action.currency] = [{
          amount: parseFloat(action.amount),
          currency: action.currency
        }];
      }
      else { // 時間和幣值都沒有
        totalCombine[time] = {};
        totalCombine[time][action.currency] = [{
          amount: parseFloat(action.amount),
          currency: action.currency
        }];
      }
      return sumTotal(state, rate);
    case 'ADD_OUTLAY':
      var rate = action.data.rate;
      var time = moment(action.data.time).format(MONTH_FORMAT);
      if(time in totalCombine && action.currency in totalCombine[time]) { // 時間和幣值都有
        totalCombine[time][action.currency].push({
          amount: 0 - parseFloat(action.amount),
          currency: action.currency
        });
      }
      else if(time in totalCombine) { // 有時間，無幣值
        totalCombine[time][action.currency] = [{
          amount: 0 - parseFloat(action.amount),
          currency: action.currency
        }];
      }
      else { // 時間和幣值都沒有
        totalCombine[time] = {};
        totalCombine[time][action.currency] = [{
          amount: 0 - parseFloat(action.amount),
          currency: action.currency
        }];
      }
      return sumTotal(state, rate);
    default:
      return state;
  }
}

export default property
