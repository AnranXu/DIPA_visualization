import { Component } from "react";
import { Stage, Layer, Rect} from 'react-konva';
import URLImage from './urlImage.js';

class Canvas extends Component{
    constructor(props)
    {
        super(props);
        this.stageRef = React.createRef();
        this.imageRef = React.createRef();
    }
    render(){
        return(
            <div>
                <Stage width={window.innerWidth} height={window.innerHeight} ref={this.stageRef}>
                    <Layer>
                        <URLImage src={this.props.imageURL} setRef={this.imageRef}></URLImage>
                    </Layer>
                </Stage>
            </div>
        );
    }
}
export default Canvas;