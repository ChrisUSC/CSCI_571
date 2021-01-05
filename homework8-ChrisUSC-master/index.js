import React, { Component } from "react";
import ReactDOM from "react-dom";
import Header from "./Header.js";
import Search from "./Search.js";
import Section from "./Section.js";
import Article from "./Article.js";
import history from './history';

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";



class Page extends Component {
  constructor() {
    super();
    this.state = {
      name: "React"
    };
  }

  render() {
    return (
      <BrowserRouter history={history}>
        <Header />
        <Switch>
          <Route path="/Home" component={Section} exact />
          <Route path="/World" component={Section} exact />
          <Route path="/Politics" component={Section} exact />
          <Route path="/Business" component={Section} exact />
          <Route path="/Technology" component={Section} exact />
          <Route path="/Sport" component={Section} exact />
          <Route path="/article" component={Article} exact />
          <Route path="/search" component={Search}  />
          <Redirect from="/" to="/Home" exact/>
             </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<Page />, document.getElementById("root"));
