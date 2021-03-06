import React from 'react';
import './GameInfo.css';

function GameInfo(props) {

	let message = null;
	if (props.gameData.status === 'standby') {
		if (props.gameData.owner.login === props.user.login)
			message = "You are the host, press ENTER to start the game";
		else
			message = "Waiting for host to start the game...";
	}
	else if (props.gameData.status === 'finished') {
		if (props.gameData.players.length > 1)
			message = "GAME OVER ! The winner is " + props.gameData.winner.login;
		else
			message = "GAME OVER ! Press enter to start again";
	}

	let players = props.gameData.players.map((p) => {
		let className = "panel-block PlayerBlock fade-in";
		if (p.login === props.gameData.owner.login) {
			return (
				<div key={p.login} className={className}>
					<span>{p.login}</span>
					<span className="tag is-primary">Host</span>
				</div>
			);			
		}
		else {
			return (
				<div className={className}>
					<span>{p.login}</span>
				</div>
			);	
		}
	})

	return (
	    <div className="GameInfo">
	    	<div className="Message">
		    	<p>{message}</p>
		    </div>
	    	<div className="panel Players">
  				<p className="panel-heading">Players</p>
  				{players}
    		</div>
    	</div>
	);
}

export default GameInfo;