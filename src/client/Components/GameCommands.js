import React from 'react';
import './GameCommands.css';

function GameCommands(props) {
	return (
	    <div className="GameCommands">
			<nav className="level">
			  <div className="level-item has-text-centered">
			    <div>
			      <p className="heading">GO LEFT</p>
			      <p className="title"><i className="fas fa-caret-square-left"></i></p>
			    </div>
			  </div>
			  <div className="level-item has-text-centered">
			    <div>
			      <p className="heading">GO RIGHT</p>
			      <p className="title"><i className="fas fa-caret-square-right"></i></p>
			    </div>
			  </div>
			  <div className="level-item has-text-centered">
			    <div>
			      <p className="heading">GO DOWN</p>
			      <p className="title"><i className="fas fa-caret-square-down"></i></p>
			    </div>
			  </div>
			  <div className="level-item has-text-centered">
			    <div>
			      <p className="heading">ROTATE</p>
			      <p className="title"><i className="fas fa-caret-square-up"></i></p>
			    </div>
			  </div>
			</nav>
    	</div>
	);
}

export default GameCommands;