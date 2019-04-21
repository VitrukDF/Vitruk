import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import Database from '../../service/database'
import cross from '../../svg/cross.svg';
import nought from '../../svg/nought.svg';
import noughtMuted from '../../svg/noughtMuted.svg';

class CreateGame extends Component{
    constructor(props){
        super(props);
        this.state={
            rowInput: '4',
            columnInput: '4',
            numberToWinInput: '4',
            rowInputError:'',
            columnInputError:'',
            numberToWinInputError:'',
            rowInputHighlight:'',
            columnInputHighlight:'',
            numberToWinInputHighlight:'',
        }
        this.backToMenu=this.backToMenu.bind(this);
        this.createGame=this.createGame.bind(this);
        this.handleInputChange=this.handleInputChange.bind(this);
    }

    handleInputChange(e){
        e.preventDefault();
        const name=e.target.name;
        const error=name+'Error';
        const highlight=name+'Highlight';
        
        if(name=="numberToWinInput"){
            var numberToWinInputError=e.target.validationMessage;
            var maxMoves=Math.round(+this.state.rowInput*this.state.columnInput/2);
            if((+e.target.value>+this.state.rowInput)&&(+e.target.value>+this.state.columnInput)||(+e.target.value>maxMoves)){
                numberToWinInputError="больше чем игровое поле";
            }
        }
        else if(name=="rowInput"){
            var maxMoves=Math.round(+e.target.value*this.state.columnInput/2);
            if((+this.state.numberToWinInput>+e.target.value)&&(+this.state.numberToWinInput>+this.state.columnInput)||(+this.state.numberToWinInput>maxMoves)){
                numberToWinInputError="больше чем игровое поле";
            }
        }
        else if(name=="columnInput"){
            var maxMoves=Math.round(+this.state.rowInput*e.target.value/2);
            if((+this.state.numberToWinInput>+this.state.rowInput)&&(+this.state.numberToWinInput>+e.target.value)||(+this.state.numberToWinInput>maxMoves)){
                numberToWinInputError="больше чем игровое поле";
            }
        }
        const numberToWinInputHighlight=numberToWinInputError?"is-invalid":"is-valid";

        const highlightClass=e.target.validationMessage?"is-invalid":"is-valid";
        this.setState({
            [name]: e.target.value,
            [error]: e.target.validationMessage,
            [highlight]: highlightClass,
            numberToWinInputError: numberToWinInputError,
            numberToWinInputHighlight: numberToWinInputHighlight,
        });
    }
    
    backToMenu(e){
        e.preventDefault();        
        this.props.history.push("/");
    }

    createGame(event){
        event.preventDefault();
        if (!this.state.rowInputError&&!this.state.columnInputError&&!this.state.numberToWinInputError){
            let row=Number(this.state.rowInput);
            let column=Number(this.state.columnInput);
            let numberToWin=Number(this.state.numberToWinInput);
            let gameField=new Array(row);

            for (let i=0;i<gameField.length;i++){
                gameField[i]=new Array(column);
                gameField[i].fill(null);
            }

            let newGame={
                // gameId: localStorage.length,
                gamePhase: 0,//create
                startTime: Date.now(),
                lastActivity: Date.now(),
                strokeCounter: 0,
                numberToWin: numberToWin,
                lastPosition: [0,0],
                gameField: gameField,
                cellNumber: row*column,
                winner: 0,//1-player1,2-player2,3-surrender pl1,4-surrender pl2,5-draw game
                player1: this.props.userName,
                player2:undefined,
                // "Player 2",
            }
            Database.push("games",newGame)
            this.props.history.push("/");
        }
    }

    render(){
        return(
            <div>
            <form className="mx-auto p-4 mb-4 bg-white  shadow-sm rounded needs-validation" noValidate style={{maxWidth: "700px"}} action="#" method="post">
                <div className="mb-4 mx-auto flex-grow-1" style={{maxWidth: '300px'}}>

                    <div className="form-group row">
                        {/* <div className="col-sm-7"> */}
                            <label htmlFor="inputRow" className="col-sm-7 col-form-label">Number of rows
                                <small id="inputRowHelpBlock" className="form-text text-muted">1-999</small>
                            </label>
                        {/* </div> */}
                        <div className="col-sm-5">
                            <input type="text" className={"form-control "+this.state.rowInputHighlight} id="inputRow" value={this.state.rowInput} name="rowInput" onChange={this.handleInputChange} aria-describedby="inputRowHelpBlock" pattern="[1-9]{1}\d{0,2}" required/>
                        </div>
                        <div className="invalid-feedback d-block px-3">
                            {this.state.rowInputError}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="inputColumn" className="col-sm-7 col-form-label">Number of columns
                            <small id="inputColumnHelpBlock" className="form-text text-muted">1-999</small>
                        </label>
                        <div className="col-sm-5">
                            <input type="text" className={"form-control "+this.state.columnInputHighlight} id="inputColumn" value={this.state.columnInput} name="columnInput" onChange={this.handleInputChange} aria-describedby="inputColumnHelpBlock" pattern="[1-9]{1}\d{0,2}" required/>
                        </div>
                        <div className="invalid-feedback d-block px-3">
                            {this.state.columnInputError}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="inputNumberToWin" className="col-sm-7 col-form-label">Number to win
                            <small id="inputNumberToWinHelpBlock" className="form-text text-muted">more then null and less than max field</small>
                        </label>
                        <div className="col-sm-5">
                            <input type="text" className={"form-control "+this.state.numberToWinInputHighlight} id="inputNumberToWin" value={this.state.numberToWinInput} name="numberToWinInput" onChange={this.handleInputChange} aria-describedby="inputNumberToWinHelpBlock" pattern="[1-9]{1}\d{0,2}" required/>
                        </div>
                        <div className="invalid-feedback d-block px-3">
                            {this.state.numberToWinInputError}
                        </div>
                    </div>

                    <div className="form-group row justify-content-between">
                        <div className="col-auto pb-2">
                            <button className="btn btn-warning " type="reset" onClick={this.backToMenu}>Cancel</button>
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-buttonColor " type="submit" onClick={this.createGame}>Create game</button>
                        </div>
                    </div>
                </div>
            </form>
            </div>
        ); 
    }
}

export default withRouter(CreateGame);