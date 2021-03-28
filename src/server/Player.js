'use strict';

const Board = require('./Board.js');

class Player {
	constructor(id, login) {
		this.id = id;
		this.login = login;
		this.room = null;
		this.board = new Board(10, 20);
		this.score = 0;
	}

	setRoom(room) {
		if (room !== null && typeof(room) !== 'string')
			throw Error("arg should be string or null");
		this.room = room;
	}

	leaveRoom() {
		this.room = null;
		this.board = new Board(10, 20);
		this.score = 0;
	}

	addPoints(points) {
		this.score += points;
	}

}

module.exports = Player;