import './App.css';
import { Component } from "react";
import Toolbar from "./toolbar";
import Canvas from "./canvas";
import React from 'react';
class App extends Component{
  constructor(props)
  {
    super(props);
    this.state = {imageURL: '', defaultBboxs: [], stageRef: null, manualBbox: []};
  }
  toolCallback = (childData) =>{
    //console.log(childData);
    this.setState(childData);
  }
  render (){
    return (
      <div>
        <Toolbar toolCallback={this.toolCallback} stageRef={this.state.stageRef}>
        </Toolbar>
        <Canvas toolCallback={this.toolCallback} imageURL = {this.state.imageURL} defaultBboxs = {this.state.defaultBboxs}
        manualBbox = {this.state.manualBbox}>
        </Canvas>
      </div>
    );
  }
}

export default App;
