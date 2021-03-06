import React, { useState, useEffect } from 'react';
import './Chat.css'

function Chat(props) {

	const [messages, setMessages] = useState([]);
	const [myMsgValue, setMsgValue] = useState('');

	useEffect(() => {
		const listener = (data) => {
			setMessages(prev => {
				let copy = [...prev];
				copy.push(data);
				return (copy);
			});
		}		
		props.user.socket.on('chatMsg', listener);
		return function cleanup() {
			props.user.socket.off('chatMsg', listener);
		};
	}, [props.user.socket]);

	let list = null;
	if (messages.length) {
		list = messages.map((msg, index) => {
			let className = index === messages.length - 1 ? "Msg fade-in" : "Msg"; 
			return (<p key={index} className={className}>{msg}</p>);
		});
	}

	function handleChange(e) {
		setMsgValue(e.target.value);
	}

	function handleKey(e) {
		if (e.key === 'Enter') {
			sendMsg();
		}
	}

	function sendMsg(e) {
		props.user.socket.emit('clientMsg', myMsgValue);
		setMsgValue('');
	}

	return (
	    <div className="Chat">
			<div className="box ChatBox" style={{width: '100%'}}>
		    	<div className="Messages">
				    {list}
				</div>
			    <input className="input is-small" type="text" value={myMsgValue} onChange={handleChange} onKeyPress={handleKey}></input>
		    </div>
		</div>
	);
}

export default Chat;