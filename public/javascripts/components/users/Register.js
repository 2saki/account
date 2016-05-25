import React, { PropTypes } from 'react'
import { fetchRequest } from '../../actions/index'
import { Link } from 'react-router'

class Register extends React.Component {
  constructor (props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }
  submitForm () {
    const { email, username, password, confirm_password } = this.refs;
    const emailVal = email.value;
    const usernameVal = username.value;
    const passwordVal = password.value;
    const confirm_passwordVal = confirm_password.value;
    this.props.dispatch(
      fetchRequest({
        action: 'createUser',
        data:{
          email: emailVal,
          username: usernameVal,
          password: passwordVal,
          confirm_password: confirm_passwordVal
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
                case 0:
                  email.focus();
                  break;
                case 1:
                  username.focus();
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
              memberId:member._id,
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
    let me = this;
    $(this.refs.form).form({
      on:'submit',
      inline: true,
      fields:{
        email: ['email', 'empty'],
        username: 'empty',
        password: 'empty',
        confirm_password: ['match[password]','empty']
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
            <label>Username</label>
            <input type="text" name="username" ref="username" placeholder="Username" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" ref="password" placeholder="Password" />
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input type="password" name="confirm_password" ref="confirm_password" placeholder="Confirm Password" />
          </div>
          <input type="submit" value="Register" className="ui primary button" />
          <button className="ui facebook button">
            <i className="facebook icon"></i>
            Facebook
          </button>
          <Link to="/users/login">Already a member?</Link>
        </form>
      </div>
    )
  }
};
export default Register
