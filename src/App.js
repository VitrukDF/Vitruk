import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Switch,Redirect} from 'react-router-dom';
import './styles/App.scss';
import Header from './content/header/header';
import Game from './content/game/game';
import Menu from './content/menu/menu';
import CreateGame from './content/createGame/createGame';
import TestComponent from './testComponent';

class App extends Component {
  constructor(props){
      super(props);
      this.state={
          // screenId: 0,//!!Menu
          selectGame: 0,
          standbyTime: (1*60*1000),//10sec//5 min
          userName: "user Name",//!!Menu
      }
      this.stateChanger=this.stateChanger.bind(this);
  }

  stateChanger(data){
    this.setState(data);
  }

  render() {
    return (
      <Router basename='/'>
        <Header />
        
        <div className="flex-grow-1 d-flex flex-column px-fixed py-4 border border-primary overflow-auto">
          <Switch>
            {/* <Route path="/menu" component={Menu} /> */}
            <Route path="/menu" render={()=><Menu stateChanger={this.stateChanger} userName={this.state.userName} standbyTime={this.state.standbyTime}/>} />
            <Route path="/createGame" render={()=><CreateGame userName={this.state.userName} />} />
            <Route path="/game/:id" render={({match})=><Game match={match} userName={this.state.userName}/>} />
            <Route path="/no" component={NoMatch} />
            <Redirect from="/*" to="/menu" />
            
          </Switch>
        </div>

        <TestComponent />
      </Router>
    );
  }
}
const NoMatch = ({ location }) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
)
export default App;