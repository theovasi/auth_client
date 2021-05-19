import React, { Component } from "react";
import { connect } from 'react-redux';
import { instanceOf } from 'prop-types';
import { addUser } from '../redux/actions/index';
import CryptoJS from 'crypto-js';
import { Cookies, withCookies } from 'react-cookie';
import "../static/css/app.css";


const serverURL = "https://fijb1qd4dd.execute-api.eu-west-1.amazonaws.com/dev/";

const mapDispatchToProps = dispatch => {
  return {
    addUser: user => dispatch(addUser(user))
  };
};

class Login extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      userIdentifier: "",
      password: "",
      errors: {
				invalidCredentials: false
			}
    };
    this.timeout = null;
  }

	handleUserIdentifierChange = (event) => {
    clearTimeout(this.timeout);

    event.persist();
    this.setState({
      userIdentifier: event.target.value,
      errors: {
				...this.state.errors,
				invalidCredentials: false
			}
    });
  }

	handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
      errors: {
				...this.state.errors,
				invalidCredentials: false
			}
    });
  }

	handleSubmit = (event) => {
    event.preventDefault();

    const { userIdentifier } = this.state;
    for (var key in this.state) {
      if (this.state[key] === "") {
        return;
      } else if (key === "errors") {
        for (var errorKey in this.state.errors) {
          if (this.state.errors[errorKey]) return;
        }
      }
    }
    this.props.addUser({ userIdentifier });
    this.submitFormData();
  }



	submitFormData = () => {
    const { cookies } = this.props;
    fetch(serverURL + "login", {
      headers: {
				"Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      body: JSON.stringify({
        userIdentifier: this.state.userIdentifier,
        password: CryptoJS.SHA3(this.state.password).toString(CryptoJS.enc.Hex)
      })
    }
    )
      .then(res => res.json())
      .then(data => data.token)
      .then(token => {
				if (token) {
					cookies.set("token", token, {path: "/"});
					window.location.replace('/success');
				} else {
					this.setState({ 
						errors: {
							...this.state.errors,
							invalidCredentials: true
						}
					});
				}
      })
      .catch(err => console.log(err))
  }

	checkError = (errorField) => {
    return this.state.errors[errorField];
	}

  render() {
    return (
      <div className="container">
        <form
          id="form"
          action="api/user"
          method="get"
          onSubmit={ e => {
            this.handleSubmit(e);
          }}
          >
          <div id="form-body">
            <input
              type="text"
              name="userIdentifier"
              placeholder="Username or Email address"
              onChange={e => {
                this.handleUserIdentifierChange(e);
              }}
            />
            <br />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={e => {
                this.handlePasswordChange(e);
              }}
            />
						<input type="submit" className='hidden' />
            <br />
            <div className={ 'errorBox' + (this.checkError('invalidCredentials') ? '' : ' hidden') }>
              <span>Invalid username of password</span>
            </div>
            <div id='buttonContainer'>
							<a href="/login" className="button" onClick={this.handleSubmit}>
                Log in
              </a>
							<a href="/signup" className="button">
                Sign Up
              </a>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default withCookies(connect(null, mapDispatchToProps)(Login));
