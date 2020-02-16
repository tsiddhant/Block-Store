import React, { Component, useState } from "react";

import ipfs from "../ipfs";
import main from "../main";
import globalfile from "../globalfiles";
import "../assets/css/dashboard.css";
import "../assets/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import userAccount from '../userAccount';
// import { Player } from "video-react";
import { Container, Input } from "reactstrap";
import $ from "jquery";
import VideoThumbnail from "react-video-thumbnail";
import pdfth from "../assets/img/pdf.png";
import textth from "../assets/img/images.png";
import sv from "../assets/img/front.svg";

import { Widget, addResponseMessage, addUserMessage } from "react-chat-widget";
// import logo from './logo.svg';
import "react-chat-widget/lib/styles.css";
import web3 from "../web3";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Content,
  CardImg,
  Row,
  Col
} from "reactstrap";
import { Navbar, Nav, Form, NavDropdown,Image } from "react-bootstrap";

let urlipfs = "https://gateway.ipfs.io/ipfs/",
  file;
class Dashboard extends Component {
  state = {
    message: "",
    ipfsHash: "",
    imageShow: false,
    videoShow: false,
    textShow: false,
    documentShow: false,
    pdfFiles: [],
    imageFiles: [],
    textFiles: [],
    videoFiles: [],
    files: [],
    buffer: "",
    showPdf: [],
    showText: [],
    showVideos: [],
    showImages: []
  };
  async getfiles() {
    const accounts = await web3.eth.getAccounts();
    const filearray = await globalfile.methods.getfilearray().call();
    this.setState({ files: filearray });
    this.setState({ textFiles: [] });
    this.setState({ pdfFiles: [] });
    this.setState({ videoFiles: [] });
    this.setState({ imageFiles: [] });
    for (let i = 0; i < this.state.files["0"].length; ++i) {
      let name="Anonymous";
      if(this.state.files["1"][i]!="0x0000000000000000000000000000000000000000")
      {
      const deployedAddress=await main.methods.userdetails(this.state.files["1"][i]).call();
      const userobj = await new web3.eth.Contract(userAccount, deployedAddress);
      name=await userobj.methods.name().call();
      }
      var has = [];
      if (this.state.files["2"][i] == "application/pdf") {
        has.push(this.state.files["0"][i]);
        has.push(name);
        this.state.pdfFiles.push(has);
      } else if (this.state.files["2"][i] == "video/mp4") {
        has.push(this.state.files["0"][i]);
        has.push(name);
        this.state.videoFiles.push(has);
      } else if (
        this.state.files["2"][i] == "image/jpeg" ||
        this.state.files["2"][i] == "image/png"
      ) {
        has.push(this.state.files["0"][i]);
        has.push(name);
        this.state.imageFiles.push(has);
      } else {
        has.push(this.state.files["0"][i]);
        has.push(name);
        this.state.textFiles.push(has);
      }
    }
    await this.loadText();
    await this.loadPdf();
    await this.loadImages();
    await this.loadVideos();
  }
  captureFile = event => {
    event.stopPropagation();
    event.preventDefault();
    window.file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(window.file);
    reader.onloadend = () => this.convertToBuffer(reader);
  };

  convertToBuffer = async reader => {
    const buffer = await Buffer.from(reader.result);
    this.setState({ buffer: buffer });
    console.log("data::" + this.state.buffer);
    console.log("ftype:" + window.file.type);
  };

  fileSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    console.log("data::" + this.state.buffer);
    console.log("ftype:" + window.file.type);
    try {
      await ipfs.files.add(this.state.buffer, (err, ipfsHash) => {
        console.log(err, ipfsHash);
        this.setState({ ipfsHash: ipfsHash[0].hash });
        this.setState({ message: "ipfsHash Generated" });
        globalfile.methods
          .addinfilearray(this.state.ipfsHash, accounts[0], window.file.type)
          .send(
            {
              from: accounts[0],
              ipfsha: this.state.ipfsHash,
              user: accounts[0],
              ftype: window.file.type
            },
            (error, transactionHash) => {
              console.log(error, transactionHash);
              this.setState({ message: "transactionHash Generated" });
            }
          ); //main
      }); //await ipfs.add
    } catch (error) {
      this.setState({ message2: "File Could Not Be Send..." });
    }
    await this.getfiles();
  };
  fileSubmitAnony = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    console.log("data::" + this.state.buffer);
    console.log("ftype:" + window.file.type);
    try {
      await ipfs.files.add(this.state.buffer, (err, ipfsHash) => {
        console.log(err, ipfsHash);
        this.setState({ ipfsHash: ipfsHash[0].hash });
        this.setState({ message: "ipfsHash Generated" });
        globalfile.methods
          .addinfilearray(
            this.state.ipfsHash,
            "0x0000000000000000000000000000000000000000",
            window.file.type
          )
          .send(
            {
              from: accounts[0],
              ipfsha: this.state.ipfsHash,
              user: "0x0000000000000000000000000000000000000000",
              ftype: window.file.type
            },
            (error, transactionHash) => {
              console.log(error, transactionHash);
              this.setState({ message: "transactionHash Generated" });
            }
          ); //main
      }); //await ipfs.add
    } catch (error) {
      this.setState({ message2: "File Could Not Be Send..." });
    }
    await this.getfiles();
  };

  loadPdf = () => {
    var temp = [];

    if (this.state.pdfFiles.length == 0) {
      temp.push(
        <div class="carousel__item js-carousel-item">
          <Card>
            <CardFooter>
              <h5>No File Availabale</h5>
            </CardFooter>
          </Card>
        </div>
      );
    }
    this.state.pdfFiles.forEach(element => {
      console.log(element);
      var lin = urlipfs + element[0];
      var usr = element[1];
      temp.push(
        <div class="carousel__item js-carousel-item">
          <Card>
          <div style={{margin:'0 10%'}}>
          <Image src={pdfth} fluid />
          </div>
            <CardFooter>
              <h5>{usr}</h5>
              <Button className="btn btn-primary" color="primary" href={lin}>
                Open
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    });
    this.setState({ showPdf: temp });
  };
  loadImages = () => {
    var temp = [];
    if (this.state.imageFiles.length == 0) {
      temp.push(
        <div class="carousel__item js-carousel-item">
          <Card>
            <CardBody>
              <h5>No Image Availabale</h5>
            </CardBody>
          </Card>
        </div>
      );
    }

    this.state.imageFiles.forEach(element => {
      var lin = urlipfs + element[0];
      var usr = element[1];
      temp.push(
        <div class="carousel__item js-carousel-item">
          <Card>
          <div style={{margin:'0 10%'}}>
          <Image src={lin} fluid />
          </div>
            <CardFooter>
              <h5>{usr}</h5>
              <Button className="btn btn-primary" color="primary" href={lin}>
                Open
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    });
    this.setState({ showImages: temp });
  };
  loadVideos = () => {
    var temp = [];
    if (this.state.videoFiles.length == 0) {
      temp.push(
        <div class="carousel__item js-carousel-item">
          <Card>
            <CardBody>
              <h5>Videos</h5>
            </CardBody>
          </Card>
        </div>
      );
    }

    this.state.videoFiles.forEach(element => {
      var lin = urlipfs + element[0];
      var usr = element[1];
      temp.push(
        <div class="carousel__item js-carousel-item">
          <Card>
            <VideoThumbnail
              videoUrl={lin}
              thumbnailHandler={thumbnail => console.log(thumbnail)}
            />
            <CardFooter>
              <h5>{usr}</h5>
              <Button className="btn btn-primary" color="primary" href={lin}>
                Open
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    });
    this.setState({ showVideos: temp });
  };
  loadText = () => {
    var temp = [];
    if (this.state.textFiles.length == 0) {
      temp.push(
        <div class="carousel__item js-carousel-item">
          <Card>
            <CardBody>
              <h5>No file Availabale</h5>
            </CardBody>
          </Card>
        </div>
      );
    } else {
      this.state.textFiles.forEach(element => {
        var lin = urlipfs + element[0];
        var usr = element[1];
        temp.push(
          <div class="carousel__item js-carousel-item">
            <Card>
              <div style={{margin:'0 10%'}}>
              <Image src={textth} fluid />
              </div>
              <CardFooter>
                <h5>{usr}</h5>
                <Button className="btn btn-primary" color="primary" href={lin}>
                  Open
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
      });
    }
    this.setState({ showText: temp });
  };
  async componentDidMount() {
    await this.getfiles();
    // addResponseMessage("Welcome to this awesome chat!");
    $(".js-carousel").each(function() {
      var $carousel = $(this),
        $carouselContainer = $carousel.find(".js-carousel-container"),
        $carouselList = $carousel.find(".js-carousel-list"),
        $carouselItem = $carousel.find(".js-carousel-item"),
        $carouselButton = $carousel.find(".js-carousel-button"),
        setItemWidth = function() {
          $carouselList.removeAttr("style");
          var curWidth =
            $($carouselItem[0]).outerWidth() * $carouselItem.length;
          $carouselList.css("width", curWidth);
        },
        slide = function() {
          var $button = $(this),
            dir = $button.data("dir"),
            curPos = parseInt($carouselList.css("left")) || 0,
            moveto = 0,
            containerWidth = $carouselContainer.outerWidth(),
            listWidth = $carouselList.outerWidth(),
            before = curPos + containerWidth,
            after = listWidth + (curPos - containerWidth);
          if (dir == "next") {
            moveto =
              after < containerWidth ? curPos - after : curPos - containerWidth;
          } else {
            moveto = before >= 0 ? 0 : curPos + containerWidth;
          }

          $carouselList.animate({
            left: moveto
          });
        };
      $(window).resize(function() {
        setItemWidth();
      });
      setItemWidth();

      $carouselButton.on("click", slide);
    });
  }

  handleNewUserMessage = async newMessage => {
    const accounts = await web3.eth.getAccounts();
    console.log(`New message incoming! ${newMessage} :: ${accounts[0]}`);

    await globalfile.methods.addinglobalrequests(`${newMessage}`).send({
      from: accounts[0],
      msgg: `${newMessage}`
    });
    addUserMessage(`ID :: ${accounts[0]}`);
  };

  render() {
    return (
      <div class="wrapper" style={{ fontFamily: "sans-serif" }}>
        <div className="page">
        <div className="navbar-section">
          <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/dashboard">Block-Store</Navbar.Brand>
          <Nav className="ml-auto">
          <Nav.Link href="/dashboard">Home</Nav.Link>
          <Nav.Link href="/project">Projects</Nav.Link>
          <Nav.Link href="/files">Files</Nav.Link>
            </Nav>
          </Navbar>

          </div>
          <div className="upper-section">
            <Container>
            <h4 className="text-center" style={{ marginTop: "7%" }}>
            <b>  Block Store </b>
            </h4>
            </Container>
            {/* add files public */}
            <div style={{ float: "right", margin: "7% 0" }}>
              <Card style={{ margin: "0 60px" }}>
                <CardBody>
                  <Form onSubmit={this.fileSubmit}>
                    <Input type="file" onChange={this.captureFile} />
                    <Button
                      color="primary"
                      className="my-3 btn-sm-round"
                      type="submit"
                    >
                      Send by account
                    </Button>
                  </Form>
                  <Form onSubmit={this.fileSubmitAnony}>
                    <Input type="file" onChange={this.captureFile} />
                    <Button
                      color="primary"
                      className="my-3 btn-sm-roundhandleN"
                      type="submit"
                    >
                      Send Anonymously
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </div>
            <div className="header">
              {/* Text here */}
              <h5 className="my-4 mx-2 font-weight-bold">Doc Files</h5>
              <div class="carousel js-carousel my-5">
                <div class="carousel__container js-carousel-container mx-4">
                  <div class="carousel__list js-carousel-list">
                    {this.state.showText}
                  </div>
                </div>
                <div class="carousel__nav">
                  <button
                    className="carousel__button--prev js-carousel-button btn btn-primary"
                    data-dir="prev"
                    color="primary"
                  >
                    &lt;
                  </button>
                  <button
                    class="carousel__button--next js-carousel-button btn btn-primary"
                    data-dir="next"
                    color="primary"
                  >
                    &gt;
                  </button>
                </div>
              </div>
              {/* pdf files */}
              <h5 className="my-4 mx-2 font-weight-bold">Pdf Files</h5>
              <div class="carousel js-carousel my-5">
                <div class="carousel__container js-carousel-container mx-4">
                  <div class="carousel__list js-carousel-list">
                    {this.state.showPdf}
                  </div>
                </div>
                <div class="carousel__nav">
                  <button
                    class="carousel__button--prev js-carousel-button btn btn-primary"
                    data-dir="prev"
                  >
                    &lt;
                  </button>
                  <button
                    class="carousel__button--next js-carousel-button btn btn-primary"
                    data-dir="next"
                  >
                    &gt;
                  </button>
                </div>
              </div>
              {/* images here */}
              <h5 className="my-4 mx-2 font-weight-bold">Images</h5>
              <div class="carousel js-carousel my-5">
                <div class="carousel__container js-carousel-container mx-4">
                  <div class="carousel__list js-carousel-list">
                    {this.state.showImages}
                  </div>
                </div>
                <div class="carousel__nav">
                  <button
                    class="carousel__button--prev js-carousel-button btn btn-primary"
                    data-dir="prev"
                    color="primary"
                  >
                    &lt;
                  </button>
                  <button
                    class="carousel__button--next js-carousel-button btn btn-primary"
                    data-dir="next"
                    color="primary"
                  >
                    &gt;
                  </button>
                </div>
              </div>
              {/* videos here */}
              <h5 className="my-4 mx-2 font-weight-bold">Videos</h5>
              <div class="carousel js-carousel my-5">
                <div class="carousel__container js-carousel-container mx-4">
                  <div class="carousel__list js-carousel-list">
                    {this.state.showVideos}
                  </div>
                </div>
                <div class="carousel__nav">
                  <button
                    class="carousel__button--prev js-carousel-button btn btn-primary"
                    data-dir="prev"
                  >
                    &lt;
                  </button>
                  <button
                    class="carousel__button--next js-carousel-button btn btn-primary"
                    data-dir="next"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Widget
              handleNewUserMessage={this.handleNewUserMessage}
              //profileAvatar={logo}
              title="Requests Box"
              subtitle="Ask Anything"
            />
        </div>
      </div>
    );
  }
}

export default Dashboard;
