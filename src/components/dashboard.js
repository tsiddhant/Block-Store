import React, { Component } from 'react';
import web3 from '../web3';
import ipfs from '../ipfs';
import main from '../main';
import userAccount from '../userAccount';
import projectabi from '../project';
import { Button, Row, Col, Input } from "reactstrap";
import { Navbar, ListGroup, Card, Form, Nav, Table } from "react-bootstrap";


export default class dashboard extends Component {

  state={
    name:'',
    username:'',
    message:'',
    userAdd:'',
    projects:{},
    userfiles:[],
    allrequests:[],
    deployedAddress:'',
    requestleader:[],
    showprojects:[],
    showfiles:[],
    showrequests:[],
    searchusername:''

  }
async componentDidMount(){
  const accounts=await web3.eth.getAccounts();
  const deployedAddress=await main.methods.userdetails(accounts[0]).call();
  if(deployedAddress==0)
    window.location.href="/";
  this.setState({deployedAddress: deployedAddress, userAdd:accounts[0]});
  const userobj = await new web3.eth.Contract(userAccount, deployedAddress);
  // console.log("good");

  const name=await userobj.methods.name().call({from:accounts[0]});
  const username=await userobj.methods.username().call({from:accounts[0]});
  const projects=await userobj.methods.getuserprojects().call({from:accounts[0]});
  // const userfiles=await userobj.methods.getuserfiles().call({from:accounts[0]});
  const allrequests=await userobj.methods.getallrequests().call({from:accounts[0]});
  console.log(allrequests);
  this.setState({name: name, username:username, projects:projects, allrequests:allrequests});
  for(let i=0;i<this.state.allrequests['0'].length;++i)
  {
    const projectobj=await new web3.eth.Contract(projectabi,this.state.allrequests['0'][i]);
    const teamleader=await main.methods.projectdetails(this.state.allrequests['0'][i]).call();
    const deployedleader=await main.methods.userdetails(teamleader).call();
    const leaderobj=await new web3.eth.Contract(userAccount, deployedleader);
    const leadername=await leaderobj.methods.username().call();
    console.log(leadername);
    var joined = this.state.requestleader;
    joined.push(leadername);
    this.setState({ requestleader: joined });
  }



  var table = this.state.showprojects;
    table.push(
      <tr>
        <th>Project Address</th>
        <th>Project Name</th>
      </tr>
    );
    this.setState({ showprojects: table });

    for (let i = 0; i < this.state.projects["0"].length; ++i) {
      var table = this.state.showprojects;
      table.push(
        <tr>
          <td>{this.state.projects["0"][i]}</td>
          <td>{this.state.projects["1"][i]}</td>
        </tr>
      );
      this.setState({ showprojects: table });
    }

    // var filetable=this.state.showfiles;



  // var filetable=this.state.showfiles;
  // filetable.push(<th><td>File Address</td><td>File Name</td></th>);
  // this.setState({showfiles:filetable});

  // for(let i=0;i<this.state.userfiles['0'].length;++i)
  // {
  //   var filetable=this.state.showfiles;
  //   filetable.push(<tr><td>{this.state.userfiles['0'][i]}</td><td>{this.state.userfiles['1'][i]}</td></tr>);
  //   this.setState({showfiles:filetable});
  //
  // }



  var requesttable = this.state.showrequests;
  requesttable.push(
    <tr>
      <th>Project Name</th>
      <th>Project Address</th>
      <th>Project Leader</th>
      <th>Accept</th>
      <th>Reject</th>
    </tr>
  );
  this.setState({ showrequests: requesttable });

  for (let i = 0; i < this.state.allrequests["0"].length; ++i) {
    var requesttable = this.state.showrequests;
    requesttable.push(
      <tr>
        <td>{this.state.allrequests["0"][i]}</td>
        <td>{this.state.allrequests["1"][i]}</td>
        <td>{this.state.requestleader[i]}</td>
        <td>
          <button onClick={() => this.accept(i)}>Accept</button>
        </td>
        <td>
          <button onClick={() => this.reject(i)}>Reject</button>
        </td>
      </tr>
    );
    this.setState({ showrequests: requesttable });
  }




}

accept=async(index)=>{
  const userobj = await new web3.eth.Contract(userAccount, this.state.deployedAddress);
  await userobj.methods.acceptrequest(index).send({from:this.state.userAdd,i:index});
window.location.reload();

}

reject=async(index)=>{
  const userobj = await new web3.eth.Contract(userAccount, this.state.deployedAddress);
  await userobj.methods.rejectrequest(index).send({from:this.state.userAdd,i:index});
window.location.reload();

}




searchuser=async(e)=>{
  e.preventDefault();
  const accounts=await web3.eth.getAccounts();
  const username=this.state.searchusername;
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
      flag=1;
      window.location.href="/profile/"+this.state.searchusername;
    }
  }
if(flag==0)
  alert("User does not exist");
}

render(){
    return (
      <div className="App">
        <div className="navbar-section">
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/dashboard">Navbar</Navbar.Brand>
            <Nav className="ml-auto">
              <Nav.Link href="/dashboard">Home</Nav.Link>
              <Nav.Link href="/project">Projects</Nav.Link>
              <Nav.Link href="/files">Files</Nav.Link>
            </Nav>
          </Navbar>
        </div>
        <div style={{ margin: "0% 16%" }}>
          <h3 className="my-5" style={{ float: "left" }}>
              Dashboard
          </h3>
        </div>
        <Form onSubmit={this.searchuser} style={{marginLeft:'30%',marginRight:'15%',marginTop:'7%'}}>
          <Form.Group>
            <Form.Control
              value={this.state.searchusername}
              onChange={event =>
                this.setState({ searchusername: event.target.value })
              }
            />
          </Form.Group>
          <Button className="btn-sm-round" style={{position:'relative',left:'34%'}} color="primary">
            Search User
          </Button>
        </Form>
        <div className="side-section">
          <Row style={{ margin: "7% 15%" }}>
            <Col lg="3">
              <ListGroup as="ul">
                <ListGroup.Item as="li">
                  <a
                    href="/create_project"
                    style={{ textDecoration: "none", float: "left" }}
                  >
                    Create New Project
                  </a>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <a
                    href="/sent_files"
                    style={{ textDecoration: "none", float: "left" }}
                  >
                    Sent Files
                  </a>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <a
                    href="/received_files"
                    style={{ textDecoration: "none", float: "left" }}
                  >
                    Received Files
                  </a>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <a
                    href="/project"
                    style={{ textDecoration: "none", float: "left" }}
                  >
                    My Projects
                  </a>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <a
                    href="/files"
                    style={{ textDecoration: "none", float: "left" }}
                  >
                    My Files
                  </a>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <a
                    href="/share_file"
                    style={{ textDecoration: "none", float: "left" }}
                  >
                    Share File
                  </a>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col lg="8">
              <ListGroup as="ul">
                <ListGroup.Item as="li">
                  <Row>
                    <Col lg="4">
                      <p className="font-weight-bold" style={{ float: "left" }}>
                        Name
                      </p>
                    </Col>
                    <Col lg="8">
                      <p>{this.state.name}</p>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <Row>
                    <Col lg="4">
                      <p className="font-weight-bold" style={{ float: "left" }}>
                        Username
                      </p>
                    </Col>
                    <Col lg="8">
                      <p>{this.state.username}</p>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <Row>
                    <Col lg="4">
                      <p className="font-weight-bold" style={{ float: "left" }}>
                        Account address
                      </p>
                    </Col>
                    <Col lg="8">
                      <p>{this.state.userAdd}</p>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <Row>
                    <Col lg="4">
                      <p className="font-weight-bold" style={{ float: "left" }}>
                        Contract Deployed Address
                      </p>
                    </Col>
                    <Col lg="8">
                      <p>{this.state.deployedAddress}</p>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
        <Row style={{ margin: "7% 17%" }}>
          <h5 className="text-lead">All project requests</h5>
          <Table bordered stripped hover responsive>
            {this.state.showrequests}
          </Table>
        </Row>

      </div>
    );
  }
}
