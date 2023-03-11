import React from "react";

import "./index.css";
import "./css/display.css";
import "./css/flex.css";
import "./css/font.css";
import "./css/size-width.css";
import "./css/size-height.css";
import "./css/margin.css";
import "./css/margin-x.css";
import "./css/margin-y.css";
import "./css/margin-top.css";
import "./css/margin-right.css";
import "./css/margin-bottom.css";
import "./css/margin-left.css";
import "./css/padding.css";
import "./css/padding-x.css";
import "./css/padding-y.css";
import "./css/padding-top.css";
import "./css/padding-right.css";
import "./css/padding-bottom.css";
import "./css/padding-left.css";
import "./css/border-and-outline.css";
import "./css/position.css";
import "./css/position-top.css";
import "./css/position-right.css";
import "./css/position-bottom.css";
import "./css/position-left.css";

import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import configureStore from "./store";

import { restoreCSRF, csrfFetch } from "./store/csrf";
const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  window.store = store;
}

function Root() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root")
);

// ... const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
}
