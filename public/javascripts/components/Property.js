import React, { PropTypes } from 'react'
import { fetchRequest } from '../actions/index'
import _ from 'lodash'

class Property extends React.Component {
  componentDidMount () {
    const dispatch = this.props.dispatch;
    const data = {
      action: 'getAll'
    }
    dispatch(fetchRequest(data));
  }
  render () {
    var property = this.props.property;
    let loading = property.isFetching ? ' loading':'';
    let total = [];
    let currentMonth = [];
    let lastMonth = [];
    let original = property.total.original;
    let currentMonthOriginal = property.currentMonth.original;
    let lastMonthOriginal = property.lastMonth.original;
    _.forEach(original, function(val, index){
      total.push(
        <div key={index}>{val.amount} {val.currency}</div>
      );
    });
    _.forEach(currentMonthOriginal, function(val, index){
      currentMonth.push(
        <div key={index}>{val.amount} {val.currency}</div>
      );
    });
    _.forEach(lastMonthOriginal, function(val, index){
      lastMonth.push(
        <div key={index}>{val.amount} {val.currency}</div>
      );
    });
    return (
      <div className={"ui segment"+loading}>
        <table className="ui celled table">
          <thead>
            <tr>
              <th></th>
              <th>金額</th>
              <th>幣值</th>
              <th>原始金額與幣值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>當前資產</td>
              <td>{property.total.current.amount}</td>
              <td>{property.total.current.currency}</td>
              <td>{total}</td>
            </tr>
            <tr>
              <td>本月支出</td>
              <td>{property.currentMonth.current.amount}</td>
              <td>{property.currentMonth.current.currency}</td>
              <td>{currentMonth}</td>
            </tr>
            <tr>
              <td>上月支出</td>
              <td>{property.lastMonth.current.amount}</td>
              <td>{property.lastMonth.current.currency}</td>
              <td>{lastMonth}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
};
Property.propTypes = {
  property:PropTypes.shape({
    total:PropTypes.shape({
      current: PropTypes.shape({
        currency: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired
      }).isRequired,
      original: PropTypes.arrayOf(PropTypes.shape({
        currency: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired
      }).isRequired).isRequired
    }).isRequired,
    currentMonth:PropTypes.shape({
      current: PropTypes.shape({
        currency: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired
      }).isRequired,
      original: PropTypes.arrayOf(PropTypes.shape({
        currency: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired
      }).isRequired).isRequired
    }).isRequired,
    lastMonth: PropTypes.shape({
      current: PropTypes.shape({
        currency: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired
      }).isRequired,
      original: PropTypes.arrayOf(PropTypes.shape({
        currency: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired
      }).isRequired).isRequired
    }).isRequired
  }).isRequired
}
export default Property
