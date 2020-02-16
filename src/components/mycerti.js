import React, { Component } from 'react';
import web3 from '../web3';
import ipfs from '../ipfs';
import main from '../main';
import userAccount from '../userAccount';
import globalfile from '../globalfiles';
import certificate from '../certificate';

import { Card, Form, Button, Row, Col, Input } from "reactstrap";
import { Navbar, Nav, Table } from "react-bootstrap";


export default class mycerti extends Component {

  state={
    userAdd:'',
    deployedAddress:'',
    showcerti :[],
    usercerti :[],
    message:'',
    showcertirequest:[],
    usercertirequest:[]
  }


  async componentDidMount(){
    const accounts=await web3.eth.getAccounts();
    this.setState({userAdd:accounts[0]});
    console.log(accounts[0]);

    const deployedAddress=await globalfile.methods.Certification(accounts[0]).call();
    if(deployedAddress!=0)
    {
    console.log(deployedAddress);

    const certobj = await new web3.eth.Contract(certificate, deployedAddress);
    const usercerti=await certobj.methods.getcertificates().call();
    this.setState({usercerti:usercerti});
    this.setState({showcerti:[]})
    var certitable=this.state.showcerti;
    certitable.push(
     <tr>
       <th>Certifier</th>
       <th>Message</th>
       <th>Date</th>

     </tr>
   );
   this.setState({ showcerti: certitable });
//    console.log(userprojects);
   var certitable = this.state.showcerti;
   for (let i = 0; i < this.state.usercerti["0"].length; ++i) {
    //  var pp = "/project/" + this.state.usercerti["0"][i];
    //  console.log(pp);
     certitable.push(
       <tr>
         <td>
         {this.state.usercerti["0"][i]}
         </td>
         <td>{this.state.usercerti["1"][i]}</td>
         <td>{this.state.usercerti["2"][i]}</td>
       </tr>
     );
   }
   this.setState({ showcerti: certitable });
this.getallrequests();
}else{
    this.setState({message:'No certification available'});

}

}





async getallrequests(){
 const accounts=await web3.eth.getAccounts();
    const deployedAddress=await globalfile.methods.Certification(accounts[0]).call();
    if( deployedAddress!=0)
    {
    const certobj = await new web3.eth.Contract(certificate, deployedAddress);
    console.log(certobj);
    const usercerti=await certobj.methods.getallcertirequests().call({from:accounts[0]});
    console.log(usercerti);
    this.setState({usercertirequest:usercerti});
    this.setState({showcertirequest:[]})
    var certitable=this.state.showcertirequest;
    certitable.push(
     <tr>
       <th>Certifier</th>
       <th>Message</th>
       <th>Date</th>
         <th>Accept</th>
       <th>Reject</th>

     </tr>
   );
   this.setState({ showcertirequest: certitable });

   var certitable = this.state.showcertirequest;
   for (let i = 0; i < this.state.usercertirequest["0"].length; ++i) {
    //  var pp = "/project/" + this.state.usercerti["0"][i];
    //  console.log(pp);
     certitable.push(
       <tr>
         <td>
         {this.state.usercertirequest["0"][i]}
         </td>
         <td>{this.state.usercertirequest["1"][i]}</td>
         <td>{this.state.usercertirequest["2"][i]}</td>
         <td>
          <button onClick={() => this.accept(i)}>Accept</button>
        </td>
        <td>
          <button onClick={() => this.reject(i)}>Reject</button>
        </td>
       </tr>
     );
   }
   this.setState({ showcertirequest: certitable });
 }else{
     this.setState({message:'No certification available'});

 }
 }



 accept=async(index)=>{
  const certobj = await new web3.eth.Contract(certificate, this.state.deployedAddress);
  await certobj.methods.acceptcertificate(index).send({from:this.state.userAdd,i:index});
window.location.reload();

}

reject=async(index)=>{
  const certobj = await new web3.eth.Contract(certificate, this.state.deployedAddress);
  await certobj.methods.rejectcertificate(index).send({from:this.state.userAdd,i:index});
window.location.reload();

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



         <div style={{margin:'7% 15%'}}>
         <h5 class="font-weight-bold my-4">My Certificates request</h5>
         <Table bordered stripped hover>{this.state.showcertirequest}</Table>
         </div>
         <div style={{margin:'7% 15%'}}>
         <h5 class="font-weight-bold my-4">My Certificates</h5>
         <Table bordered stripped hover>{this.state.showcerti}</Table>
         </div>
     </div>
   );
 }
}
