import React from 'react';
import CryptoJS from 'crypto-js';
import '../static/css/app.css';

const serverURL = "https://fijb1qd4dd.execute-api.eu-west-1.amazonaws.com/dev/";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
		this.state = { username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      errors: {
        username: false,
        email: false,
        passwordLength: false,
        passwordMatch: false
      }
    };
    this.timeout = null;
  }

	handleUsernameChange = (event) => {
    clearTimeout(this.timeout);
		event.preventDefault();
    this.setState({
      username: event.target.value,
    });
		this.timeout = setTimeout(function () {
      fetch(serverURL + 'userExists/' + event.target.value)
				.then(response => response.text())
				.then(data => this.handleUsernameError(data === 'true'));
		}.bind(this), 800);
  }

	handleUsernameError = (usernameExists) => {
    this.setState({ 
      errors: {
        ...this.state.errors,
        username: (usernameExists || ((this.state.username.length < 4
                   || this.state.username.length > 16) && this.state.username.length !== 0))
      }});
  }

	handleEmailChange = (event) => {
    let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.setState({ 
      email: event.target.value,
      errors: {
        ...this.state.errors,
        emailInvalid: event.target.value.length !== 0 && !emailRegex.test(event.target.value)
      }
    });
		this.timeout = setTimeout(function () {
      fetch(serverURL + 'userExists/' + event.target.value)
				.then(response => response.text())
				.then(data => this.handleEmailError(data === 'true'));
		}.bind(this), 800);
  }

	handleEmailError = (emailExists) => {
    this.setState({ 
      errors: {
        ...this.state.errors,
        emailExists: emailExists
      }});
  }

	handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
      errors: {
        ...this.state.errors,
        passwordLength: event.target.value.length > 0 && event.target.value.length < 8,
        passwordMatch: (event.target.value.length !== 0
          && this.state.passwordConfirm.length > 0
          && (this.state.passwordConfirm !== event.target.value))
      } 
    });
  }

	handlePasswordConfirmChange = (event) => {
    this.setState({ 
      passwordConfirm: event.target.value,
      errors: {
        ...this.state.errors,
        passwordLength: this.state.errors['passwordLength'],
        passwordMatch: (event.target.value.length !== 0 && 
          (this.state.password !== event.target.value)),
      }
    });
  }

	handleSubmit = (event) => {
    event.preventDefault();
    for (var key in this.state) {
      if (this.state[key] === '') {
        return;
      } else if (key === 'errors') {
        for (var errorKey in this.state.errors) {
          if (this.state.errors[errorKey])
            return;
        }
      }
    }
    this.submitFormData();
  }

	submitFormData = () => {
    fetch(serverURL + "user", { 
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        username: this.state.username,
        email: this.state.email,
        password: CryptoJS.SHA3(this.state.password).toString(CryptoJS.enc.Hex)
      })
    }).then((res) => {
      if(res.status) {
        window.location.replace('/');
      }})
    .catch(err => console.log(err));
  }

	checkError = (errorField) => {
    return this.state.errors[errorField];
  }

  render() {
    return (
			<div className="container">
        <form id="form" action="/api/user" method="post"
            onSubmit={this.handleSubmit}>
          <div id="form-body">
            <input className={ this.checkError('username') ? 'error' : '' }
              type="text" name="username" placeholder="Username"
							value={this.state.username} onChange={this.handleUsernameChange}/>
            <br />
            <input className={ (this.checkError('emailExists') || this.checkError('emailInvalid')) ? 'error' : '' }
              type="text" name="email" placeholder="Email"
              onChange={ (e) => {this.handleEmailChange(e);} }/>
            <br />
            <input className={ this.checkError('passwordLength') ? 'error' : '' }
              type="password" name="password" placeholder="Password"
              onChange={ (e) => {this.handlePasswordChange(e);} }/>
            <br />
            <input className={ this.checkError('passwordMatch') ? 'error' : '' }
              type="password" name="password-confirm" placeholder="Confirm password"
              onChange={ (e) => {this.handlePasswordConfirmChange(e);} }/>
						<input type="submit" className='hidden' />
            <div className={ 'errorBox' + (this.checkError('username') ? '' : ' hidden') }>
              <span>A user with this username already exists</span>
            </div>
            <div className={ 'errorBox' + (this.checkError('emailExists') ? '' : ' hidden') }>
              <span>A user with this email address already exists</span>
            </div>
            <div className={ 'errorBox' + (this.checkError('passwordLength') ? '' : ' hidden') }>
              <span>Password must be 8 or more characters long</span>
            </div>
            <div className={ 'errorBox' + (this.checkError('passwordMatch') ? '' : ' hidden') }>
              <span>Passwords do not match</span>
            </div>
            <div id='buttonContainer'>
							<a href="/signup" className="button" onClick={this.handleSubmit}>
                Sign Up
              </a>
            </div>
        </div>
        </form>
      </div>
    );
  }
}

export default SignUp;
