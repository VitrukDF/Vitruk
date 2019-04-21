import React, {Component} from 'react';
import cross from '../../svg/cross.svg';
import nought from '../../svg/nought.svg';
import noughtMuted from '../../svg/noughtMuted.svg';

class PlayersNames extends Component{
    constructor(props){
        super(props);
    }

    render(){



        let signPlayer2=nought;
        let border="border-bottom border-2 border-black";
        if (this.props.userName!==this.props.player1&&this.props.userName!==this.props.player2){
            signPlayer2=noughtMuted;
            border="border-bottom border-2 border-muted";
        }

        let activePlayer1;
        let activePlayer2;
        if (!(this.props.strokeCounter%2)){
            activePlayer1=border;
            activePlayer2=undefined;
        }else if (!!(this.props.strokeCounter%2)){
            activePlayer1=undefined;
            activePlayer2=border;
        }else {
            activePlayer1=undefined;
            activePlayer2=undefined;
        }
    
        return(
            <div className={"d-flex flex-shrink-0 justify-content-between "}>
                <div className={'d-flex align-items-center pb-1 mr-1'+' '+activePlayer1}>
                    <span className="pr-1" >{this.props.player1}</span>
                    <img src={cross} height="20" width="20"/>
                </div>
                <div className={'d-flex align-items-center pb-1'+' '+activePlayer2}>
                    <img className="pr-1" src={signPlayer2} height="20" />
                    <span>{this.props.player2}</span>
                </div>
            </div>
        );
    }
}

export default PlayersNames;