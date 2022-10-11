import logo from './logo.svg';
import './App.css';
import { Component } from "react";
import Toolbar from "./toolbar";
import Canvas from "./canvas";
import React from 'react';
class App extends Component{
  constructor(props)
  {
    super(props);
  }
  toolCallback = (childData) =>{
    console.log(childData);
    this.setState(childData);
  }
  render (){
    return (
      <div>
        <Toolbar toolCallback={this.toolCallback}>
        </Toolbar>
        <Canvas toolCallback={this.toolCallback}>

        </Canvas>
      </div>
    );
  }
}

export default App;
