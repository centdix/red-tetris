'use strict';

const Piece = require('./Piece.js');

const colors = {
	red: 2,
	green: 3,
	yellow: 4,
	purple: 5,
	orange: 6,
	blue: 7,
	cyan: 8
};

class Board {
	constructor() {
		this.w = 10;
		this.h = 20;
		this.fallingPiece = null;
		this.shadowPiece = {};
		this.nextPiece = null;
		this.pieceIndex = 0;
		this.needPiece = false;
		this.status = 'empty';
		this.boardMap = [];
	}

	init(width, height) {
		this.w = width;
		this.h = height;
		this.fallingPiece = null;
		this.shadowPiece = {};
		this.nextPiece = null;
		this.pieceIndex = 0;
		this.needPiece = false;
		this.status = 'empty';
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
		for (let x = 0; x < this.h; x++) {
			for (var y = 0; y < this.w; y++) {
				if (this.boardMap[x][y] === 0)
					break ;
			}
			if (y === this.w)
			{
				for (let i = x; i >= 1; i--) {
					this.boardMap[i] = this.boardMap[i - 1];
				}
			}
		}
	}

	update() {
		this.status = 'filling';
		this.fallingPiece.goDown();
		this.shadowPiece = new Piece();
		this.shadowPiece.pos = {...this.fallingPiece.pos};
		this.shadowPiece.blocks = [...this.fallingPiece.blocks];
		this.shadowPiece.color = this.fallingPiece.color;
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