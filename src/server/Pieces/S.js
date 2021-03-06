'use strict';

const Piece = require('../Piece.js');

class S extends Piece {

	constructor() {
		super();
		this.blocks = [
			[0,0,0,0],
			[0,1,1,0],
			[1,1,0,0],
			[0,0,0,0],
		]
		this.color = 'green';
	}
}

module.exports = S;