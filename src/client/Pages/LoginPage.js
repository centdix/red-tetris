import React from 'react';
import LoginBox from '../Components/LoginBox';
import './LoginPage.css'

function LoginPage(props) {

	return (
	    <div className="LoginPage">
	    	<h1 className="title is-1">TETRIS</h1>
	    	<div className="box">
		    	<LoginBox onLogin={props.onLogin}></LoginBox>
		    </div>
	    </div>
	);
}

export default LoginPage;