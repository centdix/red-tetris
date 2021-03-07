const Player = require('../src/server/Player');
const should = require('chai').should();
const expect = require('chai').expect;

describe('Player', () => {

	describe('setting room', () => {
		var player = new Player();

		it('throws error if arg is not string or null', () => {
			expect(() => player.setRoom(1)).to.throw();
		});
		it('sets room', () => {
			player.setRoom('test');
			player.room.should.equal('test');
		});
	})

});