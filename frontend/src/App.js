import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Landing from "./Components/Landing";
import Register from "./Components/auth/Register";
import Login from "./Components/auth/Login";

import "./App.css";

const App = () => (
  <Router>
    <Fragment>
      <NavBar />
      <Route exact path='/' component={Landing} />
      <section className='container'>
        <switch>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
        </switch>
      </section>
    </Fragment>
  </Router>
);

export default App;
