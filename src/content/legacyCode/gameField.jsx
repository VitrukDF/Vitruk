import React, {Component} from 'react';
import GameCell from './gameCell'

class GameField extends Component{

    render(){
        return(
            <div className="d-flex flex-column flex-grow-1 borde borde-3  flex-shrink-1 my-4 overflow-auto">
                {this.props.gameField.map((item,indexRow)=>{
                    return (
                        <div className="d-flex customRow" key={indexRow} >
                            {item.map((item,indexColumn)=>{
                                let sign=null;
                                if (item==1) sign=this.props.player1.sign;
                                else if (item==0) sign=this.props.signPlayer2;
                                else sign=null;
                                return(
                                    <GameCell sign={sign} key={indexColumn} index={[indexRow,indexColumn]} stateChanger={this.props.stateChanger} gameView={this.props.gameView} />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default GameField;