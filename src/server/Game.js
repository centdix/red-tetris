'use strict';

const Piece = require('./Piece.js');
const Player = require('./Player.js');
const Board = require('./Board.js');
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

	constructor(owner, room, mode) {
		this.owner = owner;
		this.room = room;
		this.mode = mode;
		this.players = [];
		this.players.push(owner);
		this.typesInQueue = [];
		this.status = 'standby';
		this.winner = null;
		this.tick = 0;
		this.speed = 1;
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
			if (this.players.length > 0)
				this.owner = this.players[0];
			else
				this.owner = null;
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
		this.tick = 0;
		this.speed = 1;
		this.status = 'running';
		this.setPiecesInQueue(0);
		this.players.forEach((p) => {
			p.board = new Board(10, 20);
			p.score = 0;
			let index = p.board.pieceIndex;
			p.board.setPieces(this.typesInQueue[index], this.typesInQueue[index + 1]);
		});
	}

	updateState() {
		this.tick += 1;
		if (this.tick % 200 === 0)
			this.speed += this.speed / 20;

		let alive = this.players.length;
		this.players.forEach((p) => {
			if (p.board.status === 'filled')
				alive--;
			else {
				p.addPoints(p.board.filledLines * 10);
				if (p.board.filledLines > 1){
					this.sendExtraLines(p, p.board.filledLines - 1);
				}
				p.board.clearFilledLines();
				p.board.processInputs();
				if (this.tick % Math.round(10 / this.speed) === 0) {
					p.board.update();
				}
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
		}
		else if (this.players.length > 1 && alive === 1) {
			this.pickWinner();
			this.stop();
		}
	}

	stop() {
		this.status = 'finished';
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