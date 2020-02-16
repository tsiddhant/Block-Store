import React, { Component } from "react";
import web3 from "../web3";
import ipfs from "../ipfs";
import main from "../main";
import userAccount from "../userAccount";
import { Navbar, Nav, Table } from "react-bootstrap";
import { Card, Form, Button, Row, Col, Input } from "reactstrap";
import "../assets/css/master.css";

////////////////////ENCRYPTION
import JSEncrypt from "jsencrypt";
//import { BatchRequest } from 'web3/types';
const CryptoJS = require("crypto-js");
// const ipfsAPI = require('ipfs-api');
const divider = ":::";
const quickEncrypt = require("quick-encrypt");
const FileSaver = require("file-saver");
// const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});

let pkey, pkey1, pke, key, plaintext, file;
var encrypted;

var chars =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz*&-%/!?*+=()";

export default class files extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userAdd: "",
      users: [],
      deployedAddress: "",
      directory: "",
      userfiles: [],
      buffer: "",
      ipfsHash: "",
      message: "",
      publickey: "",
      privatekey: "",
      ethAddress: "",
      fname: "",
      aes: "",
      fileis: "",
      folder: "",
      path: [],
      enteredadd: ""
    };
  }

  genPassPhrase = keyLength => {
    var randomstring = "";

    for (var i = 0; i < keyLength; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  };

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
  };

  sharefile = async event => {
    event.preventDefault();
    const enteredadd = this.state.enteredadd;
    console.log(enteredadd);
    const accounts = await web3.eth.getAccounts();
    const deployedAddress = await main.methods.userdetails(accounts[0]).call();
    console.log(deployedAddress);
    this.setState({ deployedAddress: deployedAddress, userAdd: accounts[0] });
    const userobj = await new web3.eth.Contract(userAccount, deployedAddress);
    // const nodeobj=await userobj.methods.nodeStructs(childaddr).call({from:accounts[0]});
    // console.log(nodeobj);
    // var aesencr=nodeobj['aespass'];
    // var aesdecr=quickEncrypt.decrypt(aesencr,this.state.privatekey);
    // console.log(aesdecr);
    // var ipfsaddr=nodeobj['ipfshash'];
    // var fname=nodeobj['name'];
    try {
      const reAddress = await main.methods.userdetails(enteredadd).call();
      const reobj = await new web3.eth.Contract(userAccount, reAddress);
      const republickey = await reobj.methods.publickey().call();
      let data = this.state.buffer;
      data = data.toString("ascii");
      console.log("data:: " + data);
      window.key = this.genPassPhrase(8);
      console.log("AES key " + window.key);
      var aesEncrypted = CryptoJS.AES.encrypt(data, window.key).toString();
      console.log("aesEncrypted:: " + aesEncrypted);

      var encrBuff = Buffer.from(aesEncrypted);
      console.log("Buffer::" + encrBuff);
      try {
        await ipfs.files.add(encrBuff, async (err, ipfsHash) => {
          this.setState({ ipfsHash: ipfsHash[0].hash });
          console.log(err, "ipfsHash:: " + this.state.ipfsHash);
          let encr = quickEncrypt.encrypt(window.key, republickey);
          console.log(this.state.publickey);
          let aesencr = quickEncrypt.encrypt(window.key, this.state.publickey);
          this.setState({ aes: encr });

          var fullPath = document.getElementById("ipfs").value;

          if (fullPath) {
            var startIndex =
              fullPath.indexOf("\\") >= 0
                ? fullPath.lastIndexOf("\\")
                : fullPath.lastIndexOf("/");
            var filename = fullPath.substring(startIndex);
            if (filename.indexOf("\\") === 0 || filename.indexOf("/") === 0) {
              filename = filename.substring(1);
            }
            this.setState({ fname: filename });
          }
          console.log(this.state.fname);
          await reobj.methods
            .addreceivedfile(
              this.state.ipfsHash,
              encr,
              this.state.fname,
              accounts[0]
            )
            .send({
              from: accounts[0],
              file: this.state.ipfsHash,
              aespass: encr,
              nm: this.state.fname,
              user: accounts[0]
            });
          await userobj.methods
            .addsendfile(
              this.state.ipfsHash,
              aesencr,
              this.state.fname,
              enteredadd
            )
            .send({
              from: accounts[0],
              file: this.state.ipfsHash,
              aespass: aesencr,
              nm: this.state.fname,
              user: enteredadd
            });
        });
      } catch (e) {
        console.log(e);
      }
      //let encr=quickEncrypt.encrypt(,this.state.publickey);
    } catch (ee) {
      alert("account does not exist");
    }
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const deployedAddress = await main.methods.userdetails(accounts[0]).call();
    this.setState({ deployedAddress: deployedAddress, userAdd: accounts[0] });
    const userobj = await new web3.eth.Contract(userAccount, deployedAddress);
    console.log(window.sessionStorage.getItem("directory"));
    if (window.sessionStorage.getItem("directory")) {
      this.setState({ directory: window.sessionStorage.getItem("directory") });
    } else {
      var directory = await userobj.methods.treeRoot().call();
      this.setState({ directory: directory });
    }
    console.log(this.state.directory);
    const publickey = await userobj.methods.publickey().call();
    const privatekey = await userobj.methods
      .getprivatekey()
      .call({ from: accounts[0] });

    this.setState({ publickey: publickey, privatekey: privatekey });
  }

  render() {
    return (
      <div class="top">
        <div className="navbar-section">
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="home">Block-Store</Navbar.Brand>
            <Nav className="ml-auto">
              <Nav.Link href="dashboard">Dashboard</Nav.Link>
              <Nav.Link href="project">Project</Nav.Link>
              <Nav.Link href="files">Files</Nav.Link>
            </Nav>
          </Navbar>
          {/* <h1>Ethereum and IPFS with Cre React App</h1> */}
        </div>
        <header className="intro box">
          <h1>Global File Sharing via AccountID</h1>
        </header>
        <div class="box">
          <Form onSubmit={this.sharefile}>
            <input
              value={this.state.enteredadd}
              placeholder="Enter Dest. Addr."
              style={{ margin:'10px 0px 10px 0px' }}
              onChange={event =>
                this.setState({ enteredadd: event.target.value })
              }
            ></input>

            <div>
              <input type="file" style={{ margin:'10px 0px 10px 70px' }} onChange={this.captureFile} id="ipfs" />
            </div>
            <Button class="btn" color="primary">
            Share File
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}
