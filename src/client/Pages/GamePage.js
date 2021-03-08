import React, { useState, useEffect, useCallback } from 'react';
import Board from '../Components/Board';
import GameCommands from '../Components/GameCommands';
import GameInfo from '../Components/GameInfo';
import './GamePage.css';

function GamePage(props) {

	const [gameData, setGameData] = useState(null);

	const handleKey = useCallback(e => {
		if (gameData) {
			if (e.key === 'Enter') {
				if (gameData.status === 'standby' || gameData.status === 'finished')
					props.user.socket.emit('startGame');
				else if (gameData.status === 'running')
					props.user.socket.emit('stopGame');
			}
			else if (e.key === 'd' || e.key === 'ArrowRight') {
				if (gameData.status === 'running')
					props.user.socket.emit('goRight');
			}
			else if (e.key === 'w' || e.key === 'ArrowUp') {
				if (gameData.status === 'running')
					props.user.socket.emit('rotate');
			}
			else if (e.key === 'a' || e.key === 'ArrowLeft') {
				if (gameData.status === 'running')
					props.user.socket.emit('goLeft');
			}
			else if (e.key === 's' || e.key === 'ArrowDown') {
				if (gameData.status === 'running')
					props.user.socket.emit('goDown');
			}			
		}
	}, [gameData, props.user.socket]);

	useEffect(() => {
		const listener = data => setGameData(data);
		document.addEventListener('keydown', handleKey);
		if (gameData === null)
			props.user.socket.emit('getGameData');
		props.user.socket.on('gameState', listener);
		return function cleanup() {
	    	document.removeEventListener('keydown', handleKey);
			props.user.socket.off('gameState', listener);
		};
	}, [gameData, handleKey, props.user.socket]);

	let boardsOrGameInfo = null;
	if (gameData) {
		if (gameData.status !== 'running') {
			boardsOrGameInfo = <GameInfo user={props.user} gameData={gameData}></GameInfo>;
		}
		else {
			boardsOrGameInfo = gameData.players.map((p) => {
				return (
					<div key={p.login} className="BoardContainer">
						<Board player={p} user={props.user}></Board>
						<p className="Login">{p.login}</p>
					</div>
				);
			})
		}
	}

	return (
	    <div className="GamePage">
	    	<div className="GameMain">
		    	{boardsOrGameInfo}
		    </div>
		    <GameCommands></GameCommands>
	    </div>
	);
}

export default GamePage;