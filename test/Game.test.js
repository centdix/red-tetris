const Game = require('../src/server/Game');
const Player = require('../src/server/Player');
const should = require('chai').should();
const expect = require('chai').expect;

describe('Game', () => {

	describe('adding player', () => {
		it('throws error if arg is not a Player', () => {
			var game = new Game();
			expect(() => game.addPlayer(1)).to.throw();
		});
		it('adds player if arg is a Player', () => {
			var game = new Game();
			var p = new Player();
			game.addPlayer(p);
			game.players.should.have.lengthOf(2);
		});
	})

	describe('removing player', () => {
		it('throws error if arg is not a Player', () => {
			var game = new Game();
			expect(() => game.removePlayer(1)).to.throw();
		});
		it('throws error if player doesn\'t exist', () => {
			var game = new Game();
			var p = new Player();
			expect(() => game.removePlayer(p)).to.throw();
		});
		it('change game owner to undefined if player is owner and no other player', () => {
			var owner = new Player(4, 'bob');
			var game = new Game(null, owner, null, null);
			var player = new Player(5, 'jean');
			game.removePlayer(owner);
			expect(game.owner).to.be.undefined;
		});
		it('change game owner to next player if player is owner', () => {
			var owner = new Player(4, 'bob');
			var game = new Game(null, owner, null, null);
			var player = new Player(5, 'jean');
			game.addPlayer(player);
			game.removePlayer(owner);
			game.owner.should.equal(player);
		})
	})

	describe('starting', () => {
		var owner = new Player(4, 'bob');	
		var game = new Game(null, owner, null, null);
		game.start();

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
			game.stop();
		})
	})

	describe('stopping', () => {
		var owner = new Player(4, 'bob');	
		var game = new Game(null, owner, null, null);
		game.start();
		game.stop();

		it('sets status to finished', () => {
			game.status.should.equal('finished');
		});
		it('sets interval to null', () => {
			expect(game.interval).to.be.null;
		});
	})

	describe('getting info', () => {
		var game = new Game();
		var ret = game.getInfo();
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