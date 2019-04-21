import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
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
    }

    handleClick(index){
        console.log("a",index)
        // this.props.stateChanger({screenId: 2,selectGame: index});
        this.props.history.push("/game/"+index);
    }

    callCreateGame(e){
        e.preventDefault();
        this.props.history.push("/createGame");
    }

    getData(){
      console.log("localStorage.length",localStorage.length)
        if (localStorage.length===0){
          if (this.state.games.length!==0){
            this.setState({games:[]})
          }
        }
        else if(localStorage.length!==0){
          let newGames=[];
          for (let i=0;i<localStorage.length;i++){   
            let item=JSON.parse(localStorage.getItem(i));
            console.log("item before: ",item )
            console.log("item key before: ",[item] )
            //=====================================================
            if (item.gamePhase===undefined){
              // ||item.gamePhase===null){
              console.log("LS check undefined[",i,"]")
              newGames.push(undefined);
            }
            //------------------------------------------------------
            else{
              let obj={
                gamePhase:item.gamePhase,
                startTime: item.startTime,
                lastActivity: item.lastActivity,
                player1:{
                  name:item.player1.name,
                  winner:item.player1.winner,
                },
                player2:{
                  name:item.player2.name,
                  winner:item.player2.winner,
                },
              };
    
              if (item.lastActivity+this.props.standbyTime>Date.now()){
                console.log("add",i)
                newGames.push(obj);
              }
              else {
                newGames.push(undefined);
                // localStorage.removeItem(i);
                localStorage.setItem(i,JSON.stringify({}))
                console.log("clear",i)
              }
            }
            //=====================================================
          }
          this.setState((state)=>{
            console.log("state.games",state.games,"newGames",newGames)
            for (let i=0;i<localStorage.length;i++){
              if (state.games[i]!=newGames[i])console.log("state.games[",i,"]!=newGames[",i,"]пока обьект полюбому не равны")
              if(newGames[i]===undefined){
                if(state.games[i]!==newGames[i]){
                  console.log("зашел")
                  return{
                    games: newGames,
                  }
                }
              }
              else{
                if (
                  state.games.length!=newGames.length||
                  state.games[i].gamePhase!=newGames[i].gamePhase||
                  state.games[i].player1.name!=newGames[i].player1.name||
                  state.games[i].player1.winner!=newGames[i].player1.winner||
                  state.games[i].player2.name!=newGames[i].player2.name||
                  state.games[i].player2.winner!=newGames[i].player2.winner){
                    console.log("i=",i)
                    return{
                      games: newGames,
                    }
                  }
                }
              }
          });
        }
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
        return(
            <React.Fragment>
                <div>
                    <span className="pb-2 flex-shrink-0 border-bottom d-flex" style={{width:"70%"}}>{this.props.userName}</span>
                </div>
                <div className="d-flex flex-wrap flex-grow-0 borde borde-3 flex-shrink-1 my-4 overflow-auto gameCardList">
                    {this.state.games.map((item,index)=>{
                        console.log("item[",index,"]",item)
                        if(this.state.games[index]!==undefined){
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