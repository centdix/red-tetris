'use strict';

const Piece = require('./Piece.js');
const EVENTS = require('../common/Events.js');

const colors = {
	red: 2,
	green: 3,
	yellow: 4,
	purple: 5,
	orange: 6,
	blue: 7,
	cyan: 8,
	grey: 9
};

class Board {
	constructor(width, height) {
		this.w = width;
		this.h = height;
		this.fallingPiece = null;
		this.shadowPiece = null;
		this.nextPiece = null;
		this.pieceIndex = 0;
		this.filledLines = 0;
		this.needPiece = false;
		this.pending = false;
		this.status = 'empty';
		this.speed = 1;
		this.tick = 0;
		this.inputs = [];
		this.boardMap = [];
		for (let i = 0; i < this.h; i++) {
			this.boardMap[i] = new Array(this.w);
			for (let j = 0; j < this.w; j++) {
				this.boardMap[i][j] = 0;
			}
		}
	}

	setPieces(fallingType, nextType) {
		this.fallingPiece = Piece.generate(fallingType);
		this.nextPiece = Piece.generate(nextType);
		this.needPiece = false;
	}

	addInput(input) {
		this.inputs.push(input);
	}

	processInputs() {
		let copy = null;	
		for (let i = 0; i < this.inputs.length; i++) {
			copy = {...this.fallingPiece};
			copy.pos = {...this.fallingPiece.pos};
			switch(this.inputs[i]) {
				case EVENTS['GO_RIGHT']:
					copy.pos.x += 1;
 					if (Piece.collide(copy, this) === false)
 						this.fallingPiece.moveRight();
					break;
				case EVENTS['GO_LEFT']:
					copy.pos.x -= 1;
 					if (Piece.collide(copy, this) === false)
 						this.fallingPiece.moveLeft();
					break;
				case EVENTS['GO_DOWN']:
					copy.pos.y += 1;
					if (Piece.shouldStick(copy, this)) {
						this.inputs = [];
						this.pending = true;
					}
					this.fallingPiece.goDown();
					break;
				case EVENTS['ROTATE']:
					copy = this.fallingPiece.rotateCopy();
 					if (Piece.collide(copy, this) === false)
 						this.fallingPiece.rotate();
					break;
				default:
			}
		}
		this.inputs = [];
	}

	removeFilledLines() {
		let filledLines = 0;
		for (let x = 0; x < this.h; x++) {
			for (var y = 0; y < this.w; y++) {
				if (this.boardMap[x][y] === 0 || this.boardMap[x][y] === 9)
					break ;
			}
			if (y === this.w)
			{
				filledLines++;
				for (let i = x; i >= 1; i--) {
					this.boardMap[i] = this.boardMap[i - 1];
				}
			}
		}
		this.filledLines = filledLines;
	}

	addExtraLines(number) {
		for (let i = 0; i < this.h - number; i++) {
			this.boardMap[i] = [...this.boardMap[i + number]];
		}
		for (let i = 0; i < number; i++) {
			for (let j = 0; j < this.w; j++) {
				this.boardMap[this.h - 1 - i][j] = colors['grey'];
			}
		}
	}

	clearFilledLines() {
		this.filledLines = 0;
	}

	stickPiece() {
		let pieceBlocks = Piece.getBlocksPos(this.fallingPiece);
		for (let i = 0; i < pieceBlocks.length; i++) {
			if (pieceBlocks[i].y >= 0)
				this.boardMap[pieceBlocks[i].y][pieceBlocks[i].x] = colors[this.fallingPiece.color];
			else
				this.status = 'filled';
		}
		this.shadowPiece = null;
		this.fallingPiece = null;
		if (this.status !== 'filled') {
			this.needPiece = true;
			this.pieceIndex++;
			this.removeFilledLines();
		}
	}

	update() {
		this.tick += 1;
		this.status = 'filling';
		if (this.pending) {
			this.pending = false;
			this.inputs.splice(1);
			if (this.inputs[0] !== EVENTS['GO_DOWN'])
				this.processInputs();
			if (Piece.shouldStick(this.fallingPiece, this)) {
				this.stickPiece();
				return ;
			}
		}
		this.processInputs();
		if (this.tick % Math.round(10 / this.speed) === 0) {
			if (Piece.shouldStick(this.fallingPiece, this) === false)
				this.fallingPiece.goDown();
		}
		if (this.tick % 100 === 0)
			this.speed += this.speed / 20;
		this.shadowPiece = Piece.generateShadow(this.fallingPiece, this);
		if (Piece.shouldStick(this.fallingPiece, this)) {
			this.pending = true;
		}
	}

}

module.exports = Board;