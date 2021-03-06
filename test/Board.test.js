const Board = require('../src/server/Board');
const Piece = require('../src/server/Piece');
const should = require('chai').should();
const expect = require('chai').expect;

describe('Board', () => {

	describe('init', () => {
		var board = new Board();
		board.init(10, 20);
		it('sets width', () => {
			board.w.should.equal(10);
		});
		it('sets height', () => {
			board.h.should.equal(20);
		});
		it('sets fallingPiece to null', () => {
			expect(board.fallingPiece).to.be.null;
		});
		it('sets nextPiece to null', () => {
			expect(board.nextPiece).to.be.null;
		});
		it('sets pieceIndex to 0', () => {
			board.pieceIndex.should.equal(0);
		});
		it('sets needPiece to false', () => {
			expect(board.needPiece).to.be.false;
		});
		it('sets status to empty', () => {
			board.status.should.equal('empty');
		});
		it('sets boardmap to width x height', () => {
			board.boardMap.should.have.lengthOf(board.h);
			for (let i = 0; i < board.h; i++) {
				board.boardMap[i].should.have.lengthOf(board.w);
			}
		});
	})

	describe('setPieces', () => {
		var board = new Board();
		board.init(10, 20);
		board.setPieces('T', 'I');
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
			var board = new Board();
			board.init(10, 20);
			for(let i = 0; i < board.w; i++) {
				board.boardMap[2][i] = 1;
			}
			board.removeFilledLines();
			for(let i = 0; i < board.w; i++) {
				board.boardMap[2][i].should.equal(0);
			}
		});
	})


});