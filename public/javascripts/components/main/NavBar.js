import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const NavBar = () => (
  <div className="ui top menu">
    <Link to="/" activeClassName="active" className="item">概況</Link>
    <Link to="/modify" activeClassName="active" className="item">新增資料</Link>
    <Link to="/chart" activeClassName="active" className="item">圖表</Link>
  </div>
);

export default NavBar
