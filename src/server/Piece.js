'use strict';

class Piece {

	static generate(type) {
		if (typeof(type) !== 'string' || type.length > 1)
			throw Error('arg should be one capital letter');
		switch (type) {
			case 'I':
				return new I();
			case 'O':
				return new O();
			case 'J':
				return new J();
			case 'S':
				return new S();
			case 'Z':
				return new Z();
			case 'L':
				return new L();
			case 'T':
				return new T();
		}
	}

	static collide(piece, board) {
		if (this.getMaxY(piece) >= board.h - 1
		|| this.getMaxX(piece) >= board.w || this.getMinX(piece) < 0) {
			return true;
		}
		let blocksPos = this.getBlocksPos(piece);
		for (let i = 0; i < blocksPos.length; i++) {
			for (let y = 0; y < board.h; y++) {
				for (let x = 0; x < board.w; x++) {
					if (board.boardMap[y][x]) {
						if (blocksPos[i].y === y - 1 && blocksPos[i].x === x)
							return true;
					}
				}
			}
		}
		return false;
	}

	static getMinX(piece) {
		let min = 3;
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (piece.blocks[i][j] && j < min) {
					min = j;
					break;
				}
			}
		}
		return piece.pos.x + min;
	}

	static getMaxX(piece) {
		let max = 0;
		for (let i = 0; i < 4 ; i++) {
			for (let j = 3; j >= 0; j--) {
				if (piece.blocks[i][j] && j > max) {
					max = j;
					break;					
				}
			}
		}
		return piece.pos.x + max;
	}

	static getMinY(piece) {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (piece.blocks[i][j]) {
					return piece.pos.y + i;
				}
			}
		}
		return piece.pos.y + 3;
	}

	static getMaxY(piece) {
		for (let i = 3; i >= 0; i--) {
			for (let j = 0; j < 4; j++) {
				if (piece.blocks[i][j]) {
					return piece.pos.y + i;
				}
			}
		}
		return piece.pos.y;
	}

	static getBlocksPos(piece) {
		let arr = [];
		let pos = {
			x: 0,
			y: 0
		};
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (piece.blocks[i][j]) {
					pos.x = piece.pos.x + j;
					pos.y = piece.pos.y + i;
					arr.push({...pos});
				}
			}
		}
		return arr;
	}

	constructor() {
		this.pos = {
			x: 5,
			y: -4,
		};
		this.blocks = [
			[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0]
		]
	}

	rightCopy() {
		return ({
			pos: {
				x: this.pos.x + 1,
				y: this.pos.y
			},
			vel: {...this.vel},
			blocks: [...this.blocks]
		})
	}

	leftCopy() {
		return ({
			pos: {
				x: this.pos.x - 1,
				y: this.pos.y
			},
			vel: {...this.vel},
			blocks: [...this.blocks]
		})
	}

	downCopy() {
		return ({
			pos: {
				x: this.pos.x,
				y: this.pos.y + 1
			},
			vel: {...this.vel},
			blocks: [...this.blocks]
		})
	}

	rotateCopy() {
		let newArray = new Array(4);
		for (let i = 0; i < 4; i++) {
			newArray[i] = new Array(4);
			for (let j = 0; j < 4; j++) {
				newArray[i][j] = this.blocks[3 - j][i];
			}
		}
		return ({
			pos: {
				x: this.pos.x,
				y: this.pos.y
			},
			vel: {...this.vel},
			blocks: [...newArray]
		})
	}

	moveLeft() {
		this.pos.x -= 1;
	}

	moveRight() {
		this.pos.x += 1;
	}

	rotate() {
		this.blocks = [...this.rotateCopy().blocks];
	}

	goDown() {
		this.pos.y += 1;
	}
}

module.exports = Piece;
const I = require('./Pieces/I.js');
const O = require('./Pieces/O.js');
const J = require('./Pieces/J.js');
const S = require('./Pieces/S.js');
const L = require('./Pieces/L.js');
const T = require('./Pieces/T.js');
const Z = require('./Pieces/Z.js');

