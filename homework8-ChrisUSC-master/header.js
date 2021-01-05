import React from "react";
import Switch from "react-switch";
import { Search } from "semantic-ui-react";

import { Form, Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { withRouter } from "react-router-dom";
import Select, { async } from "react-select";
import Row from "react-bootstrap/Row";
import Async, { makeAsyncSelect } from "react-select/async";

import AutoComplete from "./AutoComplete.js"

import "./header.css";
const _ = require("underscore");

class Header extends React.Component {
  constructor(props) {
    super(props);
    var c = localStorage.getItem("site") === "NYTimes" ? false : true;
    this.state = ({ checked: c },
    { input: "" },
    { site: "" },
    { results: [] },
    { selectedOption: null }); //Late read from local storage

    if (localStorage.getItem("site") === "" || localStorage.getItem("site") === null) {
      localStorage.setItem("site", "NYTimes");
    }
    this.siteChange = this.siteChange.bind(this);
    this.formUpdate = this.formUpdate.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }



  async formUpdate(value) {


      var request = new XMLHttpRequest();


      try {
        const response = await fetch(
          "https://chris-pack.cognitiveservices.azure.com/bing/v7.0/suggestions=" + value,
          {
            headers: {
              "Ocp-Apim-Subscription-Key": "aed5e674cc114285914f21fee9e1829d"
            }
          }
        );
      }
      catch (e) {
          console.log("Bad request");
          return false;
      }
      console.log(request);
      request.addEventListener("load", function() {
          if (this.status === 200) {
              console.log((JSON.parse(this.responseText)));
          }
          else {

          }
      });
      this.setState({ input: value });

  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleSearchChange = async (event, { value }) => {
  try {
    const response = await fetch(
      `https://api.cognitive.microsoft.com/bing/v7.0/suggestions?mkt=fr-FR&q=${value}`,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": "917c08bb69d34a30a95f237a1832b1a3"
        }
      }
    );
    const data = await response.json();
    const resultsRaw = data.suggestionGroups[0].searchSuggestions;
    const results = resultsRaw.map(result => ({ title: result.displayText, url: result.url }));
    this.setState({ results });
  } catch (error) {
    console.error(`Error fetching search ${value}`);
  }
};

  siteChange(checked) {
    this.setState({ checked });
    var site = localStorage.getItem("site");
    if (site === "Guardian") {
      localStorage.setItem("site", "NYTimes");
    } else if (site === "NYTimes") {
      localStorage.setItem("site", "Guardian");
    }
    window.location.href = "/";
  }

  searchSubmit(temp) {
    console.log(temp);
    var input = this.state.input;

    this.props.history.push("/search/" + input); // val is a key
  }

  render() {
    return (
      <Row className="navRow">
        <Navbar
          className="color-nav"
          collapseOnSelect="collapseOnSelect"
          expand="sm"
          bg="primary"
          variant="dark"
        >


        <AutoComplete />

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto test">
              <LinkContainer to="/Home">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>

              <LinkContainer to="/World">
                <Nav.Link>World</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/Politics">
                <Nav.Link>Politics</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/Business">
                <Nav.Link>Business</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/Technology">
                <Nav.Link>Technology</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/Sport">
                <Nav.Link>Sports</Nav.Link>
              </LinkContainer>
            </Nav>
            <div className="example">
              <label>
                <span>NYTimes</span>
                <Switch
                  onChange={this.siteChange}
                  checked={
                    localStorage.getItem("site") === "NYTimes" ? false : true
                  }
                  uncheckedIcon={false}
                  checkedIcon={false}
                  className="react-switch"
                  onColor="#4696EC"
                />
                <span>Guardian</span>
              </label>
            </div>
          </Navbar.Collapse>
        </Navbar>
      </Row>
    );
  }
}

export default withRouter(Header);
