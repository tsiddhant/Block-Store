import React, { Component } from 'react';
import main from '../main';
import web3 from '../web3';
import ipfs from '../ipfs';
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/register.css";
import "../assets/css/bootstrap.min.css";
import { Card, Form, Button, Input } from "reactstrap";
import userAccount from '../userAccount';



export default class check_login extends Component {

  state={
    name:'',
    username:'',
    message:'',
    publickey :'',
    privatekey : '',
  }


  async componentDidMount(){
    const accounts=await web3.eth.getAccounts();

      const deployedAddress=await main.methods.userdetails(accounts[0]).call();
      if(deployedAddress!=0)
        window.location.href="/dashboard";
}
 render() {
     return (
        <p></p>
     );
   }
 }
