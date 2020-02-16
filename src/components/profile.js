import React, { Component } from 'react';
import web3 from '../web3';
import ipfs from '../ipfs';
import main from '../main';
import userAccount from '../userAccount';
import { Card, Form, Button, Row, Col, Input } from "reactstrap";
import { Navbar, Nav, Table } from "react-bootstrap";
import projectabi from '../project';



////////////////////ENCRYPTION
import JSEncrypt from 'jsencrypt';
//import { BatchRequest } from 'web3/types';
const CryptoJS = require("crypto-js");
// const ipfsAPI = require('ipfs-api');
const divider = ":::";
// const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});

export default class profile extends Component {

  state={
    userAdd:'',
    deployedAddress:'',
    showprojects :[],
    userprojects :[],
    message:'',
    publickey:'',
    privatekey:'',
    username:'',
    usernamename:'',
    usernameadd:'',
    faltu:''
  }


  async componentDidMount(){
    const accounts=await web3.eth.getAccounts();
    const deployedAddress=await main.methods.userdetails(accounts[0]).call();
    console.log(accounts[0]);
    if(deployedAddress==0)
      window.location.href="/";
    const username=this.props.match.params.username;
    const alluser = await main.methods.getUsers().call({from:accounts[0]});
    var flag=0;
    var usernameadd;
    for(let i=0;i<alluser.length;++i)
    {
      usernameadd=alluser[i];
      const userdeployed=await main.methods.userdetails(alluser[i]).call();
      const userobj = await new web3.eth.Contract(userAccount, userdeployed);
      const usernm = await userobj.methods.username().call();
      if(username==usernm)
      {
        flag = 1;
        break;
      }
    }
    if(flag==0)
    {
      window.location.href="/dashboard";

    }
    const usernamedeployed=await main.methods.userdetails(usernameadd).call();
    const usernameobj = await new web3.eth.Contract(userAccount, usernamedeployed);
    const name=await usernameobj.methods.name().call();
    this.setState({username:username,usernameadd:usernameadd,usernamename:name});
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
     const projadd=this.state.userprojects["0"][i];
     const projobj = await new web3.eth.Contract(projectabi, projadd);
     const teammates=await projobj.methods.getteammates().call({from:accounts[0]});
     var f=0;
     for(let j=0;j<teammates.length;++j){
       if(teammates[j]==usernameadd)
       {
         f=1;
         break;
       }

     }
     if(f==1) {
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
   }
   var aa = "certify/" + this.state.usernameadd;
   this.setState({ showprojects: projecttable , faltu:aa});
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
         <div>
         <label>Name:</label>
         {this.state.usernamename}
         </div>
         <div>
         <label>Username:</label>
         {this.state.username}
         </div>
         <div>
         <label>Address:</label>
         {this.state.usernameadd}
         </div>
         <div style={{margin:'7% 15%'}}>
         <h5 class="font-weight-bold my-4">Common Projects</h5>
         <Table bordered stripped hover>{this.state.showprojects}</Table>
         </div>
         <div>
         <a href ={this.state.faltu}><button>Certify user</button></a>
         </div>
     </div>
   );
 }
}
