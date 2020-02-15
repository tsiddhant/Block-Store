
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import register from './components/register';
import dashboard from './components/dashboard';
import create_project from './components/create_project';
import files from './components/files';
import sent_files from './components/sent_files';
import received_files from './components/received_files';
import project from './components/project';
import project_files from './components/project_files';
import share_file from './components/share_file';
import profile from './components/profile';
import test from './components/test';
import home from './components/home';






//import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import main from './main';
var forge=require('node-forge');




// import About from './components/About';
// import Contact from './components/Contact';
// import Error from './components/Error';
// import Navigation from './components/Navigation';

export default class App extends Component{


render(){
  return (
    <BrowserRouter>
      <div>
          <Switch>
           <Route path="/" component={register} exact/>
           <Route path="/dashboard" component={dashboard} exact/>
           <Route path="/create_project" component={create_project} exact/>
           <Route path="/files" component={files} exact/>
           <Route path="/sent_files" component={sent_files} exact/>
           <Route path="/received_files" component={received_files} exact/>
           <Route path="/project" component={project} exact/>
           <Route path="/share_file" component={share_file} exact/>
           <Route path="/project/:projectaddr" component={project_files} exact/>
           <Route path="/profile/:username" component={profile} exact/>
           <Route path="/test" component={test} exact/>
           <Route path="/home" component={home} exact/>




         </Switch>
      </div>
    </BrowserRouter>

        )
      }
}
