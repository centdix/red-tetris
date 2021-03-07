const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const Server = require('./Server.js');

let io;

if (typeof(process.env.PORT) !== 'undefined') {
	//prod
	io = require('socket.io')(http);
}
else {
	//dev
	io = require('socket.io')(http, {
		cors: {
    		origin: "http://localhost:8080",
    		methods: ["GET", "POST"]
  		}
	});
}

const server = new Server(io);
server.connect();

app.use(express.static(path.join(__dirname, '../../build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '../../../index.html'));
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`listening on ${port}`);
});