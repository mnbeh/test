import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./components/App/App";
import ApiContext from "./context/ApiContext";
import Api from "./services/Api";

const api = new Api();

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ApiContext.Provider value={api}>
        <App />
      </ApiContext.Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
