'use strict';

const Piece = require('../Piece.js');

class O extends Piece {

	constructor() {
		super();
		this.blocks = [
			[1,1,0,0],
			[1,1,0,0],
			[0,0,0,0],
			[0,0,0,0],
		]
		this.color = 'yellow';
	}

	rotate() {
		return ;
	}
}

module.exports = O;