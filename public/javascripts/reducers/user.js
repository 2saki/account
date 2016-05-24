import _ from 'lodash'

var defaultUser = {
  memberId: "",
  username: "",
  fb_id:""
};
if(localStorage.getItem("user")){
  const userInfo = JSON.parse(localStorage.getItem("user"));
  defaultUser = userInfo;
}
const user = (state=defaultUser, action) => {
  switch (action.type) {
    case 'REQUEST_START':
      return Object.assign({}, state, {
        isFetching: true
      });
    case 'REQUEST_FAILURE':
      return Object.assign({}, state, {
        isFetching: false
      });
    case 'LOGIN_USER':
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
}

export default user
