'use strict';

const Piece = require('../Piece.js');

class I extends Piece {

	constructor() {
		super();
		this.blocks = [
			[0,1,0,0],
			[0,1,0,0],
			[0,1,0,0],
			[0,1,0,0],
		]
		this.color = 'cyan';
	}
}

module.exports = I;