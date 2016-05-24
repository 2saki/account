import { combineReducers } from 'redux'
import property from './property'
import user from './user'

const accountApp = combineReducers({
  property,
  user
});

export default accountApp
