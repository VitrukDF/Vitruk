import React, {Component} from 'react';

class GameCell extends Component{
    constructor(props){
        super(props);
        this.clickHandle=this.clickHandle.bind(this);
    }
    
    clickHandle(e){
        e.preventDefault();
        this.props.stateChanger(this.props.index);
    }

    render(){
        let customColumn;
        console.log("gameView",this.props.gameView)
        if (!this.props.gameView){
            customColumn="customColumnMuted";
        }
        else {
            customColumn="customColumn";
        }

        return(
            <div className={customColumn} onClick={this.clickHandle} >
                <img src={this.props.sign} className="gameCell img-fluid" alt=""/>
            </div>
        );
    }
}

export default GameCell;



                {/* <svg width="200" height="200" version="1.1" xmlns="http://www.w3.org/2000/svg">
                     <path d="M10 10 L190 190 M190 10 L 10 190" stroke="#bbbbbb" fill="transparent" stroke-width="15" />
                </svg> */}