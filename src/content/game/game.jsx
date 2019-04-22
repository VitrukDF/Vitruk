import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import PlayersNames from './playersNames';
import Clock from '../clock/clock';
import Database from '../../service/database';
import cross from '../../svg/cross.svg';
import nought from '../../svg/nought.svg';
import noughtMuted from '../../svg/noughtMuted.svg';

class Game extends Component{
    constructor(props){
        super(props);
        this.state={};
        this.surrenderClick=this.surrenderClick.bind(this);
        this.menuClick=this.menuClick.bind(this);
        this.checkGameState=this.checkGameState.bind(this);
        this.clickGameCell=this.clickGameCell.bind(this);
        this.getData=this.getData.bind(this);
        this.isOdd=this.isOdd.bind(this);
        this.endGame=this.endGame.bind(this);
    }

    isOdd(n){
        return !!(n%2);
    }

    clickGameCell([indexRow,indexColumn]){
        let playerTurn=!this.isOdd(this.state.game.strokeCounter)?this.state.game.player1:this.state.game.player2;
        if(this.state.game.gameField[indexRow][indexColumn]===null&&
            this.state.game.winner===0&&
            this.props.userName===playerTurn
        ){
            this.setState(state=>{
                const newGameField=state.game.gameField.map((item,index)=>{
                    if (index===indexRow){
                        return (
                            item.map((item,index)=>{
                                if (index===indexColumn){
                                    return item=this.isOdd(state.game.strokeCounter+1);
                                }
                                else return item;
                            })
                        );
                    }
                    else return item;
                });

                let rewriteGame=Object.assign({},state.game);
                rewriteGame.lastActivity=Date.now();
                rewriteGame.strokeCounter=state.game.strokeCounter+1;
                rewriteGame.lastPosition=[indexRow,indexColumn];
                rewriteGame.gameField=newGameField;
                let games=Database.get("games");
                games.splice(this.props.match.params.id,1,rewriteGame);
                Database.set("games",games);                
                return {
                    game: rewriteGame,
                };
            }); 
        }
    }

    componentDidUpdate(){
        if (this.state.game!==undefined&&this.state.game!=="deleted"){
            if (this.state.game.winner===0){
                if (this.checkGameState()){
                    let winner=this.isOdd(this.state.game.strokeCounter)?1:2;
                    this.setState({game: this.endGame(winner)})
                }else if(this.state.game.cellNumber===this.state.game.strokeCounter){
                    let drawGame=5;
                    this.setState({game:this.endGame(drawGame)})
                }
            }
        }
    }

    checkGameState(){
        const startingPoint=this.state.game.lastPosition;
        const numberToWin=this.state.game.numberToWin;
        const range=numberToWin-1;
        const gameField=this.state.game.gameField;
        const strokeCounter=this.state.game.strokeCounter;

        let horizontalSeries=0;
        for(let xAxis=startingPoint[1]-range; xAxis<=startingPoint[1]+range; xAxis++){
            if (xAxis>=0 && xAxis<gameField[startingPoint[0]].length){
                if (gameField[startingPoint[0]][xAxis]==this.isOdd(strokeCounter)){
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
                if (gameField[yAxis][startingPoint[1]]==this.isOdd(strokeCounter)){
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
                if (gameField[yAxis][xAxis]==this.isOdd(strokeCounter)){
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
                if (gameField[yAxis][xAxis]==this.isOdd(strokeCounter)){
                    backDiagonalSeries++;
                    if (backDiagonalSeries==numberToWin) return true;
                }
                else {
                    backDiagonalSeries=0;
                }
            }
        }
    }

    surrenderClick(e){
        e.preventDefault();
        if (this.state.game.winner===0){
            let winner=(()=>{
                if (this.props.userName==this.state.game.player1){return 3;}
                else if (this.props.userName==this.state.game.player2){return 4;}
            })();
            this.setState({game: this.endGame(winner)})
            this.props.history.push("/");
        }
    }

    menuClick(e){
        e.preventDefault();
        this.props.history.push("/");
    }

    endGame(gameStatus){
        let rewriteGame=Object.assign({},this.state.game);
        rewriteGame.lastActivity=Date.now();
        rewriteGame.strokeCounter=this.state.game.strokeCounter-1;
        rewriteGame.winner=gameStatus;
        let games=Database.get("games");
        games.splice(this.props.match.params.id,1,rewriteGame);
        Database.set("games",games); 
        return rewriteGame;
    }

    getData(){
        let games=Database.get("games");
        if (games===null){
            this.props.history.push("/");
        }
        else{
            let game=games[this.props.match.params.id];
            this.setState(state=>{
                if(game==="deleted"){
                    if(state.game!=="deleted"){
                        return {game:"deleted"}
                    }
                }
                else{
                    if(game.player2===undefined&&game.player1!==this.props.userName){
                        game.player2=this.props.userName;
                        let games=Database.get("games");
                        games.splice(this.props.match.params.id,1,game);
                        Database.set("games",games);
                        return {game:game};
                    }
                    else if(
                        state.game===undefined||
                        state.game.player2!=game.player2||
                        state.game.startTime!=game.startTime||
                        state.game.gamePhase!=game.gamePhase||
                        state.game.gameVieW!=game.gameVieW||
                        state.game.strokeCounter!=game.strokeCounter||
                        state.game.winner!=game.winner
                    ){
                        return {game:game};
                    }
                }
            })
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
    if(this.state.game==="deleted"){
        return (
            <div>
                {(()=>{
                    alert("истекло время жизни");
                    this.props.history.push("/");
                })()}
            </div>
            );
    }
    else if (this.state.game!==undefined){

            let textDisplay="";
            let signPlayer2=nought;
            let customColumn="customColumn";
            let buttonName="SURRENDER";
            let buttonHandle=this.surrenderClick;
            if(this.state.game.player2===undefined||this.state.game.winner!==0){
                buttonName="BACK";
                buttonHandle=this.menuClick;
            }
            if (this.props.userName!==this.state.game.player1&&this.props.userName!==this.state.game.player2){
                textDisplay="text-muted";
                signPlayer2=noughtMuted;
                customColumn="customColumnMuted";
                buttonName="BACK";
                buttonHandle=this.menuClick;
            }

            let date=new Date(this.state.game.lastActivity-this.state.game.startTime-(3*60*60*1000));
            let clock=date.toLocaleTimeString();
            let endGameText="";
            switch(this.state.game.winner){
                case 1:
                    endGameText="Winner "+this.state.game.player1;
                    break;
                case 2:
                    endGameText="Winner "+this.state.game.player2;
                    break;
                case 3:
                    endGameText="Surrender "+this.state.game.player1;
                    break;
                case 4:
                    endGameText="Surrender "+this.state.game.player2;
                    break;
                case 5:
                    endGameText="Draw Game";
                    break;
                default:
                    clock=<Clock startTime={this.state.game.startTime} />
            }

            
            let gameCellHeight=40/this.state.game.gameField.length+"vmin";

            return(
                <React.Fragment>
                    <div className={textDisplay}>
                        <PlayersNames userName={this.props.userName} player1={this.state.game.player1} player2={this.state.game.player2} strokeCounter={this.state.game.strokeCounter}/>
                    </div>

                    <div className="d-flex flex-column align-items-center flex-grow-0 flex-shrink-1 my-4 overflow-auto">
                        {this.state.game.gameField.map((item,indexRow)=>{
                            return (
                                <div className="customRow" key={indexRow} >
                                    {item.map((item,indexColumn)=>{
                                        let sign=null;
                                        if (item==1) sign=cross;
                                        else if (item==0) sign=signPlayer2;
                                        else sign=null;
                                        if (indexRow===this.state.game.gameField.length-1){
                                            if (this.props.userName!==this.state.game.player1&&this.props.userName!==this.state.game.player2){
                                                customColumn="customColumnLastRowMuted";
                                            }
                                            else customColumn="customColumnLastRow";
                                        }
                                        return(
                                            <div className={customColumn} onClick={()=>this.clickGameCell([indexRow,indexColumn])} key={indexColumn} style={{flexBasis: gameCellHeight}}>
                                                <img src={sign} className="gameCell img-fluid" alt=""/>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>

                    <div className="endGame">{endGameText}</div>
                    
                    <div className={"mx-auto my-4 h2 "+textDisplay}>
                        {clock}
                    </div>
                    
                    <button className="flex-shrink-0 mx-auto btn btn-buttonColor" style={{width:"10rem"}} onClick={buttonHandle}>{buttonName}</button>

                </React.Fragment>
            ); 
        } 
    else {
        return(
            <div>...Loading</div>
        );
    }
    }
}

export default withRouter(Game);