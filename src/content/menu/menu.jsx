import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import Database from '../../service/database';
import GameCard from './gameCard';
import pluss from '../../svg/pluss.svg'

class Menu extends Component{
    constructor(props){
        super(props);
        this.state={
            games:[],
        }
        this.callCreateGame=this.callCreateGame.bind(this);
        this.handleClick=this.handleClick.bind(this);
        this.getData=this.getData.bind(this);
        this.userNameInputChange=this.userNameInputChange.bind(this);
    }

    handleClick(index){
        // this.props.stateChanger({screenId: 2,selectGame: index});
        this.props.history.push("/game/"+index);
    }

    callCreateGame(e){
        e.preventDefault();
        this.props.history.push("/createGame");
    }

    getData(){
      let games=Database.get("games");
      this.setState(state=>{
        if(games===null){
          if(state.games.length!==0){
            return {games:[]};
          }
        }
        else {
          for (let i=0;i<games.length;i++){
            if (games[i].lastActivity+this.props.standbyTime<Date.now()){
              games.splice(i,1,"deleted");
              Database.set("games",games);
            }
            if(games[i]==="deleted"){
              if(state.games[i]!=games[i]){
                return {games:games};
              }
            }
            else{
              if (
                state.games.length!=games.length||
                state.games[i].gamePhase!=games[i].gamePhase||
                state.games[i].winner!=games[i].winner||
                state.games[i].player1!=games[i].player1||
                state.games[i].player2!=games[i].player2
              ){
                return {games:games};
              }
            }
          } 
        }
      });
    }
    
    userNameInputChange(e){
      this.props.stateChanger({userName: e.target.value});
    }
    
    componentDidMount(){
        this.timerId=setInterval(
          ()=>this.getData(),
          1000
        );
        this.getData();
    }
  
    componentWillUnmount(){
      clearInterval(this.timerId);
    }

    render(){
      console.log("!!render this.state.games:",this.state.games)
        return(
            <React.Fragment>
                <div>
                    <input className="pb-2 flex-shrink-0 border-bottom d-flex form-control-plaintext" style={{width:"70%"}} name="userNameInput" value={this.props.userName} onChange={this.userNameInputChange} maxLength="20" />
                    {/* <span className="pb-2 flex-shrink-0 border-bottom d-flex" style={{width:"70%"}} >{this.props.userName}</span> */}
                </div>
                <div className="d-flex flex-wrap flex-grow-0 borde borde-3 flex-shrink-1 my-4 overflow-auto gameCardList">
                    {this.state.games.map((item,index)=>{
                        if(this.state.games[index]!=="deleted"){
                            return (
                                <div key={index} onClick={()=>{this.handleClick(index)}} style={{cursor: "pointer"}}>
                                    <GameCard game={this.state.games[index]} />
                                </div>
                            );
                        }
                    })}
                </div>

                <button className="flex-shrink-0 mt-auto ml-auto btn btn-buttonColor shadow rounded-circle" style={{width:"50px", height:"50px"}} onClick={this.callCreateGame}>
                    <img src={pluss} className="img-fluid" alt=""/>
                </button>
            </React.Fragment>
        ); 
    }
}

export default withRouter(Menu);