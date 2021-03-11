import React from 'react';
import EVENTS from '../../common/Events';
import './GameInfo.css';

function GameInfo(props) {

	function start() {
		if (props.gameData.status === 'standby' || props.gameData.status === 'finished')
			props.user.socket.emit(EVENTS['START_GAME']);
	}

	let title = null;
	let subtitle = null;
	let winner = null;
	let className = "hero is-warning Banner";
	if (props.show === false)
		className = "hero is-warning Banner Hidden";
	if (props.gameData.status === 'standby') {
		if (props.gameData.owner.login === props.user.login) {
			title = "You are the host !"
			subtitle = <button className="button is-info" onClick={start}>START</button>
		}
		else {
			title = "Welcome !"
			subtitle = <p className="subtitle">Waiting for host to start the game...</p>
		}
	}
	else if (props.gameData.status === 'finished') {
		title = "GAME OVER !"	
		if (props.gameData.winner)
			winner = <p className="subtitle">The winner is {props.gameData.winner.login} !</p>
		if (props.gameData.owner.login === props.user.login)
			subtitle = <button className="button is-info" onClick={start}>RESTART</button>
		else
			subtitle = <p className="subtitle">Waiting for host to start again...</p>
	}

	return (
	    <div className={className}>
		    <div className="hero-body">
			    <p className="title">
			      {title}
			    </p>
			    {winner}
			    {subtitle}
			</div>
    	</div>
	);
}

export default GameInfo;