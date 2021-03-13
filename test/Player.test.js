const Player = require('../src/server/Player');
const Piece = require('../src/server/Piece');
const should = require('chai').should();
const expect = require('chai').expect;

describe('Player', () => {

	let player;
	beforeEach(function() {
		player = new Player();
	})

	describe('setting room', () => {

		it('throws error if arg is not string or null', () => {
			expect(() => player.setRoom(1)).to.throw();
		});
		it('sets room', () => {
			player.setRoom('test');
			player.room.should.equal('test');
		});
	})

	describe('leaving room', () => {
		beforeEach(function() {
			player.setRoom('test');
			player.board.fallingPiece = new Piece();
			player.leaveRoom();
		})
		it('should set player room to null', () => {
			expect(player.room).to.be.null;
		})
		it('should reset player board', () => {
			expect(player.board.fallingPiece).to.be.null;
		})
	})

});