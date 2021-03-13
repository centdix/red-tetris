import React, { useState, useEffect, useCallback } from 'react';
import Board from '../Components/Board';
import GameCommands from '../Components/GameCommands';
import GameInfo from '../Components/GameInfo';
import EVENTS from '../../common/Events';
import './GamePage.css';

function GamePage(props) {

	const [gameData, setGameData] = useState(null);

	const handleKey = useCallback(e => {
		if (gameData && gameData.status === 'running') {
			if (e.key === 'd' || e.key === 'ArrowRight')
				props.user.socket.emit(EVENTS['GO_RIGHT']);
			else if (e.key === 'w' || e.key === 'ArrowUp')
				props.user.socket.emit(EVENTS['ROTATE']);
			else if (e.key === 'a' || e.key === 'ArrowLeft')
				props.user.socket.emit(EVENTS['GO_LEFT']);
			else if (e.key === 's' || e.key === 'ArrowDown')
				props.user.socket.emit(EVENTS['GO_DOWN']);
		}
	}, [gameData, props.user.socket]);

	useEffect(() => {
		const listener = data => setGameData(data);
		document.addEventListener('keydown', handleKey);
		if (gameData === null)
			props.user.socket.emit(EVENTS['GET_GAME_DATA']);
		props.user.socket.on(EVENTS['GAME_STATE'], listener);
		return function cleanup() {
	    	document.removeEventListener('keydown', handleKey);
			props.user.socket.off(EVENTS['GAME_STATE'], listener);
		};
	}, [gameData, handleKey, props.user.socket]);

	let info = null;
	let boards = null;
	let showInfo = true;
	if (gameData && gameData.owner) {
		if (gameData.status === 'running')
			showInfo = false;
		else
			showInfo = true;
		info = <GameInfo user={props.user} gameData={gameData} show={showInfo}></GameInfo>
		boards = gameData.players.map((p) => {
			let loginClass = "Login";
			let hostTag = null;
			if (p.id === props.user.socket.id)
				loginClass = "UserLogin";
			if (gameData.owner.id === p.id)
				hostTag = <span class="tag is-primary">Host</span>;
			return (
				<div key={p.login} className="BoardContainer">
					<Board player={p} user={props.user}></Board>
					<div className={loginClass}>
						{p.login}
						{hostTag}
					</div>
				</div>
			);
		})
	}

	return (
	    <div className="GamePage">
	    	<div className="GameMain">
	    		{info}
	    		{boards}
		    </div>
		    <GameCommands user={props.user}></GameCommands>
	    </div>
	);
}

export default GamePage;