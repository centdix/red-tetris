'use strict';

const Player = require('./Player.js');
const Game = require('./Game.js');
const Board = require('./Board.js');

class Server {
	constructor(io) {
		this.io = io;
		this.games = [];
		this.players = [];
	}

	removePlayerFromGame(game, player) {
		game.removePlayer(player);
		if (game.players.length === 0) {
			const index = this.games.indexOf(game);
			this.games.splice(index, 1);
		}
	}

	connect() {

		this.io.on('connection', (socket) => {
			// console.log('user connection');
			socket.on('login', (login, callback) => {
				if (typeof(login) !== 'string') {
					callback({
						status: 'error',
						message: 'Invalid data type'
					});
					return ;
				}
				if (login.length < 1) {
					callback({
						status: 'error',
						message: 'Username can\'t be empty'
					});
					return ;
				}
				const usernameTaken = this.players.find(p => p.login === login);
				if (typeof(usernameTaken) !== 'undefined') {
					callback({
						status: 'error',
						message: 'Username is already taken'
					});
					return ;
				}
				const p = new Player(socket.id, login);
				this.players.push(p);
				const msg = login + " just joined !";
				this.io.emit('chatMsg', msg);
				callback({
					status: 'ok'
				});
			})

			socket.on('clientMsg', (msg, callback) => {
				const p = this.players.find(p => p.id === socket.id);
				if (typeof(p) === 'undefined') {
					callback({
						status: 'error',
						message: 'User is not logged in'
					});
					return ;
				}
				if (typeof(msg) !== 'string') {
					callback({
						status: 'error',
						message: 'Invalid data type'
					});
					return ;
				}
				if (msg.length < 1) {
					callback({
						status: 'error',
						message: 'Message can\'t be empty'
					});
					return ;
				}
				const message = p.login + ": " + msg;
				this.io.emit('chatMsg', message);
				callback({
					status: 'ok'
				})
			})

			socket.on('getRooms', (data) => {
				socket.emit('games', this.games.map(g => g.getInfo()));
			})

			socket.on('createRoom', (room, mode, callback) => {
				const p = this.players.find(p => p.id === socket.id)
				if (typeof(p) === 'undefined') {
					callback({
						status: 'error',
						message: 'User is not logged in'
					});
					return ;
				}
				if (typeof(room) !== 'string' || typeof(mode) !== 'string') {
					callback({
						status: 'error',
						message: 'Invalid data type'
					});
					return ;
				}
				if (room.length < 1) {
					callback({
						status: 'error',
						message: 'Room name can\'t be empty'
					});
					return ;
				}
				if (mode !== 'Public' && mode !== 'Private') {
					callback({
						status: 'error',
						message: 'Room mode must be private or public'
					});
					return ;
				}
				if (p.room) {
					callback({
						status: 'error',
						message: 'You are already in a room'
					});
					return ;
				}
				p.setRoom(room);
				socket.join(room);
				const game = new Game(this.io, p, room, mode);
				this.games.push(game);
				socket.broadcast.emit('games', this.games.map(g => g.getInfo()));
				this.io.to(room).emit('gameState', game.getInfo());
				callback({
					status: 'ok'
				});
			})

			socket.on('joinRoom', (room, callback) => {
				const p = this.players.find(p => p.id === socket.id)
				if (typeof(p) === 'undefined') {
					callback({
						status: 'error',
						message: 'User is not logged in'
					});
					return ;
				}
				const game = this.games.find(g => g.room === room);
				if (typeof(game) === 'undefined') {
					callback({
						status: 'error',
						message: 'Room doesn\'t exist'
					});
					return ;
				}
				if (game.mode === 'Private' && p.id !== game.owner.id) {
					callback({
						status: 'error',
						message: 'This room is private'
					})
					return ;
				}
				if (p.room && p.room !== room) {
					callback({
						status: 'error',
						message: 'You are already in a room'
					})
					return ;
				}
				if (game.status === 'running') {
					callback({
						status: 'error',
						message: 'This game has already started'
					})
					return ;
				}
				if (game.players.indexOf(p) === -1) {
					socket.join(room);
					p.setRoom(room);
					game.addPlayer(p);
					const msg = p.login + " joined " + room;
					this.io.emit('chatMsg', msg);
				}
				this.io.to(room).emit('gameState', game.getInfo());
				callback({
					status: 'ok'
				});
			})

			socket.on('getGameData', () => {
				const p = this.players.find(p => p.id === socket.id) 
				const game = this.games.find(g => g.room === p.room);
				socket.emit('gameState', game.getInfo());
			})

			socket.on('leaveRoom', () => {
				const p = this.players.find(p => p.id === socket.id) 
				const game = this.games.find(g => g.room === p.room);
				const prevLength = this.games.length;
				if (game) {
					this.removePlayerFromGame(game, p);
					if (this.games.length < prevLength)
						this.io.emit('games', this.games.map(g => g.getInfo()));
				}
				this.io.to(p.room).emit('gameState', game.getInfo());
				socket.leave(p.room);
				p.setRoom(null);
			})

			socket.on('startGame', () => {
				console.log('starting game');
				const p = this.players.find(p => p.id === socket.id) 
				const game = this.games.find(g => g.room === p.room);
				if (game && game.owner.id === socket.id) {
					const msg = p.login + " started a game !";
					this.io.emit('chatMsg', msg);
					game.start();
				}
			})

			socket.on('goRight', () => {
				const p = this.players.find(p => p.id === socket.id) 
				p.board.movePieceRight();
			})

			socket.on('goLeft', () => {
				const p = this.players.find(p => p.id === socket.id) 
				p.board.movePieceLeft();
			})

			socket.on('rotate', () => {
				const p = this.players.find(p => p.id === socket.id) 
				p.board.rotatePiece();
			})

			socket.on('goDown', () => {
				const p = this.players.find(p => p.id === socket.id) 
				p.board.speedUpPiece();
			})

			socket.on('disconnect', (reason) => {
				const p = this.players.find(p => p.id === socket.id);
				if (typeof(p) !== 'undefined') {
					const game = this.games.find(g => g.room === p.room);
					if (typeof(game) !== 'undefined') {
						this.removePlayerFromGame(game, p);
						this.io.emit('games', this.games.map(g => g.getInfo()));
					}
					const msg = p.login + " just left.";
					this.io.emit('chatMsg', msg);
					const index = this.players.indexOf(p);
					this.players.splice(index, 1);
				}
			})
		})
	}
}

module.exports = Server;