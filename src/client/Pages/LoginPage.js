import React, { useState } from 'react';
import LoginBox from '../Components/LoginBox';
import './LoginPage.css'

function LoginPage(props) {

	return (
	    <div className="LoginPage">
	    	<h1 className="title is-1">TETRIS</h1>
	    	<div className="box">
		    	<LoginBox onLogin={props.onLogin}></LoginBox>
		    </div>
		    <div className="field Switch">
				<input
					id="switchRoundedDefault"
					type="checkbox"
					name="switchRoundedDefault"
					class="switch is-rounded is-medium"
					checked={props.switchValue}
					onClick={props.onSwitch}/>
				<label for="switchRoundedDefault">Dark mode</label>
			</div>
	    </div>
	);
}

export default LoginPage;