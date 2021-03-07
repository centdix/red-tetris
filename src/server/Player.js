'use strict';

const Board = require('./Board.js');

class Player {
	constructor(id, login) {
		this.id = id;
		this.login = login;
		this.room = null;
		this.board = new Board();
	}

	setRoom(room) {
		if (room !== null && typeof(room) !== 'string')
			throw Error("arg should be string or null");
		this.room = room;
	}

}

module.exports = Player;