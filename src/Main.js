import './App.css';
import { Component } from "react";
import Toolbar from "./toolbar";
import Canvas from "./canvas";
import React from 'react';
import { Stack } from '@mui/system';
import { styled } from '@mui/material';

const Container = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  height: "90vh",

  justifyContent: "space-between",
  textAlign: "flex-start",
  alignItems: "flex-start",

  gap: "0px",
  padding: "20px"
}))

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { imageURL: '', defaultBboxs: [], stageRef: null, manualBbox: [] };
  }
  toolCallback = (childData) => {
    //console.log(childData);
    this.setState(childData);
  }
  render() {
    return (
      <Container>
        <Canvas toolCallback={this.toolCallback} imageURL={this.state.imageURL} defaultBboxs={this.state.defaultBboxs}
          manualBbox={this.state.manualBbox}>
        </Canvas>
        <Toolbar toolCallback={this.toolCallback} stageRef={this.state.stageRef} />
      </Container>
    );
  }
}

export default Main;
