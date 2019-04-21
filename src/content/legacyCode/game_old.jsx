import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import PlayersNames from './playersNames';
import GameField from './gameField';
import Clock from '../clock/clock';
// import cross from '../../../svg/cross.svg';
// import nought from '../../../svg/nought.svg';
// import noughtMuted from '../../../svg/noughtMuted.svg';

class Game extends Component{
    constructor(props){
        super(props);
        
        this.state={ 
            gamePhase: 0,//create
            startTime: 0,//this.props.startTime,
            gameView: true,//false-wiewer||true-player
            playerTurn: true,//true-player1||false-player2
            numberToWin: 3,
            lastPosition: [0,0],
            gameField: [[null],[null]],
            player1:{
                name: this.props.userName,
                sign: 0,//cross,
                winner:false,
            },
            player2:{
                name:"Player 2",
                sign: 0,//nought,
                signMuted: 0,//noughtMuted,
                winner:false,
            }
        };
        this.buttonClick=this.buttonClick.bind(this);
        this.stateChanger=this.stateChanger.bind(this);
        this.checkGameState=this.checkGameState.bind(this);
        this.getData=this.getData.bind(this);
    }

    stateChanger([indexRow,indexColumn]){
        console.log("[iRow,iCol],Turn:",[indexRow,indexColumn],this.state.playerTurn)
        if(this.state.gameField[indexRow][indexColumn]==null){
            this.setState(state=>{
                const newGameField=state.gameField.map((item,index)=>{
                    if (index===indexRow){
                        return (
                            item.map((item,index)=>{
                                if (index===indexColumn){
                                    return item=state.playerTurn;
                                }
                                else return item;
                            })
                        );
                    }
                    else return item;
                });
                // console.log(newGameField);

                let rewriteGame={
                    gamePhase: state.gamePhase,//create
                    startTime: state.startTime,
                    lastActivity: Date.now(),
                    gameView: state.gameView,
                    playerTurn: state.playerTurn,
                    numberToWin: state.numberToWin,
                    lastPosition: [indexRow,indexColumn],
                    gameField: newGameField,
                    player1:{
                        name: state.player1.name,
                        sign: state.player1.cross,
                        winner: state.player1.winner,
                    },
                    player2:{
                        name: state.player2.name,
                        sign: state.player2.sign,
                        signMuted: state.player2.signMuted,
                        winner: state.player2.winner,
                    }
                }
                let serialRewriteGame=JSON.stringify(rewriteGame);
                localStorage.setItem(this.props.match.params.id,serialRewriteGame);
                // localStorage.setItem(this.props.index,serialRewriteGame);
                
                return {
                    gameField: newGameField,
                    playerTurn: state.playerTurn,
                    lastPosition: [indexRow,indexColumn],
                };
            }); 
        }
    }



    componentDidUpdate(){
        if (this.checkGameState()){
            alert("WINNER "+(()=>{if (this.state.playerTurn)return this.state.player1.name; else return this.state.player2.name})());
        }  
    }

    checkGameState(){
        console.log("lastPosition: ",this.state.lastPosition)
        const startingPoint=this.state.lastPosition;
        const numberToWin=this.state.numberToWin;
        const range=numberToWin-1;
        const gameField=this.state.gameField;
        const playerTurn=this.state.playerTurn;

        let horizontalSeries=0;
        for(let xAxis=startingPoint[1]-range; xAxis<=startingPoint[1]+range; xAxis++){
            if (xAxis>=0 && xAxis<gameField[startingPoint[0]].length){
                console.log("xAxis:",xAxis,gameField[startingPoint[0]][xAxis],playerTurn);
                if (gameField[startingPoint[0]][xAxis]==playerTurn){
                    horizontalSeries++;
                    if (horizontalSeries==numberToWin) return true;
                }
                else {
                    horizontalSeries=0;
                }
            }
        }
        
        let verticalSeries=0;
        for(let yAxis=startingPoint[0]-range; yAxis<=startingPoint[0]+range; yAxis++){
            if (yAxis>=0 && yAxis<gameField.length){
                console.log("yAxis:",yAxis,gameField[yAxis][startingPoint[1]],playerTurn);
                if (gameField[yAxis][startingPoint[1]]==playerTurn){
                    verticalSeries++;
                    if (verticalSeries==numberToWin) return true;
                }
                else {
                    verticalSeries=0;
                }
            }
        }

        let diagonalSeries=0;
        for(let yAxis=startingPoint[0]-range, xAxis=startingPoint[1]-range; yAxis<=startingPoint[0]+range, xAxis<=startingPoint[1]+range; yAxis++, xAxis++){
            if (yAxis>=0 && yAxis<gameField.length && xAxis>=0 && xAxis<gameField[startingPoint[0]].length){
                console.log("yAxis!:",yAxis,gameField[yAxis][xAxis],playerTurn);
                if (gameField[yAxis][xAxis]==playerTurn){
                    diagonalSeries++;
                    if (diagonalSeries==numberToWin) return true;
                }
                else {
                    diagonalSeries=0;
                }
            }
        }
        
        let backDiagonalSeries=0;
        for(let yAxis=startingPoint[0]+range, xAxis=startingPoint[1]-range; yAxis>=startingPoint[0]-range, xAxis<=startingPoint[1]+range; yAxis--, xAxis++){
            if (yAxis>=0 && yAxis<gameField.length && xAxis>=0 && xAxis<gameField[startingPoint[0]].length){
                console.log("!yAxis!:",yAxis,gameField[yAxis][xAxis],playerTurn);
                if (gameField[yAxis][xAxis]==playerTurn){
                    backDiagonalSeries++;
                    if (backDiagonalSeries==numberToWin) return true;
                }
                else {
                    backDiagonalSeries=0;
                }
            }
        }
    }

    buttonClick(e){
        e.preventDefault();
        alert("surrender")
        this.props.history.push("/");
    }

    getData(){
        // if(localStorage.length!==0){
            console.log("this.props.index: ",this.props.match.params.id)
            // console.log("this.props.index: ",this.props.index)
            let item=JSON.parse(localStorage.getItem(this.props.match.params.id));
            // let item=JSON.parse(localStorage.getItem(this.props.index));
            console.log("item: ",item)
            this.setState({
                gamePhase: item.gamePhase,//create
                startTime: item.startTime,
                gameView: item.gameView,//false-wiewer||true-player
                playerTurn: item.playerTurn,//true-player1||false-player2
                numberToWin: item.numberToWin,
                lastPosition: item.lastPosition,
                gameField: item.gameField,
                player1:{
                    name: item.player1.name,
                    sign: item.player1.sign,
                    winner: item.player1.winner,
                },
                player2:{
                    name: item.player2.name,
                    sign: item.player2.sign,
                    signMuted: item.player2.signMuted,
                    winner: item.player2.winner,
                },
            });
        // }
    }

    componentDidMount(){
        this.getData();
    }

    render(){
        console.log("this.props.match.params.id",this.props.match.params.id)
        console.log("this.state: ",this.state)
        let textMuted;
        let signPlayer2;
        if (!this.state.gameView){
            textMuted="text-muted";
            signPlayer2=this.state.player2.signMuted;
        }
        else{
            textMuted="";
            signPlayer2=this.state.player2.sign;
        }
        return(
            // <div className="flex-grow-1 d-flex flex-column px-fixed py-4">
            <React.Fragment>
                <div className={textMuted}>
                <PlayersNames player1={this.state.player1} player2={this.state.player2} playerTurn={this.state.playerTurn} gameView={this.state.gameView} signPlayer2={signPlayer2}/>
                </div>
                <GameField playerTurn={this.state.playerTurn} stateChanger={this.stateChanger} gameField={this.state.gameField} lastPosition={this.state.lastPosition} gameView={this.state.gameView} player1={this.state.player1} player2={this.state.player2} signPlayer2={signPlayer2}/>
                <div className={"mx-auto my-4 h2 "+textMuted}>
                    <Clock startTime={this.state.startTime} />
                </div>
                <button className="flex-shrink-0 mx-auto btn btn-buttonColor" style={{width:"10rem"}} onClick={this.buttonClick}>SURRENDER</button>
            </React.Fragment>
            // </div>
        ); 
    }
}

export default withRouter(Game);