'use strict';

const Piece = require('../Piece.js');

class T extends Piece {

	constructor() {
		super();
		this.blocks = [
			[0,0,0,0],
			[1,1,1,0],
			[0,1,0,0],
			[0,0,0,0],
		]
		this.color = 'purple';
	}
}

module.exports = T;