import React from 'react';
import './GameInfo.css';

function GameInfo(props) {

	let title = null;
	let subtitle = null;
	let className = "hero is-warning Banner";
	if (props.show === false)
		className = "hero is-warning Banner Hidden";
	if (props.gameData.status === 'standby') {
		if (props.gameData.owner.login === props.user.login) {
			title = "You are the host !"
			subtitle = "Press ENTER when you want to start"
		}
		else {
			title = "Welcome !"
			subtitle = "Waiting for host to start the game..."
		}
	}
	else if (props.gameData.status === 'finished') {
		title = "GAME OVER !"	
		if (props.gameData.winner)
			subtitle = "The winner is " + props.gameData.winner.login + " ! ";
		else
			subtitle = "";
		if (props.gameData.owner.login === props.user.login)
			subtitle += "Press ENTER to start again"
		else
			subtitle += "Waiting for host to start again..."
	}

	return (
	    <div className={className}>
		    <div class="hero-body">
			    <p class="title">
			      {title}
			    </p>
			    <p class="subtitle">
			      {subtitle}
			    </p>
			</div>
    	</div>
	);
}

export default GameInfo;