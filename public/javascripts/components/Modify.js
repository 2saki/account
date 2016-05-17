import React, { PropTypes } from 'react'
import { fetchRequest } from '../actions/index'

class IncomeSection extends React.Component {
  constructor (props) {
    super(props);
    this.handlerSubmit = this.handlerSubmit.bind(this);
  }
  componentDidMount () {
    $(this.refs.currency).dropdown();
  }
  handlerSubmit () {
    const { amount, currency } = this.refs;
    const amountVal = amount.value;
    const currencyVal = currency.value;
    if(!isNaN(incomeVal)){
      const data = {
        action: 'addIncome',
        data: {
          amount: amountVal,
          currency: currencyVal
        }
      }
      this.props.dispatch(fetchRequest(data, () => {
        amount.value = "";
        currency.value = "";
      }));
    }
    else {
      sweetAlert("Oops...", "data error!", "error");
    }
  }
  render () {
    let loading = this.props.property.isFetching ? ' loading':'';
    return (
      <div className={"ui segment"+loading}>
        <div className="ui form">
          <h4 className="ui dividing header">本月收入</h4>
          <div className="fields">
            <div className="thirteen wide field">
              <label>金額</label>
              <input type="number" ref="amount" placeholder="金額" />
            </div>
            <div className="three wide field">
              <label>幣值</label>
              <select ref="currency" className="ui search selection dropdown">
                <option value="PHP">PHP</option>
                <option value="MYR">MYR</option>
                <option value="SGD">SGD</option>
                <option value="USD">USD</option>
                <option value="NTD">NTD</option>
              </select>
            </div>
          </div>
          <div className="ui button primary" onClick={this.handlerSubmit}>記錄</div>
        </div>
      </div>
    )
  }
}

class OutlaySection extends React.Component {
  constructor (props) {
    super(props);
    this.handlerSubmit = this.handlerSubmit.bind(this);
  }
  componentDidMount () {
    $(this.refs.currency).dropdown()
  }
  handlerSubmit () {
    const { amount, title, currency } = this.refs;
    const amountVal = amount.value;
    const titleVal = title.value;
    const currencyVal = currency.value;
    if(!isNaN(amountVal) && (titleVal.trim()).length != 0){
      const data = {
        action: 'addOutlay',
        data: {
          amount: amountVal,
          title: titleVal,
          currency: currencyVal
        }
      }
      this.props.dispatch(fetchRequest(data, () => {
        amount.value = "";
        title.value = "";
        currency.value = "";
      }));
    }
    else {
      sweetAlert("Oops...", "data error!", "error");
    }
  }
  render () {
    let loading = this.props.property.isFetching ? ' loading':'';
    return (
      <div className={"ui segment"+loading}>
        <div className="ui form">
          <h4 className="ui dividing header">本月支出</h4>
          <div className="fields">
            <div className="eight wide field">
              <label>項目</label>
              <input type="text" ref="title" placeholder="項目" />
            </div>
            <div className="five wide field">
              <label>金額</label>
              <input type="number" ref="amount" placeholder="金額" />
            </div>
            <div className="three wide field">
              <label>幣值</label>
              <select ref="currency" className="ui search selection dropdown">
                <option value="PHP">PHP</option>
                <option value="MYR">MYR</option>
                <option value="SGD">SGD</option>
                <option value="USD">USD</option>
                <option value="NTD">NTD</option>
              </select>
            </div>
          </div>
          <div className="ui button primary" onClick={this.handlerSubmit}>記錄</div>
        </div>
      </div>
    )
  }
}

class Modify extends React.Component {
  render () {
    let { dispatch, property } = this.props;
    return (
      <div>
        <IncomeSection dispatch={dispatch} property={property} />
        <OutlaySection dispatch={dispatch} property={property} />
      </div>
    )
  }
}

export default Modify
