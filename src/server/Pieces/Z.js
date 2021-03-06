'use strict';

const Piece = require('../Piece.js');

class Z extends Piece {

	constructor() {
		super();
		this.blocks = [
			[0,0,0,0],
			[1,1,0,0],
			[0,1,1,0],
			[0,0,0,0],
		]
		this.color = 'red';
	}
}

module.exports = Z;