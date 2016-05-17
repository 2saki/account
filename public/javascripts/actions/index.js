import fetch from 'isomorphic-fetch';
import moment from 'moment';

const getRate = (res, dispatch, callback) => {
  fetch('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22USDUSD%22%2C%20%22USDSGD%22%2C%20%22USDMYR%22%2C%20%22USDPHP%22%2C%20%22USDTWD%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
  .then(function(result){
    if(result.status === 200)
      return result.json();
    else
      sweetAlert("Oops...", "network error!", "error");
  })
  .then(function(rate){
    res.rate = rate.query.results.rate;
    callback(res);
  })
}
const Action = {
  getAll: () => {
    var lastUpdate = '';
    if(localStorage.getItem('lastUpdate')){
      lastUpdate = localStorage.getItem('lastUpdate');
    }
    let url = '/api/all?time='+lastUpdate;
    let data = {
      method: "GET"
    };
    return {
      url: url,
      data: data,
      callback: (res, dispatch) => {
        getRate(res, dispatch, function(changedRate){
          dispatch({
            type: "GET_ALL",
            data: changedRate
          })
        })
      }
    }
  },
  addIncome: (req) => {
    const { amount, currency } = req;
    let url = '/api/income';
    let data = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency
      })
    };
    return {
      url:url,
      data:data,
      callback: (res, dispatch) => {
        getRate(res, dispatch, function(changedRate){
          dispatch({
            type: 'ADD_INCOME',
            amount: amount,
            currency: currency,
            data: changedRate
          });
        });
      }
    }
  },
  addOutlay: (req) => {
    const { amount, title, currency } = req;
    let url = '/api/outlay';
    let data = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        title: title,
        currency: currency
      })
    };
    return {
      url: url,
      data: data,
      callback: (res, dispatch) => {
        getRate(res, dispatch, function(changedRate){
          dispatch({
            type: 'ADD_OUTLAY',
            amount: amount,
            title: title,
            currency: currency,
            data: changedRate
          });
        });
      }
    };
  }
}
const fetchStart = () => {
  return {
    type: 'REQUEST_START'
  }
}
export const fetchRequest = (req, cb) => {
  return (dispatch) => {
    dispatch(fetchStart());
    const { url, data, callback } = Action[req.action](req.data);
    return fetch(url, data)
    .then(function(res){
      if(res.status === 200)
        return res.text();
      else
        sweetAlert("Oops...", "network error!", "error");
    })
    .then(function(data){
      const result = JSON.parse(data);
      if(result.status == "success"){
        localStorage.setItem('lastUpdate', moment().toString())
        callback(result, dispatch);
        if(cb) cb();
      }
      else {
        sweetAlert("Oops...", "database error!", "error");
      }
    });
  }
};
