
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import register from './components/register';
// import dashboard from './components/dashboard';
// import create_project from './components/create_project';
// import files from './components/files';
// import sent_files from './components/sent_files';
// import received_files from './components/received_files';
// import project from './components/project';
// import project_files from './components/project_files';
// import share_file from './components/share_file';
// import profile from './components/profile';

// import home from './components/home';


const CryptoJS = require("crypto-js");




//import logo from './logo.svg';
// import './App.css';
// import web3 from './web3';
// import ipfs from './ipfs';
// import main from './main';
// var forge=require('node-forge');

const FileSaver=require('file-saver');


var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz*&-%/!?*+=()";


export default class App extends Component{


  genPassPhrase = (keyLength) => {
        var randomstring = '';

        for (var i=0; i < keyLength; i++) {
          var rnum = Math.floor(Math.random() * chars.length);
          randomstring += chars.substring(rnum,rnum+1);
        }
        return randomstring;
      }



  captureFile = (event) => {
      event.stopPropagation()
      event.preventDefault()
      window.file = event.target.files[0]
      let reader = new window.FileReader()
      reader.readAsArrayBuffer(window.file)
      reader.onloadend = () => this.convertToBuffer(reader)
    };


    convertToBuffer = async(reader) => {
        const buffer = await Buffer.from(reader.result);
        this.setState({buffer: buffer});
      };


      Encrypt = async (event) => {

      event.preventDefault();

      //read the data to encrypt
      let data = this.state.buffer;
      let encodedData = data.toString('base64');
    console.log(encodedData);
    console.log(typeof(encodedData));
    var keykey = this.genPassPhrase(8);
var aesEncrypted = CryptoJS.AES.encrypt(encodedData, keykey).toString();
console.log(aesEncrypted);
var bytes = CryptoJS.AES.decrypt(aesEncrypted,keykey);
var yo =bytes.toString(CryptoJS.enc.Latin1);
console.log(yo);
  let buff = Buffer.from(yo, 'base64');
  var blob=new Blob([buff],{type:"application/octet-stream;"});
   FileSaver.saveAs(blob,"hell");
  }

render(){
  return (
    <form onSubmit={this.Encrypt}>


          <h7 style={{float:'left'}} className="my-2">
            Upload File To IPFS
          </h7>


          <input
            type="file"
            onChange={this.captureFile}
            id="ipfs"
          />


      <button className="btn-sm-round my-4" style={{position:'relative',left:'34%'}} color="primary">
        Add File
      </button>
    </form>

        )
      }
}
