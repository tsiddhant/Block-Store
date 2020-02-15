import React, { Component } from 'react';
import web3 from '../web3';
import ipfs from '../ipfs';
import main from '../main';
import userAccount from '../userAccount';
import { Card, Form, Button, Row, Col, Input } from "reactstrap";
import { Navbar, Nav, Table } from "react-bootstrap";


////////////////////ENCRYPTION
import JSEncrypt from 'jsencrypt';
//import { BatchRequest } from 'web3/types';
const CryptoJS = require("crypto-js");
// const ipfsAPI = require('ipfs-api');
const divider = ":::";
// const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});

export default class project extends Component {

  state={
    userAdd:'',
    deployedAddress:'',
    showprojects :[],
    userprojects :[],
    message:'',
    publickey:'',
    privatekey:'',
  }


  async componentDidMount(){
    const accounts=await web3.eth.getAccounts();
    const deployedAddress=await main.methods.userdetails(accounts[0]).call();
    if(deployedAddress==0)
      window.location.href="/";
    this.setState({deployedAddress: deployedAddress, userAdd:accounts[0]});
    const userobj = await new web3.eth.Contract(userAccount, deployedAddress);
    const userprojects=await userobj.methods.getuserprojects().call({from:accounts[0]});
    this.setState({userprojects:userprojects});
    this.setState({showprojects:[]})
    var projecttable=this.state.showprojects;
    projecttable.push(
     <tr>
       <th>Project Name</th>
       <th>Project Address</th>
     </tr>
   );
   this.setState({ showprojects: projecttable });
   console.log(userprojects);
   var projecttable = this.state.showprojects;
   for (let i = 0; i < this.state.userprojects["0"].length; ++i) {
     var pp = "/project/" + this.state.userprojects["0"][i];
     console.log(pp);
     projecttable.push(
       <tr>
         <td>
           <a href={pp}>{this.state.userprojects["1"][i]}</a>
         </td>
         <td>{this.state.userprojects["0"][i]}</td>
       </tr>
     );
   }
   this.setState({ showprojects: projecttable });
 }

 render() {

   return (
     <div className="App">
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
         {/* <h1> Ethereum and IPFS with Cre React App</h1> */}


         <div style={{margin:'7% 15%'}}>
         <h5 class="font-weight-bold my-4">My Projects</h5>
         <Table bordered stripped hover>{this.state.showprojects}</Table>
         </div>
     </div>
   );
 }
}
