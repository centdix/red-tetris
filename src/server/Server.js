'use strict';

const Player = require('./Player.js');
const Game = require('./Game.js');
const Board = require('./Board.js');
const EVENTS = require('../common/Events.js');

class Server {
	constructor(io) {
		this.io = io;
		this.games = [];
		this.players = [];
		this.intervals = {};
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
			socket.on(EVENTS['LOGIN'], (login, callback) => {
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
				callback({
					status: 'ok'
				});
			})

			socket.on(EVENTS['GET_ROOMS'], (data) => {
				socket.emit('games', this.games.map(g => g.getInfo()));
			})

			socket.on(EVENTS['CREATE_ROOM'], (room, mode, callback) => {
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
				const game = new Game(p, room, mode);
				this.games.push(game);
				socket.broadcast.emit('games', this.games.map(g => g.getInfo()));
				this.io.to(room).emit('gameState', game.getInfo());
				callback({
					status: 'ok'
				});
			})

			socket.on(EVENTS['JOIN_ROOM'], (room, callback) => {
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
					game.start();
					this.io.emit('games', this.games.map(g => g.getInfo()));
					this.intervals[game.room] = setInterval(() => {
						game.updateState();
						this.io.to(game.room).emit('gameState', game.getInfo());
						if (game.status === 'finished') {
							clearInterval(this.intervals[game.room]);
							this.io.emit('games', this.games.map(g => g.getInfo()));
						}
					}, 60);
				}
			})

			socket.on(EVENTS['GO_RIGHT'], () => {
				const p = this.players.find(p => p.id === socket.id) 
				p.board.addInput(EVENTS['GO_RIGHT']);
			})

			socket.on(EVENTS['GO_LEFT'], () => {
				const p = this.players.find(p => p.id === socket.id) 
				p.board.addInput(EVENTS['GO_LEFT']);
			})

			socket.on(EVENTS['GO_DOWN'], () => {
				const p = this.players.find(p => p.id === socket.id) 
				p.board.addInput(EVENTS['GO_DOWN']);
			})

			socket.on(EVENTS['ROTATE'], () => {
				const p = this.players.find(p => p.id === socket.id) 
				p.board.addInput(EVENTS['ROTATE']);
			})

			socket.on('disconnect', (reason) => {
				const p = this.players.find(p => p.id === socket.id);
				if (typeof(p) !== 'undefined') {
					const game = this.games.find(g => g.room === p.room);
					if (typeof(game) !== 'undefined') {
						this.removePlayerFromGame(game, p);
						this.io.emit('games', this.games.map(g => g.getInfo()));
					}
					const index = this.players.indexOf(p);
					this.players.splice(index, 1);
				}
			})
		})
	}
}

module.exports = Server;