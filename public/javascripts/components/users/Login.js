import React, { PropTypes } from 'react'
import { fetchRequest } from '../../actions/index'
import { Link } from 'react-router'

class Login extends React.Component {
  constructor (props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }
  submitForm () {
    const { email, password } = this.refs;
    const emailVal = email.value;
    const passwordVal = password.value;
    this.props.dispatch(
      fetchRequest({
        action: 'loginUser',
        data: {
          email: emailVal,
          password: passwordVal
        }
      }, (res) => {
        switch (res.status.trim()) {
          case 'failed':
            sweetAlert({
              title: 'Opps...',
              text: res.message,
              type: 'error'
            }, () => {
              switch (res.error) {
                case 1:
                  email.focus();
                  break;
                case 2:
                  password.focus();
                  break;
              }
            });
            break;
          case 'success':
            var member = res.user;
            var user = {
              memberId:member.memberId,
              username: member.username,
              email: member.email,
              fb_id: member.fb_id
            };
            localStorage.setItem("user", JSON.stringify(user));
            window.location = '/';
            break;
        }
      })
    )
  }
  componentDidMount () {
    var me = this;
    $(this.refs.form).form({
      on:'submit',
      inline:true,
      fields:{
        email: ['email', 'empty'],
        password: 'empty'
      },
      onSuccess: (e) => {
        e.preventDefault();
        me.submitForm();
      }
    })
  }
  render () {
    let loading = this.props.user.isFetching ? ' loading':'';
    return (
      <div className={"ui segment" + loading}>
        <form className="ui form" ref="form">
          <div className="field">
            <label>Email</label>
            <input type="text" name="email" ref="email" placeholder="Email" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" ref="password" placeholder="Password" />
          </div>
          <input type="submit" value="Login" className="ui primary button" />
          <button className="ui facebook button">
            <i className="facebook icon"></i>
            Facebook
          </button>
          <Link to="/users/register">Haven't register?</Link>
        </form>
      </div>
    )
  }
};
export default Login
