import { Component } from "react";
import { Stage, Layer, Rect } from "react-konva";
import URLImage from "./urlImage.js";
import React from "react";
import { Box, styled } from "@mui/material";

const Container = styled(Box)(() => ({
    left: "0px",
    // padding: "0 20px",
    backgroundColor: "rgba(100, 100, 100, 0.2)",
}));

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.stageRef = React.createRef();
        this.imageRef = React.createRef();
        this.bboxStrokeWidth = 5;
    }
    componentDidMount() {
        this.sendStage();
    }
    createDefaultBboxs = () => {
        //console.log(this.props.bboxs);
        return this.props.defaultBboxs.map((bbox, i) => (
            <Rect
                x={parseInt(bbox["bbox"][0])}
                y={parseInt(bbox["bbox"][1])}
                width={parseInt(bbox["bbox"][2])}
                height={parseInt(bbox["bbox"][3])}
                fill={"rgba(255,255,255,0)"}
                draggable={false}
                shadowBlur={0}
                stroke={"black"}
                strokeWidth={this.bboxStrokeWidth}
                id={"bbox" + String(i) + "-" + String(bbox["category"])}
                key={"bbox" + String(i) + "-" + String(bbox["category"])}
                name={"bbox"}
            />
        ));
    };
    sendStage = () => {
        this.props.toolCallback({ stageRef: this.stageRef });
    };
    render() {
        return (
            <Container id="canvasContainer">
                <Stage
                    width={window.innerWidth * 0.55 - 60}
                    height={window.innerHeight * 0.7}
                    ref={this.stageRef}
                >
                    <Layer>
                        <URLImage
                            src={this.props.imageURL}
                            setRef={this.imageRef}
                        />
                        {this.props.defaultBboxs.length ? (
                            this.createDefaultBboxs()
                        ) : (
                            <Rect />
                        )}
                    </Layer>
                </Stage>
            </Container>
        );
    }
}
export default Canvas;
