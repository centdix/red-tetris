import React, { useState } from 'react';
import './RoomForm.css';

function RoomForm(props) {

	const [inputValue, setInputValue] = useState('');
	const [modeValue, setModeValue] = useState('Public');

	function handleChange(e) {
		setInputValue(e.target.value);
	}

	function handleKey(e) {
		if (e.key === 'Enter') {
			props.onCreateRoom(inputValue);
		}
	}

	function setToPublic() {
		setModeValue('Public');
	}

	function setToPrivate() {
		setModeValue('Private');
	}

	let privateButtonClass = "button";
	let publicButtonClass = "button";
	if (modeValue === 'Public')
		publicButtonClass += " is-info";
	else
		privateButtonClass += " is-info";

	return (
		<div className="box RoomForm">
			<div>
			    <h1 className="TitleCreate">Create room</h1>
			</div>
			<div>
				<input
					className="input"
					type="text"
					placeholder="Room name"
					value={inputValue}
					onChange={handleChange}
					onKeyPress={handleKey}
				></input>
			</div>
			<div className="Buttons">
				<div className="buttons has-addons ModeButtons">
				  <button className={publicButtonClass} onClick={setToPublic}>Public</button>
				  <button className={privateButtonClass} onClick={setToPrivate}>Private</button>
				</div>
				<div style={{flexGrow: '1'}}></div>
				<button
					className="button is-info CreateButton"
					onClick={() => props.onCreateRoom(inputValue, modeValue)}
				>
					Create
				</button>
			</div>
		</div>
	)
}

export default RoomForm;