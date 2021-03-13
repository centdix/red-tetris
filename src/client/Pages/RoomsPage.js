import React, { useState, useEffect } from 'react';
import RoomForm from '../Components/RoomForm.js';
import './RoomsPage.css'

function RoomsPage(props) {

	const [rooms, setRooms] = useState([]);

	useEffect(() => {
		props.user.socket.emit('getRooms');
		const listener = data => setRooms(data);
		props.user.socket.on('games', listener);
		return function cleanup() {
			props.user.socket.off('games', listener);
		};
	}, [props.user.socket]);

	let list = null;
	let noRoomsMessage = null;
	if (rooms.length) {
		list = rooms.map((r) => {
			let className = "panel-block RoomBlock fade-in";
			return (
				<div 
					key={r.room} 
					className={className}
					onClick={() => props.onRoomJoin(r.room)}
				>
					<span style={{fontWeight: 'bold'}}>#{r.room}</span>
					<span style={{textAlign: 'center'}}>{r.players.length} player(s)</span>
					<span style={{textAlign: 'center'}}>{r.mode}</span>
					<span style={{textAlign: 'right'}}>{r.status}</span>
				</div>
			);
		});
	}
	else {
		noRoomsMessage = <p>No rooms yet. Create one !</p>
	}

	return (
	    <div className="RoomsPage">
	    	<div className="panel" style={{maxHeight: '60%'}}>
	    		<p className="panel-heading">Game rooms</p>
	    			<div className="RoomsList">
			    		{list}
			    	</div>
		    </div>
		    <div className="Message">{noRoomsMessage}</div>
	    	<RoomForm onCreateRoom={props.onCreateRoom}></RoomForm>
	    </div>
	);
}

export default RoomsPage;