import React, { Component } from 'react';
import web3 from '../web3';
import ipfs from '../ipfs';
import main from '../main';
import userAccount from '../userAccount';
import projectabi from '../project';

import {useParams} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/bootstrap.min.css";
import { Button, Row, Col, Input } from "reactstrap";
import { Navbar, Card, Form, Nav, Table } from "react-bootstrap";




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

var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz*&-%/!?*+=()";

export default class project_files extends Component {

  constructor(props) {
      super(props);

  this.state={
    userAdd:'',
    users : [],
    deployedAddress:'',
    directory : '',
    showfiles :[],
    projectfiles :[],
    buffer:'',
    ipfsHash:'',
    message:'',
    publickey:'',
    privatekey:'',
    fname:'',
    aes:'',
    fileis:'',
    folder:'',
    project:'',
    projectchats: [],
    showchats: [],
    chat: '',
    path:[]


  }
  this.todirectory = this.todirectory.bind(this);
}



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
     const accounts=await web3.eth.getAccounts();
     console.log('Sending from account: ' + accounts[0]);
     //  obtain contact address

    //read the data to encrypt
    let data = this.state.buffer;
    data=data.toString("base64");
    console.log("data:: "+ data);
    //console.log("JSON.stringify(data):: "+JSON.stringify(data));
    //generate a random password for creating AES key
    window.key = this.genPassPhrase(8);
    console.log('AES key ' + window.key);

    //aes encrypt the data using that key
    var aesEncrypted = CryptoJS.AES.encrypt(data, window.key).toString();
    console.log("aesEncrypted:: "+aesEncrypted);

  var encrBuff = Buffer.from(aesEncrypted);
  console.log("Buffer::"+encrBuff);
  try{
      await ipfs.files.add(encrBuff, async (err, ipfsHash) => {

        this.setState({ ipfsHash:ipfsHash[0].hash });
        console.log(err, "ipfsHash:: "+this.state.ipfsHash);
        console.log(this.state.publickey);
        let encr=quickEncrypt.encrypt(window.key,this.state.publickey);
        this.setState({aes: encr});

        var fullPath=document.getElementById("ipfs").value;

        if (fullPath) {
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);

        }
        this.setState({fname: filename});


        }
        const accounts=await web3.eth.getAccounts();
        const deployedAddress=await main.methods.userdetails(accounts[0]).call();
        const projobj = await new web3.eth.Contract(projectabi, this.state.project);
        console.log(this.state.fname);
        await projobj.methods.addfile(this.state.directory,this.state.ipfsHash,this.state.fname,this.state.aes).send({
          from:accounts[0],
          parent:this.state.directory,
          ipfsaddr:this.state.ipfsHash,
          nm:this.state.fname,
          aeskey:this.state.aes

        });

        this.getfiles();
      }); //await ipfs.add
  }catch(error){
    this.setState({message: 'File Could Not Be Send...'});
  }


}

  async getfiles(){
   const accounts=await web3.eth.getAccounts();
   const projobj = await new web3.eth.Contract(projectabi, this.state.project);
   const projectfiles=await projobj.methods.getprojectfiles(this.state.directory).call({from:accounts[0]});
   this.setState({projectfiles:projectfiles});
   this.setState({showfiles:[]})
   var filetable=this.state.showfiles;
   filetable.push(
      <tr>
        <th>File Name</th>
        <th>File Address</th>
        <th>Is File</th>
        <th>Share</th>
        <th>Delete</th>
      </tr>
    );
    this.setState({ showfiles: filetable });
    console.log(projectfiles);
    for (let i = 0; i < this.state.projectfiles["0"].length; ++i) {
      var filetable = this.state.showfiles;
      if (this.state.projectfiles["1"][i]) {
        this.setState({ fileis: "Yes" });
        filetable.push(
          <tr>
            <td>
              <a
                onClick={() =>
                  this.download_file(this.state.projectfiles["0"][i])
                }
                type="button"
                   className="text-capitalize text-primary"
              >
                {this.state.projectfiles["2"][i]}
              </a>
            </td>
            <td>{this.state.projectfiles["0"][i]}</td>
            <td>{this.state.fileis}</td>
            <td>
              <Button
                className="btn-sm-round"
                color="primary"
                onClick={() => this.sharefile(this.state.projectfiles["0"][i])}
              >
                Share
              </Button>
              </td>
              <td>
                <Button
                className="btn-sm-round"
                color="primary"
                  onClick={() => this.deletefile(this.state.projectfiles["0"][i])}
                >
                  Delete
                </Button>
              </td>

          </tr>
        );
      } else {
        this.setState({ fileis: "No" });
        filetable.push(
          <tr>
            <td>
              <a
                onClick={() =>
                  this.opendirectory(this.state.projectfiles["0"][i])
                }
                type="button"
                   className="text-capitalize text-primary"
              >
                {this.state.projectfiles["2"][i]}
              </a>
            </td>
            <td>{this.state.projectfiles["0"][i]}</td>
            <td>{this.state.fileis}</td>
            <td></td>
            <td>
              <Button
              className="btn-sm-round"
              color="primary"
                onClick={() => this.deletefile(this.state.projectfiles["0"][i])}
              >
                Delete
              </Button>
            </td>
          </tr>
        );
      }
      this.setState({ showfiles: filetable });
    }
   var pathdir=this.state.directory;
   var tempdir=[];
   do{
     console.log(pathdir);
     const nodeobj=await projobj.methods.nodeStructs(pathdir).call({from:accounts[0]});
     var dirname=nodeobj['name'];
     tempdir.push(<span><a value={pathdir} className="text-primary" type="button" onClick={this.todirectory} >{dirname}/</a></span>);
     pathdir=nodeobj['parent'];
   }while(pathdir!=0);
   tempdir.reverse();
   this.setState({path:tempdir});



   const projectchats=await projobj.methods.getprojectchats().call({from:accounts[0]});
      this.setState({projectchats:projectchats});
      this.setState({showchats:[]})
      var chattable=this.state.showchats;
      chattable.push(<tr><th>Message</th><th>Sender</th></tr>);
      this.setState({showchats:chattable});
      console.log(this.state.projectchats);
     //  this.setState({projectchats:projectchats});
   // console.log(this.state.projectchats['0'].length);
       //  var chattable=this.state.showchats;

      for(let j=0;j<this.state.projectchats['0'].length;++j)
      {
        chattable.push(<tr><td>{this.state.projectchats['0'][j]}</td><td>{this.state.projectchats['1'][j]}</td></tr>);
        this.setState({showchats:chattable});
      }

   window.sessionStorage.setItem(this.state.project,this.state.directory);
   console.log(this.state.directory);


  //  window.sessionStorage.setItem(this.state.project,this.state.directory);
  //  console.log(this.state.showchats);


 }

 todirectory(event){
   // e.preventDefault();
   const directory=event.target.getAttribute("value");
   console.log(this);
   this.setState({directory:directory,showfiles:[]});
   this.getfiles();
 }

opendirectory =(directory)=>{
  // e.preventDefault();
  this.setState({directory:directory,showfiles:[]});
  this.getfiles();
}





  async componentDidMount(){
    const accounts=await web3.eth.getAccounts();
    const deployedAddress=await main.methods.userdetails(accounts[0]).call();
    if(deployedAddress==0)
      window.location.href="/";
    const project=this.props.match.params.projectaddr;
    console.log(this.props.match.params.projectaddr);
    // const deployedAddress=await main.methods.userdetails(accounts[0]).call();
    this.setState({project:project, userAdd:accounts[0]});

    // const userobj = await new web3.eth.Contract(userAccount, deployedAddress);
    const projobj = await new web3.eth.Contract(projectabi, this.state.project);
    // const projobj=await main.methods.userdetails(accounts[0]).call();



    console.log(window.sessionStorage.getItem(this.state.project));
    if(window.sessionStorage.getItem(this.state.project))
    {
      this.setState({directory:window.sessionStorage.getItem(this.state.project)});
    }
    else {

    var directory=await projobj.methods.treeRoot().call();
    this.setState({directory: directory});
  }
  console.log(this.state.directory);
    const publickey=await projobj.methods.getpublickey().call({from:accounts[0]});
    const privatekey=await projobj.methods.getprivatekey().call({from:accounts[0]});

    this.setState({publickey:publickey,privatekey:privatekey});
    this.getfiles();

  }


download_file =async(childaddr)=>{
  const accounts=await web3.eth.getAccounts();
  const projobj = await new web3.eth.Contract(projectabi, this.state.project);
  const nodeobj=await projobj.methods.nodeStructs(childaddr).call({from:accounts[0]});
  console.log(nodeobj);
  var aesencr=nodeobj['aespass'];
  var aesdecr=quickEncrypt.decrypt(aesencr,this.state.privatekey);
  console.log(aesdecr);
  var ipfsaddr=nodeobj['ipfshash'];
  var fname=nodeobj['name'];


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



sharefile =async(childaddr)=>{
  const enteredadd=prompt("Enter recepient account address");
  console.log(enteredadd);
  const accounts=await web3.eth.getAccounts();
  const deployedAddress=await main.methods.userdetails(accounts[0]).call();
  this.setState({deployedAddress: deployedAddress, userAdd:accounts[0]});
  const userobj = await new web3.eth.Contract(userAccount, deployedAddress);
  const projobj = await new web3.eth.Contract(projectabi, this.state.project);
  const nodeobj=await projobj.methods.nodeStructs(childaddr).call({from:accounts[0]});
  console.log(nodeobj);
  var aesencr=nodeobj['aespass'];
  var aesdecr=quickEncrypt.decrypt(aesencr,this.state.privatekey);
  console.log(aesdecr);
  var ipfsaddr=nodeobj['ipfshash'];
  var fname=nodeobj['name'];
  try {
    const reAddress=await main.methods.userdetails(enteredadd).call();
    console.log(reAddress);
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
  } catch (e) {
    console.log(e);
    alert("User account does not exist");
  }
  // let encr=quickEncrypt.encrypt(,this.state.publickey);
}



deletefile =async(childaddr)=>{
  console.log(childaddr);
  const accounts=await web3.eth.getAccounts();
  const deployedAddress=await main.methods.userdetails(accounts[0]).call();
  this.setState({deployedAddress: deployedAddress, userAdd:accounts[0]});
  const userobj = await new web3.eth.Contract(userAccount, deployedAddress);
  await userobj.methods.pruneBranch(childaddr).send({from:accounts[0]});

  this.getfiles();
}




addfolder =async(e)=>{
  e.preventDefault();
  const accounts=await web3.eth.getAccounts();
  const projobj = await new web3.eth.Contract(projectabi, this.state.project);
  await projobj.methods.addfile(this.state.directory,"",this.state.folder,"").send({
    from:accounts[0],
    parent:this.state.directory,
    ipfsaddr:"",
    nm:this.state.folder,
    aeskey:""

  });
this.getfiles();

}


addchat =async(e)=>{
  e.preventDefault();
  const accounts=await web3.eth.getAccounts();
  const projobj = await new web3.eth.Contract(projectabi, this.state.project);
  await projobj.methods.addprojectchat(this.state.chat).send({
    from:accounts[0],
    message:this.state.chat

  });
this.getfiles();

}

addchat =async(e)=>{
  e.preventDefault();
  const accounts=await web3.eth.getAccounts();
  const projobj = await new web3.eth.Contract(projectabi, this.state.project);
  await projobj.methods.addprojectchat(this.state.chat).send({
    from:accounts[0],
    message:this.state.chat

  });
this.getfiles();

}

render(){
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
          {/* <h4> Ethereum and IPFS with Cre React App</h1> */}
          <h3 className="font-weight-bold mt-5 text-center">Project Files</h3>
          <div style={{marginLeft:'18%'}}>
            <a type="button" className="text-capitalize" style={{textDecoration:'none',float:'left',fontSize:'18px'}}>{this.state.path}</a>
          </div>
          <div class="main-pge">
          <Row>
          <Col style={{ margin: "5% 3%" }}>
               <Row>
                <Col lg="6">
                <Form onSubmit={this.Encrypt}>
                    <h6 style={{float:'left'}} className="my-2 mx-3">
                        Upload File To IPFS
                    </h6>
                   <Form.Group>
                    <Form.Row>
                     <Form.Control
                       type="file"
                       onChange={this.captureFile}
                       id="ipfs"
                     />
                     </Form.Row>
                   </Form.Group>
                   <Button className="btn-sm-round my-2" color="primary">
                     Add File
                   </Button>
                </Form>
                </Col>
                <Col lg="6">
                <Form onSubmit={this.addfolder}>
                  <div>
                  <h6 style={{float:'left'}} className="my-2 mx-2">Enter Folder Name</h6>
                  </div>
                  <Row>
                  <Form.Group>
                    <Form.Control
                      value={this.state.folder}
                      onChange={event =>
                        this.setState({ folder: event.target.value })
                      }
                    />
                    <Button className="btn-sm-round my-3" style={{position:'relative',marginLeft:'12%'}}  color="primary">
                      Add Folder
                    </Button>
                  </Form.Group>
                  </Row>
                </Form>
                </Col>
              </Row>
          </Col>
        </Row>
            <Row>
              <Col
                className="table-sec"
              >
                <Table hover stripped bordered responsive>
                  <tbody>{this.state.showfiles}</tbody>
                </Table>
              </Col>
              </Row>
              <div>
                            <form onSubmit={this.addchat}>
                              <h5 className="my-4">Type message here</h5>
                              <div>
                              <input value={this.state.chat} onChange={event=>this.setState({ chat : event.target.value})}></input>
                              </div>
                              <Button className="nbtn-round my-4" color="primary">Send message</Button>
                            </form>
                              <h5 className="my-4">Project Chat Area</h5>
                            <Table bordered stripped hover>
                            {this.state.showchats}
                            </Table>
                            </div>
          </div>
        </div>
      );
    }
  }
