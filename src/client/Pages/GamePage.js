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

	let info = null;
	let boards = null;
	let showInfo = true;
	let hash = window.location.hash;
	let roomName = hash.slice(0, hash.indexOf('['));
	if (gameData) {
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
	    		<span className="RoomName">{roomName}</span>
	    		{info}
	    		{boards}
		    </div>
		    <GameCommands></GameCommands>
	    </div>
	);
}

export default GamePage;