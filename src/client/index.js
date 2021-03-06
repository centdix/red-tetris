import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
import Header from './Components/Header';
import Chat from './Components/Chat';
import Main from './Components/Main';
import LoginPage from './Pages/LoginPage';

import './bulma.css';
import './index.css';

function App(props) {

  let initUser = {
    login: null,
    socket: props.socket,
    room: null
  }

  const [user, setUser] = useState(initUser);
  const [page, setPage] = useState('login');

  function handleGoBack() {
    switch (page) {
      case 'rooms':
        setUser(initUser);
        setPage('login');
        break ;
      case 'game':
        user.socket.emit('leaveRoom');
        setPage('rooms');
        break ;
      default:
    }
  }

  function handleLogin(login) {
    setUser({
      login: login,
      socket: props.socket,
      room: null,
    });
    setPage('rooms');
    user.socket.emit('login', login);
  }

  function handleRoomJoin(room) {
    user.socket.emit('joinRoom', room, (response) => {
      if (response.status === 'error') {
        alert(response.message);
      }
      else {
        setPage('game');
        const hash = room + '[' + user.login + ']';
        window.location.hash = hash;
      }
    });
  }

  function handleCreateRoom(room, mode) {
    setPage('game');
    user.socket.emit('createRoom', room, mode);
    const hash = room + '[' + user.login + ']';
    window.location.hash = hash;
  }

  let header = null;
  let chat = null;
  let main = <LoginPage onLogin={handleLogin}></LoginPage>;

  if (user.login) {
    header = <Header goBack={handleGoBack} user={user}></Header>;
    chat = <Chat user={user}></Chat>;
    main = <Main 
        page={page}
        user={user}
        onRoomJoin={handleRoomJoin}
        onCreateRoom={handleCreateRoom}
      ></Main>;
  }

  return (
    <div className="App">
      {header}
      {chat}
      {main}
    </div>
  );
}

// ========================================

const socket = socketIOClient();

ReactDOM.render(
  <App socket={socket}/>,
  document.getElementById('tetris')
);