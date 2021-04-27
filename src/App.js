import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { withCookies } from 'react-cookie';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Success from './components/Success';

const serverURL = "https://fijb1qd4dd.execute-api.eu-west-1.amazonaws.com/dev";

class App extends React.Component {

  constructor () {
    super();
    this.state = {
      loginChecked: false,
      loggedIn: false }
  }

  checkLogin = () => {
    let token = this.props.cookies.get('token');
		if (token) {
			fetch(serverURL + "/login", { method: "GET",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': token
				}}
			).then((res) => this.setState({
				loginChecked: true,
				loggedIn: (res.status === 200) 
			}));
		}
  }

  render () {
    return (
      <div>
        <Switch>
          <Route
            path="/signup" render = {() => (<SignUp cookies={ this.props.cookies } />)}
          />
          <Route
            path="/login" render = {() => (<Login cookies={ this.props.cookies } />)}
          />
          <Route
            path="/" render = 
            {() => {
              if (!this.state.loginChecked) this.checkLogin();

              let token = this.props.cookies.get('token');
              if (token && this.state.loginChecked && this.state.loggedIn) {
                return <Success cookies={ this.props.cookies } />
              }
              else if (token && !this.state.loginChecked) {
                return <span> Loading... </span>
              }
              else {
                return <Redirect to="/login" cookies={ this.props.cookies } />
              }
            }}

          />
        </Switch>
      </div>
    );
  }
}

export default withCookies(App);
