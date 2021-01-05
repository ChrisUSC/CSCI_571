import React from "react";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import TextTruncate from "react-text-truncate"; // recommend
import { Icon } from "@iconify/react";
import mdShare from "@iconify/icons-ion/md-share";
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";
import Button from "react-bootstrap/Button";

import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  EmailIcon,
  FacebookIcon,
  TwitterIcon
} from "react-share";

import Modal from "react-bootstrap/Modal";
import "./Section.css";
import "./article.css";

const override = css`
  display: block;
  margin: auto;
  margin-top: 200px;
  vertical-align: middle;
`;

var previous;

class Results extends React.Component {
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
      show: opened
    };
  }
  componentDidMount() {
    var site = localStorage.getItem("site");
    if(site == null){
      site = "NYTimes";
    }
    var currentURL = window.location.href;
    var n = currentURL.lastIndexOf("/");
    var section = currentURL.substr(n + 1, currentURL.length - n);
    section = section.toLowerCase();
    if (section.length === 0) {
      section = "home";
    }
    if (previous !== section) {
      previous = section;
      this.setState({
        isLoaded: false
      });
      var url = "https://hw8cpacktest1.appspot.com/" + site + "?section=" + section;
      if (site === "Guardian") {
        fetch(url)
          .then(res => res.json())
          .then(
            result => {
              var r = JSON.parse(result);
              const entries = Object.entries(r);
              var results = entries[0][1].results;
              var data = [];
              var push;

              for (let step = 0; step < results.length; step++) {
                if (results[step].type === "article") {
                  if (results[step].blocks.main.elements[0].type === "image") {
                    let lastImage =
                      results[step].blocks.main.elements[0].assets.length - 1;
                    if (
                      results[step].blocks.main.elements[0].assets[lastImage]
                        .typeData.width > 2000
                    ) {
                      if (results[step].webPublicationDate !== null) {
                        push = {
                          image:
                            results[step].blocks.main.elements[0].assets[
                              lastImage
                            ].file,
                          webTitle: results[step].webTitle,
                          summary: results[step].blocks.body[0].bodyTextSummary,
                          id: results[step].id,
                          date: results[step].webPublicationDate.substring(
                            0,
                            10
                          ),
                          section: results[step].sectionId,
                          url: results[step].webUrl,
                          number: step
                        };
                      } else {
                        push = {
                          image:
                            results[step].blocks.main.elements[0].assets[
                              lastImage
                            ].file,
                          webTitle: results[step].webTitle,
                          summary: results[step].blocks.body[0].bodyTextSummary,
                          id: results[step].id,
                          date: "No Date",
                          section: results[step].sectionId,
                          url: results[step].webUrl,
                          number: step
                        };
                      }
                    } else {
                      if (results[step].webPublicationDate !== null) {
                        push = {
                          image:
                            "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png",
                          webTitle: results[step].webTitle,
                          summary: results[step].blocks.body[0].bodyTextSummary,
                          id: results[step].id,
                          date: results[step].webPublicationDate.substring(
                            0,
                            10
                          ),
                          section: results[step].sectionId,
                          url: results[step].webUrl,
                          number: step
                        };
                      }
                      push = {
                        image:
                          "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png",
                        webTitle: results[step].webTitle,
                        summary: results[step].blocks.body[0].bodyTextSummary,
                        id: results[step].id,
                        date: "Date Missing",
                        section: results[step].sectionId,
                        url: results[step].webUrl,
                        number: step
                      };
                    }
                    data.push(push);
                  }
                }
              }
              this.setState({
                results: data,
                isLoaded: true
              });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            error => {
              this.setState({
                isLoaded: true
              });
            }
          );
      } else if (site === "NYTimes") {
        fetch(url)
          .then(res => res.json())
          .then(
            result => {
              var r = JSON.parse(result);
              const results = r.results;
              var data = [];
              var push;
              var lower;
              if(result.length > 10){
                lower = 10;
              }
              else{
                lower = results.length;
              }
              for (var step = 0; step < lower; step++) {
                push = {
                  image: results[step].multimedia[0].url,
                  webTitle: results[step].title,
                  summary: results[step].abstract,
                  id: results[step].url,
                  date: results[step].published_date.substring(0, 10),
                  section: results[step].section,
                  url: results[step].url,
                  number: step
                };
                data.push(push);
              }
              this.setState({
                results: data,
                isLoaded: true
              });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            error => {
              this.setState({
                isLoaded: true
              });
            }
          );
      } else {
      }
    }
  }
  componentDidUpdate() {
    var site = localStorage.getItem("site");
    var currentURL = window.location.href;
    var n = currentURL.lastIndexOf("/");
    var section = currentURL.substr(n + 1, currentURL.length - n);
    section = section.toLowerCase();
    if (section.length === 0) {
      section = "home";
    }
    if (previous !== section) {
      previous = section;
      this.setState({
        isLoaded: false
      });
      var host = "hw8cpacktest1.appspot.com";

      var url = "https://" + host + "/" + site + "?section=" + section;

      if (site === "Guardian") {
        fetch(url)
          .then(res => res.json())
          .then(
            result => {
              var r = JSON.parse(result);
              const entries = Object.entries(r);
              var results = entries[0][1].results;
              var data = [];
              var push;
              var lower;
              if(result.length > 10){
                lower = 10;
              }
              else{
                lower = results.length;
              }
              for (let step = 0; step < lower; step++) {
                if (results[step].type === "article") {
                  if (results[step].blocks.main.elements[0].type === "image") {
                    let lastImage =
                      results[step].blocks.main.elements[0].assets.length - 1;
                    if (
                      results[step].blocks.main.elements[0].assets[lastImage]
                        .typeData.width > 2000
                    ) {
                      push = {
                        image:
                          results[step].blocks.main.elements[0].assets[
                            lastImage
                          ].file,
                        webTitle: results[step].webTitle,
                        summary: results[step].blocks.body[0].bodyTextSummary,
                        id: results[step].id,
                        date: results[step].webPublicationDate.substring(0, 10),
                        section: results[step].sectionId,
                        url: results[step].webUrl,
                        number: step
                      };
                    } else {
                      push = {
                        image:
                          "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png",
                        webTitle: results[step].webTitle,
                        summary: results[step].blocks.body[0].bodyTextSummary,
                        id: results[step].id,
                        date: results[step].webPublicationDate.substring(0, 10),
                        section: results[step].sectionId,
                        url: results[step].webUrl,
                        number: step
                      };
                    }

                    data.push(push);
                  }
                }
              }
              this.setState({
                results: data,
                isLoaded: true
              });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            error => {
              this.setState({
                isLoaded: true
              });
            }
          );
      } else if (site === "NYTimes") {
        fetch(url)
          .then(res => res.json())
          .then(
            result => {
              var r = JSON.parse(result);
              const results = r.results;
              var data = [];
              var push;
              for (var step = 0; step < 10; step++) {
                push = {
                  image: results[step].multimedia[0].url,
                  webTitle: results[step].title,
                  summary: results[step].abstract,
                  id: results[step].url,
                  date: results[step].published_date.substring(0, 10),
                  section: results[step].section,
                  url: results[step].url,
                  number: step
                };
                data.push(push);
              }
              this.setState({
                results: data,
                isLoaded: true
              });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            error => {
              this.setState({
                isLoaded: true
              });
            }
          );
      }
    }
  }
  changeToArticle(id) {
    previous = "article";
    this.props.history.push({
      pathname: "/article",
      search: "?id=" + id
    });
  }

  shareModal(id, e) {
    //Set show to true for id
    e.stopPropagation();

    var temp = this.state.show;
    temp[id] = true;
    this.setState({
      show: temp
    });
  }
  handleClose(id, e) {
    e.stopPropagation();

    var temp = this.state.show;
    temp[id] = false;
    this.setState({
      show: temp
    });
  }


  render() {
    const { error, isLoaded, results } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div>
          <BounceLoader
            css={override}
            size={60}
            color={"#123abc"}
            loading={!isLoaded}
          />
          <div className="loadingDiv">Loading</div>
        </div>
      );
    } else {
      return (
        <div>
          <CardDeck>
            {results.map(result => (
              <Card
                className="styleCard"
                onClick={this.changeToArticle.bind(this, result.id)}
              >
                <Card.Body>
                  <Row xs={1} md={2}>
                    <Col md={3} xs={12}>
                      <Image src={result.image} thumbnail />
                    </Col>
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
                            onClick={this.handleClose.bind(this, result.number)}
                          >


                            <Modal.Title>{result.webTitle}</Modal.Title>
                          </Modal.Header>
                          <Modal.Body style={{ textAlign: "center" }}>
                            <h3 style={{ textAlign: "center" }}> Share via </h3>
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
                      </Card.Title>
                      <Card.Text> {result.abstract} </Card.Text>
                      <Card.Text>
                        <TextTruncate
                          line={3}
                          element="span"
                          truncateText=". . ."
                          text={result.summary}
                        />
                      </Card.Text>
                      <Row>
                        <Col>
                          <Card.Text>{result.date}</Card.Text>
                        </Col>
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
                            {result.section.toUpperCase()}{" "}
                          </Card.Text>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </CardDeck>
        </div>
      );
    }
  }
}
export default Results;
