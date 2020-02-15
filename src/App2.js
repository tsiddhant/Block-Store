import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import main from './main';



export default class App extends Component{

  state={
    deployedAddress:[],
    message:'',
    message2:'',
    users:[],
    name:'',
    id:'',
    ipfsHash:null,
    buffer:'',
    ethAddress:'',
    blockNumber:'',
    transactionHash:'',
    gasUsed:'',
    txReceipt:''
  };

  async componentDidMount()
  {
    const deployedAddress=await main.methods.getDeployedUsers().call();
    const users=await main.methods.getUsers().call();
    this.setState({deployedAddress: deployedAddress, users:users});
  }

  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)
  };


  convertToBuffer = async(reader) => {
    const buffer = await Buffer.from(reader.result);
    this.setState({buffer: buffer});
  };

  fileSubmit=async (event) => {
    event.preventDefault();

    const accounts=await web3.eth.getAccounts();
    console.log('Sending from account: ' + accounts[0]);
    //obtain contact address
    const ethAddress = await main.options.address;
    this.setState({ethAddress: ethAddress});
    console.log("ethAddress Generated");
    this.setState({message2: 'ethAddress Generated'});
    try{
        await ipfs.add(this.state.buffer, (err, ipfsHash) => {
          console.log(err, ipfsHash);
          this.setState({ ipfsHash:ipfsHash[0].hash });
          this.setState({message2: 'ipfsHash Generated'});
          main.methods.sendHash(this.state.ipfsHash).send({
            from: accounts[0]
          }, (error, transactionHash) => {
            console.log(error, transactionHash);
            this.setState({transactionHash: transactionHash});
            this.setState({message2: 'transactionHash Generated'});
          }); //main
        }) //await ipfs.add
    }catch(error){
      this.setState({message2: 'File Could Not Be Send...'});
    }


    this.setState({message:'waiting on transaction success...'});
    await main.methods.createUser(this.state.id,this.state.name).send(
    {
           from:accounts[0],
           name:this.state.name,
           id:this.state.id
    });

    this.setState({message:'You have registered successfully'});
 };//filesubmit

 fileClick = async () => {
   this.setState({ message: 'Waiting on transaction success...' });
   console.log("Users::");
   console.log(this.state.users);

   try {
   this.setState({blockNumber:'waiting..'});
   this.setState({gasUsed:'waiting..'});
   await web3.eth.getTransactionReceipt(this.state.transactionHash,
    (err, txReceipt) => {
      console.log(txReceipt);
      this.setState({txReceipt: txReceipt});
      this.setState({message2: 'txReceipt Generated'});
      });
   await this.setState({blockNumber: this.state.txReceipt.blockNumber});
   await this.setState({gasUsed: this.state.txReceipt.gasUsed});
    }
   catch(error){
     console.log(error);
     this.setState({blockNumber:'Error in fetching Value!!'});
     this.setState({gasUsed:'Error in fetching Value!!'});
   }
   this.setState({ message: 'Transaction Completed!' });
 };//fileclick

 userSubmit=async (event) => {
  event.preventDefault();
  const accounts=await web3.eth.getAccounts();
  this.setState({message:'waiting on transaction success...'});
  await main.methods.createUser(this.state.id,this.state.name).send(
  {
         from:accounts[0],
         name:this.state.name,
         id:this.state.id
  });
  this.setState({message:'You have registered successfully'});
};//usersubmit

userClick = async () => {
  this.setState({ message: 'Waiting on transaction success...' });
  console.log("Users::");
  console.log(this.state.users);
};//userclick

 render(){

  // let user=[];
  // user=this.state.users;

  return (
    <div className="App">
          <header className="App-header">
            <h1> Ethereum and IPFS with Create React App</h1>
          </header></div>
 //    <div>
 //      <h2>Account Creation</h2>
 //      <p>This system is managed by sid,
 //       There are currently {this.state.users.length} people registered.
 //      </p>
 //      <hr/>
 //
 //      <form onSubmit={this.userSubmit}>
 //        <h4>Want to try your luck</h4>
 //        <div>
 //             <label>Enter Name::</label>
 //             <input value={this.state.name} onChange={event=>this.setState({ name : event.target.value})}></input>
 //             <label>Enter ID::</label>
 //             <input value={this.state.id} onChange={event=>this.setState({ id : event.target.value})}></input>
 //        </div>
 //        <button>Register</button>
 //      </form>
 //
 //          <hr/>
 //        // {/* <h2>{user.forEach(item=>{return item;})}</h2> */}
 //        // {<ul id="sp">
 //        //   { document.getElementById("sp").innerHTML=
 //        //     this.state.users.forEach(item=>
 //        //     {
 //        //        const ele=document.createElement("li");
 //        //        ele.innerHTML=item;
 //        //        document.getElementById("sp").appendChild(ele);
 //        //     })
 //        //   }
 //        // </ul>
 //        // }
 //        // {<h1>{this.state.message}</h1>}
 //        // {<h2>{this.setState.message2}</h2>}
 //
 //        <hr/>
 //      <h4>Show All Registered Users</h4>
 //      <button onClick={this.userClick}>Get Users</button>
 //      <hr/>
 //          </div>
 //          <hr />
 //          <grid>
 //          <h3> Choose file to send to IPFS </h3>
 //          <form onSubmit={this.fileSubmit}>
 //            <input
 //              type = "file"
 //              onChange = {this.captureFile}
 //            />
 //             <button
 //             bsStyle="primary"
 //             type="submit">
 //             Send it
 //             </button>
 //          </form><hr/>
 // <button onClick = {this.fileClick}> Get Transaction Receipt </button>  <table bordered responsive>
 //                <thead>
 //                  <tr>
 //                    <th>Tx Receipt Category</th>
 //                    <th>Values</th>
 //                  </tr>
 //                </thead>
 //
 //                <tbody>
 //                  <tr>
 //                    <td>IPFS Hash # stored on Eth Contract</td>
 //                    <td>{this.state.ipfsHash}</td>
 //                  </tr>
 //                  <tr>
 //                    <td>Ethereum Contract Address</td>
 //                    <td>{this.state.ethAddress}</td>
 //                  </tr>                  <tr>
 //                    <td>Tx Hash # </td>
 //                    <td>{this.state.transactionHash}</td>
 //                  </tr>                  <tr>
 //                    <td>Block Number # </td>
 //                    <td>{this.state.blockNumber}</td>
 //                  </tr>                  <tr>
 //                    <td>Gas Used</td>
 //                    <td>{this.state.gasUsed}</td>
 //                  </tr>
 //
 //                </tbody>
 //            </table>
 //        </grid>
 //     </div>
  );
}
}
