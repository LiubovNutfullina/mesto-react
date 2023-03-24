import React from "react";
import logo from '../images/logo.svg';
import '../blocks/header/__logo/header__logo.css'

function Header() {
    return (
        <div className="header">
            <img className="header__logo" src={logo} alt="Здесь написано Mesto Russia"/>
        </div>
    );
}

export default Header;