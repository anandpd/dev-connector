import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NavBar, Landing, Register, Login } from "./Components";

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
