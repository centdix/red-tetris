import React from 'react';
import LoginPage from '../Pages/LoginPage';
import RoomsPage from '../Pages/RoomsPage';
import GamePage from '../Pages/GamePage';
import './Main.css'

function Main(props) {

	let main;
	switch (props.page) {
		case 'login':
			main = <LoginPage onLogin={props.onLogin}></LoginPage>
			break;
		case 'rooms':
			main = <RoomsPage user={props.user} onRoomJoin={props.onRoomJoin} onCreateRoom={props.onCreateRoom}></RoomsPage>
			break;
		case 'game':
			main = <GamePage user={props.user}></GamePage>
			break;
		default:
			main = null;
	}

	return (
		<div className="Main">
			{main}
		</div>
	);

}

export default Main;