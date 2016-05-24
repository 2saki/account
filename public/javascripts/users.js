import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory, Route } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import accountApp from './reducers'
import LoginApp from './containers/users/LoginApp'
import RegisterApp from './containers/users/RegisterApp'

const loggerMiddleware = createLogger()

let store = createStore(
  accountApp,
  applyMiddleware(
    thunkMiddleware, // 允许我们 dispatch() 函数
    loggerMiddleware // 一个很便捷的 middleware，用来打印 action 日志
  )
)

class Root extends React.Component {
  render() {
    return (
      <div className="ui container">
        {this.props.children}
      </div>
    )
  }
}
render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={Root} path="/users">
        <Route path="login" component={LoginApp} />
        <Route path="register" component={RegisterApp} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
