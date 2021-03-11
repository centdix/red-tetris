import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socketIOClient from "socket.io-client";
import Header from './Components/Header';
import Main from './Components/Main';
import LoginPage from './Pages/LoginPage';
import EVENTS from '../common/Events.js';

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

  function showError(error) {
    toast.error(error, {
      autoClose: 2000,
      hideProgressBar: true,
      transition: Slide
    });
  }

  function handleGoBack() {
    switch (page) {
      case 'rooms':
        setUser(initUser);
        setPage('login');
        break ;
      case 'game':
        user.socket.emit(EVENTS['LEAVE_ROOM']);
        setPage('rooms');
        break ;
      default:
    }
  }

  function handleLogin(login) {
    user.socket.emit(EVENTS['LOGIN'], login, (response) => {
      if (response.status === 'error') {
        showError(response.message);
      }
      else {
        setUser({
          login: login,
          socket: props.socket,
          room: null,
        });
        setPage('rooms');
      }
    });
  }

  function handleRoomJoin(room) {
    user.socket.emit(EVENTS['JOIN_ROOM'], room, (response) => {
      if (response.status === 'error') {
        showError(response.message);
      }
      else {
        setPage('game');
        const hash = room + '[' + user.login + ']';
        window.location.hash = hash;
      }
    });
  }

  function handleCreateRoom(room, mode) {
    user.socket.emit(EVENTS['CREATE_ROOM'], room, mode, (response) => {
      if (response.status === 'error') {
        showError(response.message);
      }
      else {
        setPage('game');
        const hash = room + '[' + user.login + ']';
        window.location.hash = hash;        
      }
    });
  }

  let header = null;
  let main = <LoginPage onLogin={handleLogin}></LoginPage>;

  if (user.login) {
    header = <Header goBack={handleGoBack} user={user}></Header>;
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
      {main}
      <ToastContainer />
    </div>
  );
}

// ========================================

let socket;

// socket = socketIOClient();
socket = socketIOClient("http://localhost:3000");

ReactDOM.render(
  <App socket={socket}/>,
  document.getElementById('tetris')
);