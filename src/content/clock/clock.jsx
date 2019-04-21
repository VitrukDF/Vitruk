import React, {Component} from 'react';

class Clock extends Component{
    constructor(props){
        super(props);
        this.state={
            elapsedTime: 0
        };
    }

    componentDidUpdate(prevProps){
        if (prevProps.startTime!==this.props.startTime)
        this.tick();
    }

    componentDidMount(){
        this.timerId=setInterval(
            ()=>this.tick(),
            1000
        );
        this.tick();
    }

    componentWillUnmount(){
        clearInterval(this.timerId);
    }

    tick(){
        let timePlayed=Date.now()-this.props.startTime+1000;
        this.setState(()=>({
            elapsedTime: timePlayed,
        }));
    }

    render(){
        let date=new Date(this.state.elapsedTime-(3*60*60*1000));
        let time=date.toLocaleTimeString();
        
        return(<React.Fragment>{time}</React.Fragment>);
    }
}

export default Clock;