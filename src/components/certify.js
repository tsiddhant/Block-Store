import React, { Component } from 'react';
import web3 from '../web3';
import ipfs from '../ipfs';
import main from '../main';
import userAccount from '../userAccount';
import globalfile from '../globalfiles';
import certificate from '../certificate';

import {  Button, Row, Col, Input } from "reactstrap";
import { Navbar, Nav, Table,Card, Form } from "react-bootstrap";


export default class certify extends Component {

  state={
    message:'',
    date: '',
    recepient:'',
    certAddress:'',
    display:''
  }


  async componentDidMount(){

      this.setState({recepient:this.props.match.params.recepient});
    console.log(this.props.match.params.recepient);
 }




  addcertify =async(e)=>{
    e.preventDefault();
    const accounts=await web3.eth.getAccounts();

    const certAddress=await globalfile.methods.Certification(this.state.recepient).call();
     if (certAddress != 0){
      this.setState({certAddress:certAddress});

    console.log(certAddress);
     }
else{
        await globalfile.methods.createcertify(this.state.recepient).send({
            from:accounts[0],
            addr :this.state.recepient
            });
        const certAddress=await globalfile.methods.Certification(this.state.recepient).call();
      this.setState({certAddress:certAddress});}
      const certobj = await new web3.eth.Contract(certificate, this.state.certAddress);
      var date = new Date();
      date = date.toString();
      this.setState({date:date});

      await certobj.methods.addcertificates(this.state.message,this.state.date).send({from:accounts[0]});
      this.setState({display:'certification created'});


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
            <Form onSubmit={this.addcertify}>
                  <div>
                  <h6 style={{float:'left'}} className="my-2 mx-2">Enter Certification details</h6>
                  </div>
                  <Row>
                  <Form.Group>
                    <Form.Control
                      value={this.state.message}
                      onChange={event =>
                        this.setState({ message: event.target.value })
                      }
                    />
                    <Button className="btn-sm-round my-3" style={{position:'relative',marginLeft:'12%'}}  color="primary">
                      Add Certification
                    </Button>
                  </Form.Group>
                  </Row>
                </Form>
                {this.state.display}
     </div>
   );
 }
}
