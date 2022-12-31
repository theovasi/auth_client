import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
  const token = cookies.token;
  if (token) {
    useEffect(() => {
      window.location.replace("/success");
    });
  } else {
    useEffect(() => {
      window.location.replace("/login");
    });
  }
}
