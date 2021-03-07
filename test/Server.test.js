const should = require('chai').should();
const expect = require('chai').expect;
const io = require('socket.io');
const ioClient = require('socket.io-client');
const Server = require('../src/server/Server');

describe('Server socket', function() {

	let server;
	let client;
	let otherClients = [];
	const url = "http://localhost:8080";
	const options = {
	    transports: ['websocket'],
	    'force new connection': true,
	};

	before(function() {
		listener = io().listen(8080);
		server = new Server(listener);
		server.connect();		
	})

	beforeEach(function() {
		client = ioClient(url, options);
	});

	afterEach(function() {
		client.close();
		otherClients.forEach((c) => {
			c.close();
		});
	});

	after(function() {
		listener.close();
	})

	describe('on login', function() {
		it('should send error on empty username', function(done) {
			client.on('connect', () => {
				client.emit('login', '', (response) => {
					response.status.should.equal('error');
					done();
				});
			})
		})
		it('should send error on invalid data type', function(done) {
			client.on('connect', () => {
				client.emit('login', 234, (response) => {
					response.status.should.equal('error');
					done();
				});
			})
		})
		it('should send error if username is already taken', function(done) {
			client.on('connect', () => {
				client.emit('login', 'test', (response) => {
					response.status.should.equal('ok');
					server.players.should.have.lengthOf(1);
					otherClients[0] = ioClient(url, options);
					otherClients[0].on('connect', () => {
						client.emit('login', 'test', (response) => {
							response.status.should.equal('error');
							done();
						});
					});
				});
			})
		})
		it('should create player on valid username', function(done) {
			client.on('connect', () => {
				client.emit('login', 'test', (response) => {
					response.status.should.equal('ok');
					server.players.should.have.lengthOf(1);
					done();		
				});
			})
		})
	});

	describe('on chat message', function() {
		it('should send error on not logged user', function(done) {
			client.on('connect', () => {
				client.emit('clientMsg', 'fwefe', (response) => {
					response.status.should.equal('error');
					done();		
				});
			})
		})
		it('should send error on empty message', function(done) {
			client.on('connect', () => {
				client.emit('login', 'test', (response) => {
					client.emit('clientMsg', '', (response) => {
						response.status.should.equal('error');
						done();		
					});
				});
			})
		})
		it('should send error on invalid data type', function(done) {
			client.on('connect', () => {
				client.emit('login', 'test', (response) => {
					client.emit('clientMsg', 314, (response) => {
						response.status.should.equal('error');
						done();		
					});
				});
			})
		})
	})

	describe('on create room', function() {
		it('should send error on not logged user', function(done) {
			client.on('connect', () => {
				client.emit('createRoom', 'test', 'Public', (response) => {
					response.status.should.equal('error');
					done();		
				});
			})
		})
		it('should send error if room is invalid', function(done) {
			client.on('connect', () => {
				client.emit('login', 'test', (response) => {
					client.emit('createRoom', 123, 'Public', (response) => {
						response.status.should.equal('error');
						done();		
					});
				});
			})
		})
		it('should send error if room name is empty', function(done) {
			client.on('connect', () => {
				client.emit('login', 'test', (response) => {
					client.emit('createRoom', '', 'Public', (response) => {
						response.status.should.equal('error');
						done();		
					});
				});
			})
		})
		it('should send error if mode is invalid', function(done) {
			client.on('connect', () => {
				client.emit('login', 'test', (response) => {
					client.emit('createRoom', 'test', 'test', (response) => {
						response.status.should.equal('error');
						done();		
					});
				});
			})
		})
		it('should send error if user is already in an other room', function(done) {
			client.on('connect', () => {
				client.emit('login', 'test', (response) => {
					client.emit('createRoom', 'caca', 'Public', (response) => {
						response.status.should.equal('ok');
						server.games.should.have.lengthOf(1);
						client.emit('createRoom', 'test', 'Public', (response) => {
							response.status.should.equal('error');
							server.games.should.have.lengthOf(1);
							done();
						});
					});
				})
			})
		})
		it('should create game otherwise', function(done) {
			client.on('connect', () => {
				client.emit('login', 'test', (response) => {
					client.emit('createRoom', 'test', 'Public', (response) => {
						response.status.should.equal('ok');
						done();		
					});
				});
			})
		})
	})

	describe('on room join', function() {
		beforeEach(function(done) {
			client.on('connect', () => {
				client.emit('login', 'test', (response) => {
					client.emit('createRoom', 'test', 'Public', (response) => {
						done();
					})
				})
			})
		})
		it('should send error on not logged user', function(done) {
			otherClients[0] = ioClient(url, options);
			otherClients[0].on('connect', () => {
				otherClients[0].emit('joinRoom', 'test', (response) => {
					response.status.should.equal('error');
					done();		
				});
			})
		})
		it('should send error if room doesn\'t exist', function(done) {
			otherClients[0] = ioClient(url, options);
			otherClients[0].on('connect', () => {
				otherClients[0].emit('login', 'bob', (response) => {
					otherClients[0].emit('joinRoom', 'caca', (response) => {
						response.status.should.equal('error');
						done();		
					});
				})
			})
		})
		it('should send error if user is already in an other room', function(done) {
			otherClients[0] = ioClient(url, options);
			otherClients[0].on('connect', () => {
				otherClients[0].emit('login', 'bob', (response) => {
					otherClients[0].emit('createRoom', 'caca', 'Public', (response) => {
						response.status.should.equal('ok');
						server.games.should.have.lengthOf(2);
						client.emit('joinRoom', 'caca', (response) => {
							response.status.should.equal('error');
							done();
						});
					});
				})
			})
		})
		it('should send error if room is private', function(done) {
			otherClients[0] = ioClient(url, options);
			otherClients[0].on('connect', () => {
				otherClients[0].emit('login', 'bob', (response) => {
					otherClients[0].emit('createRoom', 'caca', 'Private', (response) => {
						response.status.should.equal('ok');
						otherClients[1] = ioClient(url, options);
						otherClients[1].on('connect', () => {
							otherClients[1].emit('login', 'jean', (response) => {
								otherClients[1].emit('joinRoom', 'caca', (response) => {
									response.status.should.equal('error');
									done();
								})
							})
						})
					});
				})
			})
		})
		it('should work otherwise', function(done) {
			otherClients[0] = ioClient(url, options);
			otherClients[0].on('connect', () => {
				otherClients[0].emit('login', 'bob', (response) => {
					otherClients[0].emit('joinRoom', 'test', (response) => {
						response.status.should.equal('ok');
						done();		
					});
				})
			})
		})
	})

	describe('on leave room', function() {

	})

	describe('on start game', function() {
		
	})

	describe('on client disconnect', function() {
		beforeEach(function(done) {
			client.on('connect', () => {
				client.emit('login', 'test', (response) => {
					client.emit('createRoom', 'test', 'Public', (response) => {
						done();
					})
				})
			})
		})

		it('should remove user from players', function(done) {
			client.close();
			setTimeout(() => {
				server.players.length.should.equal(0);
				done();
			}, 10);
		})
		it('should remove game room if user was only player', function(done) {
			client.close();
			setTimeout(() => {
				server.games.length.should.equal(0);
				done();
			}, 10);
		})
		it('should remove player from game if user was in game', function(done) {
			otherClients[0] = ioClient(url, options);
			otherClients[0].on('connect', () => {
				otherClients[0].emit('login', 'bob', (response) => {
					otherClients[0].emit('joinRoom', 'test', (response) => {
						server.games[0].players.should.have.lengthOf(2);
						otherClients[0].close();
						setTimeout(() => {
							server.games[0].players.should.have.lengthOf(1);
							done();
						}, 10);
					})
				})
			})
		})
	})

})
