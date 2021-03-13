const Board = require('../src/server/Board');
const Piece = require('../src/server/Piece');
const should = require('chai').should();
const expect = require('chai').expect;

describe('Board', () => {

	let board;
	beforeEach(function() {
		board = new Board(10, 20);
	})

	describe('setPieces', () => {
		beforeEach(function() {
			board.setPieces('T', 'I');
		})
		it('sets fallingPiece to Piece', () => {
			expect(board.fallingPiece).to.be.an.instanceof(Piece);
		})
		it('sets nextPiece to Piece', () => {
			expect(board.nextPiece).to.be.an.instanceof(Piece);
		})
		it('sets needPiece to false', () => {
			board.needPiece.should.be.false;
		})
	})

	describe('removeFilledLines', () => {
		it('removes filled lines', () => {
			for(let i = 0; i < board.w; i++) {
				board.boardMap[2][i] = 1;
			}
			board.removeFilledLines();
			for(let i = 0; i < board.w; i++) {
				board.boardMap[2][i].should.equal(0);
			}
		});
	})

	describe('addExtraLines', function() {
		beforeEach(function() {
			for (let i = 0; i < board.w; i++) {
				board.boardMap[0][i] = 0;
			}
			for (let i = 0; i < board.w; i++) {
				board.boardMap[1][i] = 1;
			}
			for (let i = 0; i < board.w; i++) {
				board.boardMap[2][i] = 2;
			}
			for (let i = 0; i < board.w; i++) {
				board.boardMap[3][i] = 3;
			}
		})
		it('adds 2 grey lines', function() {
			board.addExtraLines(2);
			for (let i = 0; i < board.w; i++) {
				board.boardMap[board.h - 1][i].should.equal(9);
			}
			for (let i = 0; i < board.w; i++) {
				board.boardMap[board.h - 2][i].should.equal(9);
			}
			for (let i = 0; i < board.w; i++) {
				board.boardMap[board.h - 3][i].should.equal(0);
			}
			for (let i = 0; i < board.w; i++) {
				board.boardMap[0][i].should.equal(2);
			}
		})
		it('adds 3 grey lines', function() {
			board.addExtraLines(3);
			for (let i = 0; i < board.w; i++) {
				board.boardMap[board.h - 1][i].should.equal(9);
			}
			for (let i = 0; i < board.w; i++) {
				board.boardMap[board.h - 2][i].should.equal(9);
			}
			for (let i = 0; i < board.w; i++) {
				board.boardMap[board.h - 3][i].should.equal(9);
			}
			for (let i = 0; i < board.w; i++) {
				board.boardMap[0][i].should.equal(3);
			}
		})
	})


});