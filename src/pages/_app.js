import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import { Helmet } from "react-helmet";

import "../styles/app.css";

export default function App({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <title>Auth demo</title>
      <Component {...pageProps} />
    </CookiesProvider>
  );
}
