import React, {Component} from 'react';
import Clock from '../clock/clock';
import tick from '../../svg/tick.svg';

class GameCard extends Component{

    render(){
        let gamePhase=this.props.game.gamePhase;
        let player1=this.props.game.player1;
        let player2=this.props.game.player2;
        let winner=this.props.game.winner;
        let startTime=this.props.game.startTime;
        let lastActivity=this.props.game.lastActivity;

        let bgColor;
        let textColor1;
        let textColor2;
        let visibility;
        let visibilityTick1;
        let visibilityTick2;

        let clock=<Clock startTime={startTime} />;
        if (winner!==0){
            let date=new Date(lastActivity-startTime-(3*60*60*1000));
            clock=date.toLocaleTimeString();
        }

        if (player2===undefined){
            bgColor="bg-bgGameCardColor1";
            textColor1="text-white";
            textColor2="text-white";
            visibility="invisible";
            visibilityTick1="invisible";
            visibilityTick2="invisible";
        }
        else if(winner===0){
            bgColor="bg-bgGameCardColor2";
            textColor1="text-white";
            textColor2="text-white";
            visibility="visible";
            visibilityTick1="invisible";
            visibilityTick2="invisible";
        }
        else{
            bgColor="bg-bgGameCardColor3";
            visibility="visible";
            if (winner===1||winner===4){
                textColor1="text-winnerColor";
                textColor2="text-black";
                visibilityTick1="visible";
                visibilityTick2="invisible";
            }
            else if (winner===2||winner===3){
                textColor1="text-black";
                textColor2="text-winnerColor";
                visibilityTick1="invisible";
                visibilityTick2="visible";
            }
            else{
                textColor1="text-black";
                textColor2="text-black";
                visibilityTick1="invisible";
                visibilityTick2="invisible";
            }
        }

        return(
            <div className={"gameCard p-1 "+bgColor}>
                <div className="p-1 ">
                    <div className="" >
                        <span className={"pr-1 "+textColor1}>{player1}</span>
                        <img className={visibilityTick1} src={tick}/>
                    </div>
                    <div className={"border-top border-black pt-1 "+visibility}>
                        <span className={"pr-1 "+textColor2}>{player2}</span>
                        <img className={visibilityTick2} src={tick}/>
                    </div>
                </div>    
                <div className="">
                    {clock}
                </div>
            </div>
        );
    }
}

export default GameCard;