import React from 'react';
import './GameCommands.css';
import arrow from '../left-arrow.png';
import EVENTS from '../../common/Events';

function GameCommands(props) {

	function goLeft() {
		props.user.socket.emit(EVENTS['GO_LEFT']);
	}

	function goRight() {
		props.user.socket.emit(EVENTS['GO_RIGHT']);
	}

	function goDown() {
		props.user.socket.emit(EVENTS['GO_DOWN']);
	}

	function rotate() {
		props.user.socket.emit(EVENTS['ROTATE']);
	}

	return (
	    <div className="GameCommands">
	    	<div className="command" onClick={goLeft}>
	    		<span>GO LEFT</span>
	    		<img src={arrow} className="commandImage"/>
	    	</div>
	    	<div className="command" onClick={goRight}>
	    		<span>GO RIGHT</span>
	    		<img src={arrow} className="commandImage right"/>
	    	</div>
	    	<div className="command" onClick={goDown}>
	    		<span>GO DOWN</span>	    		
	    		<img src={arrow} className="commandImage down"/>
	    	</div>
	    	<div className="command" onClick={rotate}>
	    		<span>ROTATE</span>	    		
	    		<img src={arrow} className="commandImage up"/>
	    	</div>
    	</div>
	);
}

export default GameCommands;