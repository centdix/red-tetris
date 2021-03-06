const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const Player = require('./Player.js');
const Game = require('./Game.js');
const Board = require('./Board.js');

let players = [];
let games = [];

function removePlayerFromGame(games, game, player) {
  game.removePlayer(player);
  if (game.players.length === 0) {
    const index = games.indexOf(game);
    games.splice(index, 1);
  }
}

app.use(express.static(path.join(__dirname, '../../build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '../../../index.html'));
});

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('login', (data) => {
    console.log('user logged');
    const login = data;
    const p = new Player(socket.id, login);
    players.push(p);
    const msg = login + " just joined !";
    io.emit('chatMsg', msg);
  })

  socket.on('clientMsg', (data) => {
    const p = players.find(p => p.id === socket.id)
    if (p) {
      const msg = p.login + ": " + data;
      io.emit('chatMsg', msg);    
    }
  })

  socket.on('getRooms', (data) => {
    socket.emit('games', games.map(g => g.getInfo()));
  })

  socket.on('createRoom', (room, mode) => {
    const p = players.find(p => p.id === socket.id)
    p.setRoom(room);
    socket.join(room);
    const game = new Game(io, p, room, mode);
    games.push(game);
    socket.broadcast.emit('games', games.map(g => g.getInfo()));
    io.to(room).emit('gameState', game.getInfo());
  })

  socket.on('joinRoom', (room, callback) => {
    const p = players.find(p => p.id === socket.id)
    if (p) {
      const game = games.find(g => g.room === room);
      if (game.mode === 'Private' && p.id !== game.owner.id) {
        callback({
          status: 'error',
          message: 'This room is private'
        })
        return ;
      }
      if (game.players.indexOf(p) === -1) {
        socket.join(room);
        p.setRoom(room);
        game.addPlayer(p);
        const msg = p.login + " joined " + room;
        io.emit('chatMsg', msg);
      }
      callback({
        status: 'ok'
      });
      io.to(room).emit('gameState', game.getInfo());
    }
  })

  socket.on('getGameData', () => {
    const p = players.find(p => p.id === socket.id) 
    const game = games.find(g => g.room === p.room);
    socket.emit('gameState', game.getInfo());
  })

  socket.on('leaveRoom', () => {
    const p = players.find(p => p.id === socket.id) 
    const game = games.find(g => g.room === p.room);
    const prevLength = games.length;
    if (game) {
      removePlayerFromGame(games, game, p);
      if (games.length < prevLength)
        io.emit('games', games.map(g => g.getInfo()));
    }
    io.to(p.room).emit('gameState', game.getInfo());
    socket.leave(p.room);
    p.setRoom(null);
  })

  socket.on('startGame', () => {
    console.log('starting game');
    const p = players.find(p => p.id === socket.id) 
    const game = games.find(g => g.room === p.room);
    if (game && game.owner.id === socket.id) {
      const msg = p.login + " started a game !";
      io.emit('chatMsg', msg);
      game.start();
    }
  })

  socket.on('stopGame', (data) => {
    console.log('stopping game');
    const p = players.find(p => p.id === socket.id) 
    const game = games.find(g => g.owner.id === p.id);
    if (game) {
      const msg = p.login + " stopped a game !";
      io.emit('chatMsg', msg);
      game.stop();
    }
  })

  socket.on('goRight', () => {
    const p = players.find(p => p.id === socket.id) 
    p.board.movePieceRight();
  })

  socket.on('goLeft', () => {
    const p = players.find(p => p.id === socket.id) 
    p.board.movePieceLeft();
  })

  socket.on('rotate', () => {
    const p = players.find(p => p.id === socket.id) 
    p.board.rotatePiece();
  })

  socket.on('goDown', () => {
    const p = players.find(p => p.id === socket.id) 
    p.board.speedUpPiece();
  })

  socket.on('disconnect', (reason) => {
    const p = players.find(p => p.id === socket.id)
    const game = games.find(g => g.room === p.room);
    const prevLength = games.length;
    if (p) {
      const msg = p.login + " just left.";
      io.emit('chatMsg', msg);    
    }
    if (game) {
      removePlayerFromGame(games, game, p);
      if (games.length < prevLength)
        io.emit('games', games.map(g => g.getInfo()));
    }
  })
})

const port = process.env.PORT || 8080;
http.listen(port, () => {
  console.log(`listening on ${port}`);
});