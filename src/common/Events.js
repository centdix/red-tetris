'use strict';

const EVENTS = {
	LOGIN: 'login',
	LOGOUT: 'logout',
	DIRECT_LINK: 'directLink',
	GET_ROOMS: 'getRooms',
	CREATE_ROOM: 'createRoom',
	JOIN_ROOM: 'joinRoom',
	GET_GAME_DATA: 'getGameData',
	LEAVE_ROOM: 'leaveRoom',
	START_GAME: 'startGame',
	GAME_STATE: 'gameState',
	ROOMS: 'rooms',
	GO_RIGHT: 'goRight',
	GO_LEFT: 'goLeft',
	GO_DOWN: 'goDown',
	ROTATE: 'rotate'
}

module.exports = EVENTS;