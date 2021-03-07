'use strict';

const Piece = require('./Piece.js');
const Player = require('./Player.js');
const io = require('socket.io');

class Game {
	static generatePieceType() {
		const rdmNumber = Math.floor(Math.random() * Math.floor(7));
		switch (rdmNumber) {
			case 0:
				return 'I';
			case 1:
				return 'O';
			case 2:
				return 'J';
			case 3:
				return 'S';
			case 4:
				return 'Z';
			case 5:
				return 'L';
			case 6:
				return 'T';
		}
	}

	constructor(io, owner, room, mode) {
		this.io = io;
		this.owner = owner;
		this.room = room;
		this.mode = mode;
		this.players = [];
		this.players.push(owner);
		this.typesInQueue = [];
		this.status = 'standby';
		this.winner = null;
		this.interval = null;
	}

	addPlayer(player) {
		if (player instanceof Player === false)
			throw Error('argument should be a Player');
		this.players.push(player);
	}

	removePlayer(player) {		
		if (player instanceof Player === false)
			throw Error('argument should be a Player');

		const index = this.players.indexOf(player);
		if (index === -1)
			throw Error('player not found');
		this.players.splice(index, 1);
		if (player.id === this.owner.id) {
			this.owner = this.players[0];
		}
	}

	pickWinner() {
		let winner = null;
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].board.status === 'filling')
				winner = this.players[i];
		}
		this.winner = winner;
	}

	setPiecesInQueue(index) {
		this.typesInQueue[index] = Game.generatePieceType();
		this.typesInQueue[index + 1] = Game.generatePieceType();
		this.typesInQueue[index + 2] = null;
	}

	sendExtraLines(fromPlayer, number) {
		this.players.forEach((p) => {
			if (p.id !== fromPlayer.id && p.board.status === 'filling') {
				p.board.addExtraLines(number);
			}
		})
	}

	start() {
		this.status = 'running';
		this.setPiecesInQueue(0);
		this.players.forEach((p) => {
			p.board.init(10, 20);
			let index = p.board.pieceIndex;
			p.board.setPieces(this.typesInQueue[index], this.typesInQueue[index + 1]);
		});
		this.interval = setInterval(() => {
			this.updateState();
			this.sendState();
		}, 60);
	}

	updateState() {
		let alive = this.players.length;
		this.players.forEach((p) => {
			if (p.board.status === 'filled')
				alive--;
			else {
				if (p.board.filledLines > 1)
					this.sendExtraLines(p, p.board.filledLines - 1);
				p.board.update();
				if (p.board.needPiece) {
					let index = p.board.pieceIndex;
					if (this.typesInQueue[index + 1] === null) {
						this.setPiecesInQueue(index + 1);
					}
					p.board.setPieces(this.typesInQueue[index], this.typesInQueue[index + 1]);
				}
			}
		});
		if (this.players.length === 1 && this.players[0].board.status === 'filled') {
			this.stop();
			this.sendState();
		}
		else if (this.players.length > 1 && alive === 1) {
			this.pickWinner();
			this.stop();
			this.sendState();
		}
	}

	stop() {
		this.status = 'finished';
		clearInterval(this.interval);
		this.interval = null;
	}

	sendState() {
		this.io.to(this.room).emit('gameState', this.getInfo());
	}

	getInfo() {
		return {
			status: this.status,
			players: this.players,
			room: this.room,
			mode: this.mode,
			owner: this.owner,
			winner: this.winner
		};
	}
}

module.exports = Game;