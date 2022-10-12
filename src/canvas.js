import { Component } from "react";
import { Stage, Layer, Rect} from 'react-konva';
import URLImage from './urlImage.js';
import React from "react";

class Canvas extends Component{
    constructor(props)
    {
        super(props);
        this.stageRef = React.createRef();
        this.imageRef = React.createRef();
    }
    componentDidMount(){
        this.sendStage();
    }
    createDefaultBboxs = () => {
        //console.log(this.props.bboxs);
        return this.props.defaultBboxs.map((bbox, i)=>(
            <Rect
            x={parseInt(bbox['bbox'][0])}
            y={parseInt(bbox['bbox'][1])}
            width={parseInt(bbox['bbox'][2])}
            height={parseInt(bbox['bbox'][3])}
            fill= {"rgba(255,255,255,0)"}
            draggable= {false}
            shadowBlur={0}
            stroke = {'black'}
            strokeWidth={this.bboxStrokeWidth}
            id={'bbox' + String(i) + '-' + String(bbox['category'])}
            key={'bbox' + String(i) + '-' + String(bbox['category'])}
            name={'bbox'}
            />
        ));
    }
    sendStage = () =>{
        this.props.toolCallback({stageRef: this.stageRef});
    }
    render(){
        return(
            <div>
                <Stage width={window.innerWidth} height={window.innerHeight} ref={this.stageRef}>
                    <Layer>
                        <URLImage src={this.props.imageURL} setRef={this.imageRef}></URLImage>
                        {this.props.defaultBboxs.length? this.createDefaultBboxs()
                        : 
                        <Rect></Rect>
                        }
                    </Layer>
                </Stage>
            </div>
        );
    }
}
export default Canvas;