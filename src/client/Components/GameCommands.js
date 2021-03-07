import React from 'react';
import './GameCommands.css';
import arrow from '../left-arrow.png';

function GameCommands(props) {
	return (
	    <div className="GameCommands">
	    	<div className="command">
	    		<span>GO LEFT</span>
	    		<img src={arrow} className="commandImage"/>
	    	</div>
	    	<div className="command">
	    		<span>GO RIGHT</span>
	    		<img src={arrow} className="commandImage right"/>
	    	</div>
	    	<div className="command">
	    		<span>GO DOWN</span>	    		
	    		<img src={arrow} className="commandImage down"/>
	    	</div>
	    	<div className="command">
	    		<span>ROTATE</span>	    		
	    		<img src={arrow} className="commandImage up"/>
	    	</div>
    	</div>
	);
}

export default GameCommands;