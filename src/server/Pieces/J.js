'use strict';

const Piece = require('../Piece.js');

class J extends Piece {

	constructor() {
		super();
		this.blocks = [
			[0,1,0,0],
			[0,1,0,0],
			[1,1,0,0],
			[0,0,0,0]
		]
		this.color = 'blue';
	}
}

module.exports = J;