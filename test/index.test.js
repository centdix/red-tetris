const Board = require('../src/server/Board');
const Piece = require('../src/server/Piece');
const should = require('chai').should();
const expect = require('chai').expect;

const http = require('http').Server(app);
const io = require('socket.io')(http);
const io-client = require('socket.io-client');

describe('socket test', () => {
	beforeEach(() => {
		const server = http.listen(8080);
		const client = socketIOClient();
	});

	afterEach(() => {
		server.close();
		client.close();
	})
})
