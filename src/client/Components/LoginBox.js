import React, { useState } from 'react';
import './LoginBox.css'

function LoginBox(props) {

	const [inputValue, setInputValue] = useState('');

	function onPress(e) {
		if (e.key === 'Enter') {
			props.onLogin(inputValue);
		}
	}

	function onChange(e) {
		setInputValue(e.target.value);
	}

	return (
	    <div className="LoginBox">
	      <input
	      	type="text"
	      	className="input is-medium"
	      	onKeyPress={onPress}
	      	onChange={onChange}
	      	placeholder="Choose a pseudo..."
	      ></input>
	    </div>
	);
}

export default LoginBox;