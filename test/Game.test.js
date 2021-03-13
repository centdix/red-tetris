const Game = require('../src/server/Game');
const Player = require('../src/server/Player');
const should = require('chai').should();
const expect = require('chai').expect;

describe('Game', () => {

	let game;
	let owner;
	beforeEach(function() {
		owner = new Player(3, 'bob');
		game = new Game(owner, 'test', 'Public');
	})

	describe('adding player', () => {
		it('throws error if arg is not a Player', () => {
			expect(() => game.addPlayer(1)).to.throw();
		});
		it('adds player if arg is a Player', () => {
			var player = new Player();
			game.addPlayer(player);
			game.players.should.have.lengthOf(2);
		});
	})

	describe('removing player', () => {
		it('throws error if arg is not a Player', () => {
			expect(() => game.removePlayer(1)).to.throw();
		});
		it('throws error if player doesn\'t exist', () => {
			var p = new Player();
			expect(() => game.removePlayer(p)).to.throw();
		});
		it('change game owner to null if player is owner and no other player', () => {
			var player = new Player(5, 'jean');
			game.removePlayer(owner);
			expect(game.owner).to.be.null;
		});
		it('change game owner to next player if player is owner', () => {
			var player = new Player(5, 'jean');
			game.addPlayer(player);
			game.removePlayer(owner);
			game.owner.should.equal(player);
		})
	})

	describe('starting', () => {

		beforeEach(function() {
			game.start();		
		})

		afterEach(function() {
			game.stop();
		})

		it('sets status to running', () => {
			game.status.should.equal('running');
		});
		it('adds two types in piece queue', () => {
			game.typesInQueue.should.have.lengthOf(3);
			expect(game.typesInQueue[0]).not.to.be.undefined;
			expect(game.typesInQueue[1]).not.to.be.undefined;
		});
		it('starts interval', () => {
			expect(game.interval).to.not.be.null;
		})
	})

	describe('stopping', () => {
		beforeEach(function() {
			game.start();
			game.stop();
		})

		it('sets status to finished', () => {
			game.status.should.equal('finished');
		});
	})

	describe('getting info', () => {
		let ret;
		beforeEach(function() {
			ret = game.getInfo();
		})
		it('gets status', () => {
			ret.should.have.property('status');
		});
		it('gets owner', () => {
			ret.should.have.property('owner');
		});
		it('gets players', () => {
			ret.should.have.property('players');
		});
		it('gets room', () => {
			ret.should.have.property('room');
		});
		it('gets mode', () => {
			ret.should.have.property('mode');
		});
		it('gets winner', () => {
			ret.should.have.property('winner');
		});
	})

});