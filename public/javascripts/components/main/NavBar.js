import React, { PropTypes } from 'react'
import { Link } from 'react-router'

class NavBar extends React.Component {
  logoutHandler () {
    localStorage.removeItem('user');
    window.location.href = '/users/logout';
  }
  render () {
    return (
      <div className="ui top menu">
        <Link to="/" activeClassName="active" className="item">概況</Link>
        <Link to="/modify" activeClassName="active" className="item">新增資料</Link>
        <Link to="/chart" activeClassName="active" className="item">圖表</Link>
        <a className="item" onClick={this.logoutHandler}>登出</a>
      </div>
    );
  }
};

export default NavBar
