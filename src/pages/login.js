import React, { Component, useEffect, useState } from "react";
import { login } from "../features/login/loggedInUserSlice";
import CryptoJS from "crypto-js";
import { useCookies } from 'react-cookie';

const env = process.env.NODE_ENV || "test";
const config = require(__dirname + "/../config/config.json")[env];

function Login() {
  const [userIdentifier, setUserIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [timeout, setTimeout] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

  function handleUserIdentifierChange(event) {
    clearTimeout(timeout);
    event.persist();

    setUserIdentifier(event.target.value);
    setInvalidCredentials(false);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    setInvalidCredentials(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (invalidCredentials) return;

    return fetchAuthToken();
  }

  function fetchAuthToken() {
    return fetch(config.serverURL + "login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        userIdentifier: userIdentifier,
        password: CryptoJS.SHA3(password).toString(CryptoJS.enc.Hex),
      }),
    })
      .then((res) => res.json())
      .then((data) => data.token)
      .then((token) => {
        if (token) {
          return token;
        } else {
          return null
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function checkError() {
    return invalidCredentials;
  }

  return (
    <div className="container">
      <form
        id="form"
        action="api/user"
        method="get"
        onSubmit={(e) => {
          handleSubmit(e).then(token => {
            if (token) {
              setCookie('token', token, { 'SameSite': 'strict' });
              window.location.replace('/success');
            } else {
              setInvalidCredentials(true);
            }
          });
        }}
      >
        <div id="form-body">
          <input
            type="text"
            name="userIdentifier"
            placeholder="Username or Email address"
            onChange={(e) => {
              handleUserIdentifierChange(e);
            }}
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => {
              handlePasswordChange(e);
            }}
          />
          <input type="submit" className="hidden" />
          <br />
          <div className={"errorBox" + (checkError() ? "" : " hidden")}>
            <span>Invalid username or password</span>
          </div>
          <div id="buttonContainer">
            <a href="/login" className="button" onClick={handleSubmit}>
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

export default Login;
