import { Component } from "react";
import React from "react";

class Toolbar extends Component{
    constructor(props)
    {
        super(props);
        this.imgAnnotationMap = {};
        this.bucketRoot = 'https://iui-privacy-dataset.s3.ap-northeast-1.amazonaws.com/';
        this.state = {currentImage: '', defaultBboxs: [], manualBbox: [], validList: [], 
        validAnns: {}, annotatorList: {'CrowdWorks': [], 'Prolific': []}, reasonValue: 0,
        informativenessValue: 0, sharingValue: 0};
        this.imgAnnotationMapLink = this.bucketRoot + 'img_annotation_map.json';
        fetch(this.imgAnnotationMapLink).then((res) => res.text()).then( (text) =>{
            text = text.replaceAll("\'", "\"");
            this.imgAnnotationMap = JSON.parse(text);
            this.keys = Object.keys(this.imgAnnotationMap)
            this.currentImageIndex = -1;
            this.listLen = this.keys.length;
        });
        this.reason = ['','It tells personal identity.', 'It tells location of shooting.',
        'It tells personal habits.', 'It tells social circle.', 'Other things it can tell'];
        this.sharing = ['','I won\'t share it', 'Family or friend',
        'Public', 'Broadcast programme', 'Other recipients'];
        this.intensity = ['', 'extremely uninformative',
            'moderately uninformative',
            'slightly uninformative',
            'neutral',
            'slightly informative',
            'moderately informative',
            'extremely informative'];
    }
    componentDidUpdate(prevProps, prevState) {
        if(prevState.currentImage !== this.state.currentImage)
        {
            //fetch default label
            var prefix = 'https://iui-privacy-dataset.s3.ap-northeast-1.amazonaws.com/';
            var image_URL = prefix + 'all_img/'+ this.state.currentImage + '.jpg';
            var label_URL = prefix + 'all_label/'+ this.state.currentImage + '_label';
            var ori_bboxs = [];
            var label_list = {};
            fetch(label_URL).then( (res) => res.text() ) //read new label as text
            .then( (text) => {
                var ori_anns = text.split('\n'); // split it as each row has one annotation
                for(var i = 0; i < ori_anns.length; i++)
                {
                    var json = ori_anns[i].replaceAll("\'", "\"");
                    var cur_ann = JSON.parse(json); // parse each row as json file
                    this.cur_source = cur_ann['source'];
                    ori_bboxs.push({'bbox': cur_ann['bbox'], 'category': cur_ann['category'], 
                    'width': cur_ann['width'], 'height': cur_ann['height']}); //get bbox (x, y, w, h), width, height of the image (for unknown reasons, the scale of bboxs and real image sometimes are not identical), and category
                    //create list of category, we just need to know that this image contain those categories.
                    label_list[cur_ann['category']] = 1;
                }

                this.setState({defaultBboxs: ori_bboxs, validList: [], reasonValue: 0, informativenessValue: 0, sharingValue: 0});

            }).then(() => {this.props.toolCallback({imageURL: image_URL})})
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }
    createDefaultValidList = ()=>{
        //generate a list of valid bbox info to canvas.js
        return this.state.validList.map((label,i)=>(
            <div key={'defaultLabelList-' + label}>
                
                <button style={{color: 'black'}}onClick={this.showPrivacyInfo} id={'defaultLabelButton-' + label} 
                key={'defaultLabelButton-' + label}>{label}</button>

            </div>
        ));
    }
    showPrivacyInfo = (e)=>{
        var category = e.target.id.split('-')[1];
        for(var i = 0; i < this.state.validList.length; i++)
        {   
            var label = this.state.validList[i];
            var defaultLabelButton = document.getElementById('defaultLabelButton-' + label);
            if(e.target.id === 'defaultLabelButton-' + label)
            {
                if(e.target.style.color == 'black')
                {
                    e.target.style.color = 'red';
                    console.log(this.state.validAnns[category]);
                    var reasonValue = this.state.validAnns[category]['reason'];
                    var informativenessValue = this.state.validAnns[category]['importance'];
                    var sharingValue = this.state.validAnns[category]['sharing'];
                    this.setState({reasonValue: reasonValue, informativenessValue: informativenessValue, sharingValue: sharingValue});
                }
                else
                {
                    e.target.style.color = 'black';
                    this.setState({reasonValue: 0, informativeValue: 0, sharingValue: 0});
                }
            }
            else{
                defaultLabelButton.style.color = 'black';
            }

        }
        if(this.props.stageRef){
            //find all bounding boxes
            var bboxs = this.props.stageRef.current.find('.bbox');
            for(var i = 0; i < bboxs.length; i++)
            {
                //highlight qualified bounding boxes (not finished)
                if(bboxs[i].attrs['id'].split('-')[1] === category)
                {
                    if(bboxs[i].attrs['stroke'] === 'black')
                        bboxs[i].attrs['stroke'] = 'red';
                    else
                        bboxs[i].attrs['stroke'] = 'black';
                }
                else{
                    bboxs[i].attrs['stroke'] = 'black';
                }
            }
            this.props.stageRef.current.getLayers()[0].batchDraw();
        }
    }
    moveToNext = ()=>{
        this.currentImageIndex = (this.currentImageIndex + 1) % this.listLen;
        this.setState({currentImage: this.keys[this.currentImageIndex], 
            annotatorList: this.imgAnnotationMap[this.keys[this.currentImageIndex]]});
    }
    generateAnnotatorList = ()=>{
        var optionNum = 0;
        return Object.keys(this.state.annotatorList).map((platfrom, i)=>{
            return this.state.annotatorList[platfrom].map((annotation,i) => {
                optionNum += 1
                return(
                    <option value={platfrom + '-' + annotation} >Annotator {optionNum}</option>
                )
            });
        });
    }
    loadPrivacyAnns = (e)=>{
        var prefix = 'https://iui-privacy-dataset.s3.ap-northeast-1.amazonaws.com/';
        var platform = document.getElementById('annotator').value.split('-')[0];
        var selectFile = document.getElementById('annotator').value.split('-')[1];
        console.log(platform, selectFile);
        var annotationURL = prefix + platform + '/crowdscouringlabel/' + selectFile;
        var validList = []
        fetch(annotationURL).then( (res) => res.text() ) //read new label as text
            .then( (text) => {
                var json = text.replaceAll("\'", "\"");
                var ann = JSON.parse(json); // parse each row as json file
                var defaultAnn= ann['defaultAnnotation'];
                var validAnns = {};
                var keys = Object.keys(defaultAnn);
                for(var i = 0; i < keys.length; i++)
                {
                    if (!defaultAnn[keys[i]]['ifNoPrivacy'])
                    {
                        validList.push(keys[i]);
                        validAnns[keys[i]] = defaultAnn[keys[i]];
                    }    
                }
                this.setState({validList: validList, validAnns: validAnns});
                var validBbox = []
                for(var i = 0; i < this.state.defaultBboxs.length; i++)
                {
                    if(validList.includes(this.state.defaultBboxs[i]['category']))
                        validBbox.push(this.state.defaultBboxs[i]);
                }
                this.props.toolCallback({defaultBboxs: validBbox});
            }).then(() => {})
            .catch((error) => {
                console.error('Error:', error);
        });
    }
    render(){
        return(
            <div>
                <button onClick={this.moveToNext}>Next Image</button>
                <select id="annotator">
                {
                    this.state.annotatorList['CrowdWorks'].length || this.state.annotatorList['Prolific'].length?
                    this.generateAnnotatorList()
                    :
                    <option>None Annotator Yet</option>
                }
                </select>
                <button onClick={this.loadPrivacyAnns}>
                    Load selected Annotation
                </button>
                {
                        this.state.validList.length? 
                        <div>
                            <div>Privacy-threatening Content</div>
                            <div><strong>Reason: </strong></div> <span> {this.reason[this.state.reasonValue]}</span>
                            <div><strong>Informativeness:</strong> </div> <span>{this.intensity[this.state.informativenessValue]}</span>
                            <div><strong>Sharing</strong></div> <span>{this.sharing[this.state.sharingValue]}</span>
                            {this.createDefaultValidList()}
                        </div>
                        :
                        <div>This Annotator did not annotate any privacy-threatening content in this image.</div>
                }
            </div>
        );
    }
}
export default Toolbar;