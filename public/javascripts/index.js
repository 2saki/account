import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import React from 'react'
import { render } from 'react-dom'
import { Router, hashHistory, Route } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import accountApp from './reducers'
import NavBar from './components/NavBar'
import PropertyApp from './containers/PropertyApp'
import ModifyApp from './containers/ModifyApp'
import ChartApp from './containers/ChartApp'

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
    const { navbar, main } = this.props
    return (
      <div>
        {navbar}
        <div className="ui container">
          {main}
        </div>
      </div>
    )
  }
}
render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route component={Root}>
        <Route path="/modify" components={{navbar:NavBar ,main:ModifyApp}} />
        <Route path="/chart" components={{navbar:NavBar, main:ChartApp}} />
        <Route path="/" components={{navbar:NavBar, main:PropertyApp}} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
