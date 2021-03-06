import React from 'react';
import './Header.css'

function Header(props) {

	let rightText = null;
	let login = props.user.login;

	if (login)
		rightText = "Logged in as " + login
	else
		rightText = "Not logged yet"
	
	return (
		<div className="Header">
			<button className="button is-light BackButton" onClick={props.goBack}>
			  <span>Go back</span>
			</button>
			<span className="Title">TETRIS</span>
			<span className="LogText">{rightText}</span>
		</div>
	);
}

export default Header;