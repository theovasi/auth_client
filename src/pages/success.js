import React from "react";
import { useCookies } from "react-cookie";

export default function Success () {
  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
  function logoutUser  () {
    removeCookie('token');
    window.location.replace("/login");
  };

  return (
    <div className="container">
      <div className="success">
        <span>You are logged in!</span>
        <div id="buttonContainer">
          <a href="/login" className="button" onClick={logoutUser}>
            Logout
          </a>
        </div>
      </div>
    </div>
  );
}
