import React, { Component } from 'react';
import web3 from '../web3';
import ipfs from '../ipfs';
import main from '../main';
import userAccount from '../userAccount';
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/bootstrap.min.css";
import "../assets/css/file.css";
import { Card, Form, Button, Row, Col, Input } from "reactstrap";
import { Navbar, Nav, Table } from "react-bootstrap";

////////////////////ENCRYPTION
import JSEncrypt from 'jsencrypt';
//import { BatchRequest } from 'web3/types';
const CryptoJS = require("crypto-js");
// const ipfsAPI = require('ipfs-api');
const divider = ":::";
const quickEncrypt=require('quick-encrypt');
const FileSaver=require('file-saver');
// const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});

let pkey,pkey1,pke,key,plaintext,file;
var encrypted;
export default class sent_files extends Component {

  state={
    userAdd:'',
    deployedAddress:'',
    showfiles :[],
    userfiles :[],
    message:'',
    publickey:'',
    privatekey:'',
  }


  async getfiles(){
   const accounts=await web3.eth.getAccounts();
   const deployedAddress=await main.methods.userdetails(accounts[0]).call();
   this.setState({deployedAddress: deployedAddress, userAdd:accounts[0]});
   const userobj = await new web3.eth.Contract(userAccount, deployedAddress);
   const userfiles=await userobj.methods.getsendfiles().call({from:accounts[0]});
   this.setState({userfiles:userfiles});
   this.setState({showfiles:[]})
   var filetable=this.state.showfiles;
   filetable.push(
      <tr>
        <th>File Name</th>
        <th>File Address</th>
        <th>Recepient</th>
        <th>Status</th>
      </tr>
    );
    this.setState({ showfiles: filetable });
    console.log(userfiles);
    var filetable = this.state.showfiles;
    for (let i = 0; i < this.state.userfiles["0"].length; ++i) {
      filetable.push(
        <tr>
          <td>
            <a
              onClick={() =>
                this.download_file(
                  this.state.userfiles["0"][i],
                  this.state.userfiles["1"][i],
                  this.state.userfiles["2"][i]
                )
              }
            >
              {this.state.userfiles["2"][i]}
            </a>
          </td>
          <td>{this.state.userfiles["0"][i]}</td>
          <td>{this.state.userfiles["3"][i]}</td>
          <td>
            <Button
             className="btn-sm-round"
             color="primary"
              onClick={() =>
                this.sharefile(
                  this.state.userfiles["0"][i],
                  this.state.userfiles["1"][i],
                  this.state.userfiles["2"][i]
                )
              }
            >
              Share
            </Button>
          </td>
        </tr>
      );
    }
    this.setState({ showfiles: filetable });
  }





  async componentDidMount(){
    const accounts=await web3.eth.getAccounts();
    const deployedAddress=await main.methods.userdetails(accounts[0]).call();
    if(deployedAddress==0)
      window.location.href="/";
    this.setState({deployedAddress: deployedAddress, userAdd:accounts[0]});
    const userobj = await new web3.eth.Contract(userAccount, deployedAddress);
    const publickey=await userobj.methods.publickey().call();
    const privatekey=await userobj.methods.getprivatekey().call({from:accounts[0]});

    this.setState({publickey:publickey,privatekey:privatekey});
    this.getfiles();

  }


download_file =async(ipfsaddr,aesencr,fname)=>{
  var aesdecr=quickEncrypt.decrypt(aesencr,this.state.privatekey);
  try
  {

      await  ipfs.files.get(ipfsaddr, (err, res) => {
      console.log(res);
      console.log("AES key:: "+ aesdecr);

      var bytes = CryptoJS.AES.decrypt(res[0].content.toString(), aesdecr);//res[0].content.toString('utf-8')
      window.plaintext = bytes.toString(CryptoJS.enc.Latin1);
      console.log(window.plaintext);
      let buff = Buffer.from(window.plaintext, 'base64');


      var blob=new Blob([buff],{type:"application/octet-stream;"});
    FileSaver.saveAs(blob,fname);
  });

  }catch(error){
    this.setState({message2: 'File Could Not Be Send...'});
  }
}



sharefile =async(ipfsaddr,aesencr,fname)=>{
  const enteredadd=prompt("Enter recepient account address");
  console.log(enteredadd);
  const accounts=await web3.eth.getAccounts();
  const deployedAddress=await main.methods.userdetails(accounts[0]).call();
  this.setState({deployedAddress: deployedAddress, userAdd:accounts[0]});
  const userobj = await new web3.eth.Contract(userAccount, deployedAddress);
  var aesdecr=quickEncrypt.decrypt(aesencr,this.state.privatekey);
  console.log(aesdecr);
  try{
  const reAddress=await main.methods.userdetails(enteredadd).call();
  console.log(reAddress);
  if(reAddress)
  {
    const reobj = await new web3.eth.Contract(userAccount, reAddress);
    const republickey=await reobj.methods.publickey().call();
    let reencr=quickEncrypt.encrypt(aesdecr,republickey);
    await reobj.methods.addreceivedfile(ipfsaddr,reencr,fname, accounts[0]).send({
      from:accounts[0],
      file:ipfsaddr,
      aespass:reencr,
      nm:fname,
      user:accounts[0]
    });
    await userobj.methods.addsendfile(ipfsaddr,aesencr,fname, enteredadd).send({
      from:accounts[0],
      file:ipfsaddr,
      aespass:aesencr,
      nm:fname,
      user:enteredadd
    });
  }
}
  catch(e) {
    alert("User account does not exist");
    console.log(e);
  }


this.getfiles();




}




render() {
    return (
      <div className="App">
        {/* <h1> Ethereum and IPFS with Cre React App</h1> */}
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
        <div style={{ margin: "7% 15%" }}>
        <h4 className="font-weight-bold my-4">Sent files</h4>
        <Table bordered hover responsive stripped>{this.state.showfiles}</Table>
        </div>
      </div>
    );
  }
}
