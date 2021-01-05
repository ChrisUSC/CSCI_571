import React from "react";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Icon } from "@iconify/react";
import mdShare from "@iconify/icons-ion/md-share";
import BounceLoader from "react-spinners/BounceLoader";
import { css } from "@emotion/core";
import Container from "react-bootstrap/Container";
import "./Section.css";
import Modal from "react-bootstrap/Modal";
import { withRouter } from "react-router-dom";

import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  EmailIcon,
  FacebookIcon,
  TwitterIcon
} from "react-share";

const override = css`
  display: block;
  margin: auto;
  margin-top: 200px;
  vertical-align: middle;
`;

class Search extends React.Component {
  constructor(props) {
    super(props);
    var opened = [];
    for (var i = 0; i < 10; i++) {
      opened.push(false);
    }
    this.state = {
      error: null,
      isLoaded: false,
      results: [],
      show: opened,
      previous: ""

    };
  }
  componentDidMount() {
    var currentURL = window.location.href;
    var n = currentURL.lastIndexOf("/");
    var t = currentURL.substr(n + 1, currentURL.length - n);
    var search = t.substr(0, t.length);
    var site = localStorage.getItem("site");
    var host = "hw8cpacktest1.appspot.com";
    console.log("search for " + search);
    var previous = search;
    if (site === "Guardian") {
      fetch("https://" + host + "/GuardianSearch?id=" + search)
        .then(res => res.json())
        .then(
          result => {
            var r = JSON.parse(result);
            const entries = Object.entries(r);
            const results = entries[0][1].results;
            console.log(results);
            var data = [];
            var push;
            var num = 0;
            for (let step = 0; step < results.length; step++) {
              if (results[step].type === "article") {
                if(results[step].blocks.main === undefined || results[step].blocks.main === null){
                  push = {
                    image:
                      "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png",
                    webTitle: results[step].webTitle,
                    summary: results[step].blocks.body[0].bodyTextSummary,
                    id: results[step].id,
                    section: results[step].sectionId,
                    url: results[step].webUrl,
                    number: num
                  }
                }
                else if (results[step].blocks.main.elements[0].type === "image") {
                  let lastImage =
                    results[step].blocks.main.elements[0].assets.length - 1;
                  if (
                    results[step].blocks.main.elements[0].assets[lastImage]
                      .typeData.width > 2000
                  ) {
                    push = {
                      image:
                        results[step].blocks.main.elements[0].assets[lastImage]
                          .file,
                      webTitle: results[step].webTitle,
                      summary: results[step].blocks.body[0].bodyTextSummary,
                      id: results[step].id,
                      url: results[step].webUrl,
                      date: results[step].webPublicationDate.substring(0, 10),
                      section: results[step].sectionId,
                      number: num
                    };
                    num = num + 1;
                  } else {
                    push = {
                      image:
                        "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png",
                      webTitle: results[step].webTitle,
                      summary: results[step].blocks.body[0].bodyTextSummary,
                      id: results[step].id,
                      url: results[step].webUrl,
                      section: results[step].sectionId,
                      number: num
                    };
                    num = num + 1;
                  }
                  data.push(push);
                }
              }
            }
            console.log(results);
            this.setState({
              isLoaded: true,
              results: data,
              previous: previous
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          error => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        );
    }
    if (site === "NYTimes") {

      fetch("https://" + host + "/NYTimesSearch?id=" + search)
        .then(res => res.json())
        .then(
          result => {
            var r = JSON.parse(result);
            var results = r.response.docs;
            console.log(results);
            var data = [];
            var push;
            var gotImage = false;
            var num = 0;
            var lower;
            if(result.length > 10){
              lower = 10;
            }
            else{
              lower = results.length;
            }
            for (var step = 0; step < lower; step++) {

              gotImage = false;
              for (
                var imageCount = 0;
                imageCount < results[step].multimedia.length;
                imageCount++
              ) {

                if (
                  results[step].multimedia[imageCount].width >= 2000 &&
                  gotImage === false
                ) {
                  gotImage = true;
                  push = {
                    image:
                      "https://www.nytimes.com/" +
                      results[step].multimedia[imageCount].url,
                    webTitle: results[step].headline.main,
                    summary: results[step].abstract,
                    url: results[step].web_url,
                    date: results[step].pub_date.substring(0, 10),
                    section: results[step].news_desk,
                    number: num,
                    id: results[step].web_url
                  };
                  num = num + 1;
                }
              }
              if(gotImage === false){
                push = {
                  image: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg",
                  webTitle: results[step].headline.main,
                  summary: results[step].abstract,
                  url: results[step].web_url,
                  date: results[step].pub_date.substring(0, 10),
                  section: results[step].news_desk,
                  number: num,
                  id: results[step].web_url
                };
                num = num + 1;
              }
              data.push(push);
            }
            console.log(data);
            this.setState({
              isLoaded: true,
              results: data,
              previous: previous
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          error => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        );
    }
  }

  componentDidUpdate(){
    console.log("compontent updated in search");
    var currentURL = window.location.href;
    var n = currentURL.lastIndexOf("/");
    var search = currentURL.substr(n + 1, currentURL.length - n);
    var site = localStorage.getItem("site");
    var host = "hw8cpacktest1.appspot.com";
    var previous;

    if(this.state.previous === search){
      //Do nothing
    }else{
    previous = search;
    if (site === "Guardian") {
      fetch("https://" + host + "/GuardianSearch?id=" + search)
        .then(res => res.json())
        .then(
          result => {
            var r = JSON.parse(result);
            const entries = Object.entries(r);
            const results = entries[0][1].results;
            console.log(results);
            var data = [];
            var push;
            var num = 0;
            for (let step = 0; step < results.length; step++) {
              if (results[step].type === "article") {
                if(results[step].blocks.main === undefined || results[step].blocks.main === null){
                  push = {
                    image:
                      "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png",
                    webTitle: results[step].webTitle,
                    summary: results[step].blocks.body[0].bodyTextSummary,
                    id: results[step].id,
                    section: results[step].sectionId,
                    number: num,
                    url: results[step].webUrl
                  }
                }
                else if (results[step].blocks.main.elements[0].type === "image") {
                  let lastImage =
                    results[step].blocks.main.elements[0].assets.length - 1;
                  if (
                    results[step].blocks.main.elements[0].assets[lastImage]
                      .typeData.width > 2000
                  ) {
                    push = {
                      image:
                        results[step].blocks.main.elements[0].assets[lastImage]
                          .file,
                      webTitle: results[step].webTitle,
                      summary: results[step].blocks.body[0].bodyTextSummary,
                      id: results[step].id,
                      date: results[step].webPublicationDate.substring(0, 10),
                      section: results[step].sectionId,
                      number: num,
                      url: results[step].webUrl

                    };
                    num = num + 1;
                  } else {
                    push = {
                      image:
                        "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png",
                      webTitle: results[step].webTitle,
                      summary: results[step].blocks.body[0].bodyTextSummary,
                      date: results[step].webPublicationDate.substring(0, 10),
                      id: results[step].id,
                      section: results[step].sectionId,
                      number: num,
                      url: results[step].webUrl

                    };
                    num = num + 1;
                  }
                  data.push(push);
                }
              }
            }

            this.setState({
              isLoaded: true,
              results: data
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          error => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        );
    }
    if (site === "NYTimes") {

      fetch("https://" + host + "/NYTimesSearch?id=" + search)
        .then(res => res.json())
        .then(
          result => {
            var r = JSON.parse(result);
            var results = r.response.docs;
            console.log(results);
            var data = [];
            var push;
            var gotImage = false;
            var num = 0;
            var lower;
            if(result.length > 10){
              lower = 10;
            }
            else{
              lower = results.length;
            }
            for (var step = 0; step < lower; step++) {

              gotImage = false;
              for (
                var imageCount = 0;
                imageCount < results[step].multimedia.length;
                imageCount++
              ) {

                if (
                  results[step].multimedia[imageCount].width >= 2000 &&
                  gotImage === false
                ) {
                  gotImage = true;
                  push = {
                    image:
                      "https://www.nytimes.com/" +
                      results[step].multimedia[imageCount].url,
                    webTitle: results[step].headline.main,
                    summary: results[step].abstract,
                    url: results[step].web_url,
                    date: results[step].pub_date.substring(0, 10),
                    section: results[step].news_desk,
                    number: num
                  };
                  num = num + 1;
                }
              }
              if(gotImage === false){
                push = {
                  image: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg",
                  webTitle: results[step].headline.main,
                  summary: results[step].abstract,
                  url: results[step].web_url,
                  date: results[step].pub_date.substring(0, 10),
                  section: results[step].news_desk,
                  number: num,
                  id: results[step].web_url
                };
                num = num + 1;
              }
              data.push(push);
            }
            console.log(data);
            this.setState({
              isLoaded: true,
              results: data,
              previous: previous
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          error => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        );
    }
  }
}


  temp(id) {

    this.props.history.push({
      pathname: "/article",
      search: "?id=" + id
    });
  }

  shareModal(id, e) {
    //Set show to true for id
    e.stopPropagation();

    var array = this.state.show;
    array[id] = true;
    this.setState({
      show: array
    });
  }
  handleClose(id, e) {
    e.stopPropagation();

    var array = this.state.show;
    array[id] = false;
    this.setState({
      show: array
    });
  }

  render() {
    const { error, isLoaded, results } = this.state;
    if (error) {
      return <div> Error: {error.message} </div>;
    } else if (!isLoaded) {
      return (
        <div>
          {" "}
          <BounceLoader
            css={override}
            size={60}
            color={"#123abc"}
            loading={!isLoaded}
          />{" "}
          <div className="loadingDiv"> Loading </div>{" "}
        </div>
      );
    } else {
      return (
        <Container fluid>
          <h1> Results </h1>{" "}
          <Row md={16} lg={16} xl={16}>
            {results.map(result => (
              <Col md={3} lg={3} xl={3}>
                <Card
                  className="styleCard"
                  onClick={this.temp.bind(this, result.id)}
                >
                  <Card.Body>
                    <Row xs={1} md={2}>
                      <Col>
                        {" "}
                        <Card.Title>
                          {" "}
                          {result.webTitle}{" "}
                          <Icon
                            icon={mdShare}
                            onClick={this.shareModal.bind(this, result.number)}
                          />
                          <Modal show={this.state.show[result.number]}>
                            <Modal.Header
                              closeButton
                              onClick={this.handleClose.bind(
                                this,
                                result.number
                              )}
                            >
                              <Modal.Title>{result.webTitle}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body style={{ textAlign: "center" }}>
                              <h3 style={{ textAlign: "center" }}>
                                {" "}
                                Share via{" "}
                              </h3>
                              <Row>
                                <Col>
                                  <FacebookShareButton
                                    url={result.url}
                                    title={result.webTitle}
                                    hashtag="#CSCI_571_NewsApp"
                                  >
                                    <FacebookIcon size={64} round />
                                  </FacebookShareButton>
                                </Col>

                                <Col>
                                  <TwitterShareButton
                                    url={result.url}
                                    hashtags={["CSCI_571_NewsApp"]}
                                  >
                                    <TwitterIcon size={64} round />
                                  </TwitterShareButton>
                                </Col>

                                <Col>
                                  <EmailShareButton
                                    subject="#CSCI_571_NewsApp"
                                    url={result.url}
                                    title={result.webTitle}
                                  >
                                    <EmailIcon size={64} round />
                                  </EmailShareButton>
                                </Col>
                              </Row>
                            </Modal.Body>
                          </Modal>
                        </Card.Title>{" "}
                        <Image src={result.image} thumbnail />
                        <Row>
                          <Col>
                            <Card.Text> {result.date} </Card.Text>{" "}
                          </Col>{" "}
                          <Col>
                            <Card.Text
                              style={{
                                backgroundColor: "#6E757C",
                                color: "white",
                                float: "right",
                                display: "inline-block"
                              }}
                              id={result.section}
                            >
                              {" "}
                              {result.section.toUpperCase()}{" "}
                            </Card.Text>{" "}
                          </Col>{" "}
                        </Row>{" "}
                      </Col>{" "}
                    </Row>{" "}
                  </Card.Body>{" "}
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      );
    }
  }
}
export default withRouter(Search);
