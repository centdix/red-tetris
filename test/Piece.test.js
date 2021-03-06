const Piece = require('../src/server/Piece');
const Board = require('../src/server/Board');
const should = require('chai').should();
const expect = require('chai').expect;

describe('Piece', () => {
	var piece = Piece.generate('T');
	var board = new Board();
	board.init(10, 20);

	describe('generate', () => {
		it('throws error if arg is not capital letter', () => {
			expect(() => Piece.generate(1)).to.throw;
		})
		it('returns a Piece', () => {
			var res = Piece.generate('T');
			expect(res).to.be.an.instanceof(Piece);
		})
	})

	describe('collide', () => {
		it('returns true if x >= board width', () => {
			piece.pos.x = 10;
			piece.pos.y = 5;
			var res = Piece.collide(piece, board);
			res.should.be.true;
		})
		it('returns true if x < 0', () => {
			piece.pos.x = -1;
			piece.pos.y = 5;
			var res = Piece.collide(piece, board);
			res.should.be.true;
		})
		it('returns true if y >= board height - 1', () => {
			piece.pos.x = 5;
			piece.pos.y = 19;
			var res = Piece.collide(piece, board);
			res.should.be.true;
		})
		it('returns false otherwise', () => {
			piece.pos.x = 5;
			piece.pos.y = 5;
			var res = Piece.collide(piece, board);
			res.should.be.false;
		})
	})

	piece2 = Piece.generate('T');
	piece2.pos.x = 0;
	piece2.pos.y = 0;
	describe('get min x related to blocks', () => {
		it('returns 0 for T piece', () => {
			let res = Piece.getMinX(piece2);
			res.should.equal(0);
		});
	})

	describe('get max x related to blocks', () => {
		it('returns 2 for T piece', () => {
			let res = Piece.getMaxX(piece2);
			res.should.equal(2);
		});
	})

	describe('get min y related to blocks', () => {
		it('returns 1 for T piece', () => {
			let res = Piece.getMinY(piece2);
			res.should.equal(1);
		});
	})

	describe('get max y related to blocks', () => {
		it('returns 2 for T piece', () => {
			let res = Piece.getMaxY(piece2);
			res.should.equal(2);
		});
	})

	describe('moving left', () => {
		it('change posx to posx - 1', () => {
			let old = piece.pos.x;
			piece.moveLeft();
			piece.pos.x.should.equal(old - 1);
		});
	})

	describe('moving right', () => {
		it('change posx to posx + 1', () => {
			let old = piece.pos.x;
			piece.moveRight();
			piece.pos.x.should.equal(old + 1);
		});
	})

	describe('going down', () => {
		it('change posy to posy + 1', () => {
			let old = piece.pos.y;
			piece.goDown();
			piece.pos.y.should.equal(old + 1);
		});
	})

});