'use strict';

const Piece = require('./Piece.js');

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
	constructor() {
		this.w = 10;
		this.h = 20;
		this.fallingPiece = null;
		this.shadowPiece = {};
		this.nextPiece = null;
		this.pieceIndex = 0;
		this.filledLines = 0;
		this.needPiece = false;
		this.status = 'empty';
		this.speed = 1;
		this.tick = 0;
		this.boardMap = [];
	}

	init(width, height) {
		this.w = width;
		this.h = height;
		this.fallingPiece = null;
		this.shadowPiece = {};
		this.nextPiece = null;
		this.pieceIndex = 0;
		this.filledLines = 0;
		this.needPiece = false;
		this.status = 'empty';
		this.speed = 1;
		this.tick = 0;
		for (let i = 0; i < this.h; i++) {
			this.boardMap[i] = new Array(this.w);
			for (let j = 0; j < this.w; j++) {
				this.boardMap[i][j] = 0;
			}
		}
	}

	setPieces(fallingType, nextType) {
		console.log('called');
		this.fallingPiece = Piece.generate(fallingType);
		this.nextPiece = Piece.generate(nextType);
		this.needPiece = false;
	}

	movePieceRight() {
		let copy = this.fallingPiece.rightCopy();
		if (Piece.collide(copy, this))
			return ;
		this.fallingPiece.moveRight();
	}

	movePieceLeft() {
		let copy = this.fallingPiece.leftCopy();
		if (Piece.collide(copy, this))
			return ;
		this.fallingPiece.moveLeft();
	}

	rotatePiece() {
		let copy = this.fallingPiece.rotateCopy();
		if (Piece.collide(copy, this))
			return ;
		this.fallingPiece.rotate();
	}

	speedUpPiece() {
		let copy = this.fallingPiece.downCopy();
		if (Piece.collide(copy, this))
			return ;
		this.fallingPiece.goDown();
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
				this.boardMap[this.h - 1 - i][j] = 9;
			}
		}
	}

	clearFilledLines() {
		this.filledLines = 0;
	}

	update() {
		this.tick += 1;
		this.status = 'filling';
		if (this.tick % Math.round(10 / this.speed) === 0) 
			this.fallingPiece.goDown();
		if (this.tick % 100 === 0)
			this.speed += this.speed / 20;
		this.shadowPiece = new Piece();
		this.shadowPiece.pos = {...this.fallingPiece.pos};
		this.shadowPiece.blocks = [...this.fallingPiece.blocks];
		this.shadowPiece.color = 'black';
		while (Piece.collide(this.shadowPiece, this) === false)
			this.shadowPiece.pos.y += 1;
		if (Piece.collide(this.fallingPiece, this)) {
			Piece.getBlocksPos(this.fallingPiece).forEach((pos) => {
				if (pos.y >= 0)
					this.boardMap[pos.y][pos.x] = colors[this.fallingPiece.color];
				else
					this.status = 'filled';
			}, this);
			this.shadowPiece = null;
			if (this.status !== 'filled') {
				this.needPiece = true;
				this.pieceIndex++;
				this.removeFilledLines();
			}
		}
	}

}

module.exports = Board;