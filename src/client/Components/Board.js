import React from 'react';
import './Board.css'

const colors = ['', '', 'red', 'green', 'yellow', 'purple', 'orange', 'blue', 'cyan'];

function Board(props) {

	function renderPiece(rows, piece, className) {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (piece.blocks[i][j]) {
					let a = piece.pos.y + i;
					let b = piece.pos.x + j;
					if (a >= 0 && b >= 0) {
						const key = a.toString() + b.toString();
						let cellClass = className + " filled " + piece.color;
						rows[a][b] = <div key={key} className={cellClass}></div>;
					}
				}
			}
		}
		return rows;
	}

	function renderBoard(board) {
		let rows = [];
		for (let i = 0; i < 20; i++) {
			rows[i] = new Array(10);
			for (let j = 0; j < 10; j++) {
				let cellClass = "Cell";
				const key = i.toString() + j.toString();
				if (board.boardMap[i][j]) {
					cellClass = "Cell filled " + colors[board.boardMap[i][j]]; 
				}
				rows[i][j] = <div key={key} className={cellClass}></div>;
			}
		}
		if (board.shadowPiece && props.player.login === props.user.login)
			rows = renderPiece(rows, board.shadowPiece, "Cell Shadow");
		rows = renderPiece(rows, board.fallingPiece, "Cell");
		let renderedBoard = rows.map((r, i) => {
			return (
				<div key={i} className="Row">
					{r}
				</div>
			);
		});
		return renderedBoard;
	}

	let boardClass = "Board";
	let nextPiece = null;
	let renderedBoard = null;
	let nextPieceRows = [];
	for (let i = 0; i < 4; i++) {
		nextPieceRows[i] = new Array(4);
		for (let j = 0; j < 4; j++) {
			const key = i.toString() + j.toString();
			nextPieceRows[i][j] = <div key={key} className="CellNP"></div>;
		}
	}

	if (props.player && props.player.board.status !== 'empty')
	{
		renderedBoard = renderBoard(props.player.board);
		let tmp = {...props.player.board.nextPiece};
		tmp.pos.x = 0;
		tmp.pos.y = 0;
		if (props.player.login === props.user.login) {
			boardClass = "UserBoard";
			nextPiece = renderPiece(nextPieceRows, tmp, "CellNP").map((r, i) => {
				return (
					<div key={i} className="RowNP">
						{r}
					</div>
				);
			});
			nextPiece = <div className="NextPiece">{nextPiece}</div>;
		}
	}

	return (
		<div className="BoardBox">
		    <div className={boardClass}>
		    	{renderedBoard}
		    </div>
	    	{nextPiece}
	    </div>
	);
}

export default Board;