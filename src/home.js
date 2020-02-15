import React, { Component, useState } from "react";
import "../assets/css/dashboard.css";
import "../assets/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import { Player } from "video-react";
import { Container } from "reactstrap";

import {
  Widget,
  addResponseMessage,
  addUserMessage
} from "react-chat-widget";
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
import {
  Navbar,
  Nav,
  Form,
  NavDropdown,
} from "react-bootstrap";


let urlipfs="https://gateway.ipfs.io/ipfs/";
class Dashboard extends Component {
  state = {
    imageShow: false,
    videoShow: false,
    textShow: false,
    documentShow: false,
    pdfFiles:[],
    imageFiles:[],
    textFiles:[],
    videoFiles:[]
  };
  loadPdf=()=>
  {
      this.state.pdfFiles.forEach(element => {
              //elemnet contains the address of who sended the file and ipfs hash of the file
      });
  }
  loadImages=()=>
  {
    this.state.imageFiles.forEach(element => {
               //elemnet contains the address of who sended the file and ipfs hash of the file
    });
  }
  loadVideos=()=>
  {
    this.state.videoFiles.forEach(element => {
              //elemnet contains the address of who sended the file and ipfs hash of the file
    });
  }
  loadText=()=>
  {
    this.state.textFiles.forEach(element => {
             //elemnet contains the address of who sended the file and ipfs hash of the file
    });
  }
  imageModalShow = () => {
    this.setState({ imageShow: true });
  };
  imageModalHide = () => {
    this.setState({ imageShow: false });
  };
  videoModalShow = () => {
    this.setState({ videoShow: true });
  };
  videoModalHide = () => {
    this.setState({ videoShow: false });
  };
  textModalShow = () => {
    this.setState({ textShow: true });
  };
  textModalHide = () => {
    this.setState({ textShow: false });
  };
  documentModalShow = () => {
    this.setState({ documentShow: true });
  };
  documentModalHide = () => {
    this.setState({ documentShow: false });
  };
 //CHAT BOX
  componentDidMount() {
    addResponseMessage("Welcome to this awesome chat!");
  }

  handleNewUserMessage = async newMessage => {
    const accounts = await web3.eth.getAccounts();
    console.log(`New message incoming! ${newMessage} :: ${accounts[0]}`);
    addUserMessage(`ID :: ${accounts[0]}`);
    // Now send the message through the backend API
  };


  render() {
    return (
      <>
        <div class="wrapper">
          <div className="page">
            <div className="navig">
              <Navbar bg="primary" variant="dark" sticky="top">
                <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                <Nav className="ml-auto">
                  <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">
                      Action
                    </NavDropdown.Item>{" "}
                    <NavDropdown.Item href="#action/3.2">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">
                      Something
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">
                      Separated link
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href="#home">Home</Nav.Link>
                  <Nav.Link href="#features">Features</Nav.Link>
                </Nav>
                <Form inline></Form>
              </Navbar>
              <div className="upper-section">
                  <Container>
                    <div className="text-center brand">
                      <img
                        alt="..."
                        className="n-logo"
                        src={require("../assets/img/now-logo.png")}
                      ></img>
                    </div>
                    <h1 className="category category-absolute text-center">
                      Open Drive
                    </h1>
                  </Container>
                  <div className="header">
              {/* text here */}
              <h6>Images here</h6>
              <Row>
                <Col Lg="3">
                  <div>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src="https://gateway.ipfs.io/ipfs/QmVPo74gB1nK5cmLnn5343Lfhk823MoMkiniS4HTouhm2L"
                        alt="Card image cap"
                        className="image-sel"
                      />
                      <CardFooter>
                        <p>name of the file</p>
                        <Button
                          onClick={() => this.imageModalShow()}
                          className="btn btn-primary"
                          color="primary"
                        >
                          Open
                        </Button>
                        <Modal
                          show={this.state.imageShow}
                          onHide={() => this.imageModalHide()}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Header closeButton></Modal.Header>
                          <Modal.Body>
                            <img
                              src="https://gateway.ipfs.io/ipfs/QmVPo74gB1nK5cmLnn5343Lfhk823MoMkiniS4HTouhm2L"
                              height="520"
                              width="760"
                            ></img>
                          </Modal.Body>
                        </Modal>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>

                <Col Lg="3">
                  <div>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src="https://gateway.ipfs.io/ipfs/QmRuzPpc1tjJ5TbhG7B2Ato8LtaY2DK2Y5DMWWb29cqFF5"
                        alt="Card image cap"
                        className="image-sel"
                      />
                      <CardFooter>
                        <p>name of the file</p>
                        <Button
                          onClick={() => this.imageModalShow()}
                          className="btn btn-primary"
                          color="primary"
                        >
                          Open
                        </Button>
                        <Modal
                          show={this.state.imageShow}
                          onHide={() => this.imageModalHide()}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Header closeButton></Modal.Header>
                          <Modal.Body>
                            <img
                              src="https://gateway.ipfs.io/ipfs/QmRuzPpc1tjJ5TbhG7B2Ato8LtaY2DK2Y5DMWWb29cqFF5"
                              height="520"
                              width="760"
                            ></img>
                          </Modal.Body>
                        </Modal>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
                <Col Lg="3">
                  <div>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src="https://gateway.ipfs.io/ipfs/QmRuzPpc1tjJ5TbhG7B2Ato8LtaY2DK2Y5DMWWb29cqFF5"
                        alt="Card image cap"
                        className="image-sel"
                      />

                      <CardFooter>
                        <p>name of the file</p>
                        <Button
                          onClick={() => this.imageModalShow()}
                          className="btn btn-primary"
                          color="primary"
                        >
                          Open
                        </Button>
                        <Modal
                          show={this.state.imageShow}
                          onHide={() => this.imageModalHide()}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Header closeButton></Modal.Header>
                          <Modal.Body>
                            <img
                              src="https://gateway.ipfs.io/ipfs/QmRuzPpc1tjJ5TbhG7B2Ato8LtaY2DK2Y5DMWWb29cqFF5"
                              height="520"
                              width="760"
                            ></img>
                          </Modal.Body>
                        </Modal>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
                <Col Lg="3">
                  <div>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src="https://gateway.ipfs.io/ipfs/QmRuzPpc1tjJ5TbhG7B2Ato8LtaY2DK2Y5DMWWb29cqFF5"
                        alt="Card image cap"
                        className="image-sel"
                      />

                      <CardFooter>
                        <p>name of the file</p>
                        <Button
                          onClick={() => this.imageModalShow()}
                          className="btn btn-primary"
                          color="primary"
                        >
                          Open
                        </Button>
                        <Modal
                          show={this.state.imageShow}
                          onHide={() => this.imageModalHide()}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Header closeButton></Modal.Header>
                          <Modal.Body>
                            <img
                              src="https://gateway.ipfs.io/ipfs/QmRuzPpc1tjJ5TbhG7B2Ato8LtaY2DK2Y5DMWWb29cqFF5"
                              height="520"
                              width="760"
                            ></img>
                          </Modal.Body>
                        </Modal>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
              </Row>
              {/* txt files here */}
              <h6>Text Files here</h6>
              <Row className="px-2 py-2">
                <Col Lg="3">
                  <div>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src={this.filetype}
                        alt="Card image cap"
                        className="px-5 py-5"
                      />
                      <CardBody></CardBody>
                      <CardFooter>
                        <p>name of the file</p>
                        <Button
                          onClick={() => this.textModalShow()}
                          className="btn btn-primary"
                          color="primary"
                        >
                          Open
                        </Button>
                        <Modal
                          show={this.state.textShow}
                          onHide={() => this.textModalHide()}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Header closeButton></Modal.Header>
                          <Modal.Body>
                            <embed
                              src="https://gateway.ipfs.io/ipfs/QmNYUuiNBXpxiLjzDXjdAXUnaTbxq6EPNv3u9KEo77hZNp"
                              width="100%"
                              height="100%"
                            />
                          </Modal.Body>
                        </Modal>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
                <Col Lg="3">
                  <div>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src={this.filetype}
                        alt="Card image cap"
                        className="px-5 py-5"
                      />
                      <CardBody></CardBody>
                      <CardFooter>
                        <p>name of the file</p>
                        <Button
                          onClick={() => this.textModalShow()}
                          className="btn btn-primary"
                          color="primary"
                        >
                          Open
                        </Button>
                        <Modal
                          show={this.state.textShow}
                          onHide={() => this.textModalHide()}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Header closeButton></Modal.Header>
                          <Modal.Body>
                            <embed
                              src="https://gateway.ipfs.io/ipfs/QmNYUuiNBXpxiLjzDXjdAXUnaTbxq6EPNv3u9KEo77hZNp"
                              width="100%"
                              height="100%"
                            />
                          </Modal.Body>
                        </Modal>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
                <Col Lg="3">
                  <div>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src={this.filetype}
                        alt="Card image cap"
                        className="px-5 py-5"
                      />
                      <CardBody></CardBody>
                      <CardFooter>
                        <p>name of the file</p>
                        <Button
                          onClick={() => this.textModalShow()}
                          className="btn btn-primary"
                          color="primary"
                        >
                          Open
                        </Button>
                        <Modal
                          show={this.state.textShow}
                          onHide={() => this.textModalHide()}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Header closeButton></Modal.Header>
                          <Modal.Body>
                            <embed
                              src="https://gateway.ipfs.io/ipfs/QmNYUuiNBXpxiLjzDXjdAXUnaTbxq6EPNv3u9KEo77hZNp"
                              width="100%"
                              height="100%"
                            />
                          </Modal.Body>
                        </Modal>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
                <Col Lg="3">
                  <div>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src={this.filetype}
                        alt="Card image cap"
                        className="px-5 py-5"
                      />
                      <CardBody></CardBody>
                      <CardFooter>
                        <p>name of the file</p>
                        <Button
                          onClick={() => this.textModalShow()}
                          className="btn btn-primary"
                          color="primary"
                        >
                          Open
                        </Button>
                        <Modal
                          show={this.state.textShow}
                          onHide={() => this.textModalHide()}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Header closeButton></Modal.Header>
                          <Modal.Body>
                            <embed
                              src="https://gateway.ipfs.io/ipfs/QmNYUuiNBXpxiLjzDXjdAXUnaTbxq6EPNv3u9KEo77hZNp"
                              width="100%"
                              height="100%"
                            />
                          </Modal.Body>
                        </Modal>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
              </Row>
              {/* PDF here */}
              <h6>PDF here</h6>
              <Row className="px-2 py-2">
                <Col Lg="3">
                  <div>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src={this.filetype}
                        alt="Card image cap"
                        className="px-5 py-5"
                      />
                      <CardFooter>
                        <p>name of the file</p>
                        <Button
                          onClick={() => this.documentModalShow()}
                          className="btn btn-primary"
                          color="primary"
                        >
                          Open
                        </Button>
                        <Modal
                          show={this.state.documentShow}
                          onHide={() => this.documentModalHide()}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Header closeButton></Modal.Header>
                          <Modal.Body>
                            <embed
                              src="https://gateway.ipfs.io/ipfs/QmWPCRv8jBfr9sDjKuB5sxpVzXhMycZzwqxifrZZdQ6K9o"
                              width="100%"
                              height="100%"
                            />
                          </Modal.Body>
                        </Modal>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
                <Col Lg="3">
                  <div>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src={this.filetype}
                        alt="Card image cap"
                        className="px-5 py-5"
                      />

                      <CardFooter>
                        <p>name of the file</p>
                        <a
                          className="btn btn-primary"
                          href="https://ipfs.infura.io/ipfs/QmWPCRv8jBfr9sDjKuB5sxpVzXhMycZzwqxifrZZdQ6K9o"
                        >
                          Open
                        </a>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
                <Col Lg="3">
                  <div>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src={this.filetype}
                        alt="Card image cap"
                        className="px-5 py-5"
                      />

                      <CardFooter>
                        <p>name of the file</p>
                        <a
                          className="btn btn-primary"
                          href="https://ipfs.infura.io/ipfs/QmWPCRv8jBfr9sDjKuB5sxpVzXhMycZzwqxifrZZdQ6K9o"
                        >
                          Open
                        </a>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
                <Col Lg="3">
                  <div>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src={this.filetype}
                        alt="Card image cap"
                        className="px-5 py-5"
                      />

                      <CardFooter>
                        <p>name of the file</p>
                        <a
                          className="btn btn-primary"
                          href="https://ipfs.infura.io/ipfs/QmWPCRv8jBfr9sDjKuB5sxpVzXhMycZzwqxifrZZdQ6K9o"
                        >
                          Open
                        </a>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
              </Row>
              {/* videos here */}
              <h6>videos here</h6>
              <Row>
                <Col Lg="3">
                  <div>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src="https://gateway.ipfs.io/ipfs/Qmem4exur6JCXTkJuc4XSYttEzFJg1U6RejgKrot7DNuCB"
                        alt="Card image cap"
                        className="px-5 py-5"
                      />

                      <CardFooter>
                        <p>name of the file</p>
                        <Button
                          onClick={() => this.videoModalShow()}
                          className="btn btn-primary"
                          color="primary"
                        >
                          Open
                        </Button>
                        <Modal
                          show={this.state.videoShow}
                          onHide={() => this.videoModalHide()}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Header closeButton></Modal.Header>
                          <Modal.Body>
                            <Player
                              ref={player => {
                                this.player = player;
                              }}
                              fluid="false"
                              autoPlay
                              height="520"
                              width="760"
                              className="player"
                            >
                              <source
                                src="https://gateway.ipfs.io/ipfs/Qmem4exur6JCXTkJuc4XSYttEFJg1U6RejgKrot7DNuCB"
                                height="520"
                                width="760"
                              />
                            </Player>
                          </Modal.Body>
                        </Modal>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
                <Col Lg="3">
                  <div>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src={this.filetype}
                        alt="Card image cap"
                        className="px-5 py-5"
                      />

                      <CardFooter>
                        <p>name of the file</p>
                        <Button
                          onClick={() => this.videoModalShow()}
                          className="btn btn-primary"
                          color="primary"
                        >
                          Open
                        </Button>
                        <Modal
                          show={this.state.videoShow}
                          onHide={() => this.videoModalHide()}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Header closeButton></Modal.Header>
                          <Modal.Body>
                            <Player
                              ref={player => {
                                this.player = player;
                              }}
                              fluid="false"
                              autoPlay
                              height="520"
                              width="760"
                              className="player"
                            >
                              <source
                                src="https://gateway.ipfs.io/ipfs/Qmem4exur6JCXTkJuc4XSYttEFJg1U6RejgKrot7DNuCB"
                                height="520"
                                width="760"
                              />
                            </Player>
                          </Modal.Body>
                        </Modal>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
                <Col Lg="3">
                  <div>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src={this.filetype}
                        alt="Card image cap"
                        className="px-5 py-5"
                      />
                      <CardFooter>
                        <p>name of the file</p>
                        <Button
                          onClick={() => this.videoModalShow()}
                          className="btn btn-primary"
                          color="primary"
                        >
                          Open
                        </Button>
                        <Modal
                          show={this.state.videoShow}
                          onHide={() => this.videoModalHide()}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Header closeButton></Modal.Header>
                          <Modal.Body>
                            <Player
                              ref={player => {
                                this.player = player;
                              }}
                              fluid="false"
                              autoPlay
                              height="520"
                              width="760"
                              className="player"
                            >
                              <source
                                src="https://gateway.ipfs.io/ipfs/Qmem4exur6JCXTkJuc4XSYttEzFJg1U6RejgKro7DNuCB"
                                height="520"
                                width="760"
                              />
                            </Player>
                          </Modal.Body>
                        </Modal>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
                <Col Lg="3">
                  <div>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src={this.filetype}
                        alt="Card image cap"
                        className="px-5 py-5"
                      />

                      <CardFooter>
                        <p>name of the file</p>
                        <Button
                          onClick={() => this.videoModalShow()}
                          className="btn btn-primary"
                          color="primary"
                        >
                          Open
                        </Button>
                        <Modal
                          show={this.state.videoShow}
                          onHide={() => this.videoModalHide()}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Header closeButton></Modal.Header>
                          <Modal.Body>
                            <Player
                              ref={player => {
                                this.player = player;
                              }}
                              fluid="false"
                              autoPlay
                              height="520"
                              width="760"
                              className="player"
                            >
                              <source
                                src="https://gateway.ipfs.io/ipfs/Qmem4exur6JCXTkJuc4XSYttEzFJg1U6RejgKrot7DNuCB"
                                height="520"
                                width="760"
                              />
                            </Player>
                          </Modal.Body>
                        </Modal>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
              </Row>
            </div>
              </div>
            </div>



            <Widget
              handleNewUserMessage={this.handleNewUserMessage}
              //profileAvatar={logo}
              title="Requests Box"
              subtitle="Ask Anything"
            />
          </div>{" "}
        </div>
      </>
    );
  }
}

export default Dashboard;
