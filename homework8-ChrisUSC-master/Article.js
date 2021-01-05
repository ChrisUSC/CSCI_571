import React from "react";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";
import commentBox from "commentbox.io";
import ShowMoreText from "react-show-more-text";

import { MdExpandMore, MdExpandLess } from "react-icons/md";
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  EmailIcon,
  FacebookIcon,
  TwitterIcon
} from "react-share";

import "./article.css";

const override = css`
  display: block;
  margin: auto;
  margin-top: 200px;
  vertical-align: middle;
`;

class PageWithComments extends React.Component {
  componentDidMount() {
    var currentURL = window.location.href;
    var n = currentURL.lastIndexOf("=");
    var id = currentURL.substr(n + 1, currentURL.length - n);
    this.removeCommentBox = commentBox("5696960862355456-proj", {
      defaultBoxId: id
    });
  }

  componentWillUnmount() {
    this.removeCommentBox();
  }

  render() {
    return <div className="commentbox" />;
  }
}

class Article extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    var currentURL = window.location.href;
    var n = currentURL.lastIndexOf("=");
    var article = currentURL.substr(n + 1, currentURL.length - n);
    var site = localStorage.getItem("site");
    var host = "hw8cpacktest1.appspot.com";

    var url = "https://" + host + "/" + site + "Details?id=" + article;
    var data = {};
    if (site === "Guardian") {
      fetch(url)
        .then(res => res.json())
        .then(
          result => {
            var data = [];
            var t = JSON.parse(result);
            var response = t.response.content;
            let lastImage = response.blocks.main.elements[0].assets.length - 1;
            var articleURL = "https://www.theguardian.com/" + article;
            if (
              response.blocks.main.elements[0].assets[lastImage].typeData
                .width < 2000
            ) {
              var addData = {
                title: response.webTitle,
                image:
                  "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png",
                date: response.webPublicationDate.substring(0, 10),
                description: response.blocks.body[0].bodyTextSummary,
                id: articleURL
              };
              data.push(addData);
            } else {
              addData = {
                title: response.webTitle,
                image: response.blocks.main.elements[0].assets[lastImage].file,
                date: response.webPublicationDate.substring(0, 10),
                description: response.blocks.body[0].bodyTextSummary,
                id: articleURL
              };
              data.push(addData);
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
              isLoaded: true,
              results: data
            });
          }
        );
    } else if (site === "NYTimes") {
      fetch(url)
        .then(res => res.json())
        .then(
          result => {
            var data = [];
            var t = JSON.parse(result);
            var myResult = t.response.docs[0];
            console.log(myResult);
            var gotImage = false;
            var broke = false;
            if (myResult.headline.main != null) {
              for (
                var imageCount = 0;
                imageCount < myResult.multimedia.length;
                imageCount++
              )
              {
                var addData;
                gotImage = false;
                if (
                  myResult.multimedia[imageCount].width >= 2000 &&
                  gotImage === false
                ) {
                  gotImage = true;
                  addData = {
                    image:
                      "https://www.nytimes.com/" +
                      myResult.multimedia[imageCount].url,
                    title: myResult.headline.main,
                    description: myResult.abstract,
                    id: myResult.web_url,
                    date: myResult.pub_date.substring(0, 10),
                    section: myResult.news_desk,

                  };
                  broke = true;
                  break;
                }
              }
              if (broke === false) {
                 addData = {
                  title: myResult.headline.main,
                  image:
                    "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg",
                  date: myResult.pub_date.substring(0, 10),
                  description: myResult.abstract,
                  id: myResult.web_url
                };
              }

              data.push(addData);
            }
            console.log(data);
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
              isLoaded: true,
              results: data
            });
          }
        );
    }
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
        <>
          {results.map(result => (
            <Card className="detailCard">
              <Row>
                <Col>
                  <Card.Title> {result.title} </Card.Title>
                </Col>
              </Row>

              <Card.Body style={{ fontSize: "20px" }}>
                {" "}
                <Row sm={4} md={4} lg={4} xl={4}>
                  <Col sm={2} md={8} lg={8} xl={8}>{result.date} </Col>
                  <Col sm={2} md={2} lg={2} xl={2}>
                    <FacebookShareButton
                      url={result.id}
                      title={result.title}
                      hashtag="#CSCI_571_NewsApp"
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>

                    <TwitterShareButton
                      url={result.id}
                      hashtags={["CSCI_571_NewsApp"]}
                    >
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>

                    <EmailShareButton
                      subject="#CSCI_571_NewsApp"
                      url={result.id}
                      title={result.title}
                    >
                      <EmailIcon size={32} round />
                    </EmailShareButton>
                  </Col>
                  <Col sm={1} md={1} lg={1} xl={1}>
                    <BookmarkBorderIcon
                    style={{color:"red"}}
                    fontSize="large" />
                  </Col>
                </Row>
              </Card.Body>

              <Row>
                <Col>
                  <Image src={result.image} fluid />
                </Col>
              </Row>
              <Row>
                <Card.Body>
                  <ShowMoreText
                    /* Default options */
                    lines={4}
                    more=<MdExpandMore style={{color:"gray"}} size={40} />
                    less=<MdExpandLess style={{color:"gray"}} size={40} />
                    anchorClass=""
                    onClick={this.executeOnClick}
                    expanded={false}
                    width={0}
                  >
                    {result.description}
                  </ShowMoreText>
                </Card.Body>
              </Row>
            </Card>
          ))}
          <PageWithComments />
        </>
      );
    }
  }
}

export default Article;
