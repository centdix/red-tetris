import React from 'react';
import './Header.css'

function Header(props) {
	
	return (
		<div className="Header">
			<button className="button is-light BackButton" onClick={props.goBack}>
			  <span>Go back</span>
			</button>
			<span className="Title">TETRIS</span>
			<span className="LogText">{props.user.login}</span>
		</div>
	);
}

export default Header;