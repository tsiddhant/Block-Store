import React, { Component } from 'react';
import web3 from '../web3';
import ipfs from '../ipfs';
import main from '../main';
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/register.css";
import "../assets/css/bootstrap.min.css";
import { Card, Form, Button, Input } from "reactstrap";
const quickEncrypt=require('quick-encrypt');


export default class register extends Component {

  state={
    name:'',
    username:'',
    message:'',
    publickey :'',
    privatekey : '',


  }


  async componentDidMount(){
    const accounts=await web3.eth.getAccounts();
    try{
      const deployedAddress=await main.methods.userdetails(accounts[0]).call();
      window.location.href="/dashboard";
}catch(e)
{

}
}


  userSubmit=async (event) => {
   event.preventDefault();
   const accounts=await web3.eth.getAccounts();
   this.setState({message:'waiting on transaction success...'});
   let keys=quickEncrypt.generate(2048);
   this.setState({publickey:keys.public});
   this.setState({privatekey:keys.private});
   await main.methods.createUser(this.state.username,this.state.name,this.state.publickey,this.state.privatekey).send(
   {
          from:accounts[0],
          usr:this.state.username,
          nm:this.state.name,
          pubkey:this.state.publickey,
          privkey:this.state.privatekey
   });

   console.log(this.state.privatekey+"     "+this.state.publickey );

   this.setState({message:'You have registered successfully'});

 };
 render() {
     return (
       <div className="App">
           <div className="register-page">
             <Form className="register-form px-5" onSubmit={this.userSubmit}>
               <h4 className="text-center my-5 font-weight-bold">Register</h4>
               <div className="form-group">
                 <Input
                   placeholder="Enter name"
                   type="text"
                   id="name"
                   className="form-control"
                   value={this.state.name}
                   onChange={event =>
                     this.setState({ name: event.target.value })
                   }
                 />
               </div>
               <div className="form-group">
                 <Input
                   placeholder="username"
                   type="text"
                   className="form-control"
                   value={this.state.username}
                   onChange={event =>
                     this.setState({ username: event.target.value })
                   }
                 />
               </div>
               <Button className="btn-round my-3" color="primary">
                 Register
               </Button>
               <h5>{this.state.message}</h5>
             </Form>
             {/* <h4> Ethereum and IPFS with Cre React App</h4> */}
           </div>
       </div>
     );
   }
 }
