import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Header extends Component{
    render(){
        return(
            <header className="bg-black px-fixed py-3 shadow" >
                <Link to="/" className="text-white text-decoration-none">Tic Tac Toe
                    {/* <a className="text-white text-decoration-none" onClick={this.goToMenu} href="#">Tic Tac Toe</a> */}
                </Link>
            </header>
        )
    }
}

export default Header;