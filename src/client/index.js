import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socketIOClient from "socket.io-client";
import Header from './Components/Header';
import Main from './Components/Main';
import LoginPage from './Pages/LoginPage';
import EVENTS from '../common/Events.js';

import '../../node_modules/bulma/css/bulma.css';
import '../../node_modules/bulma-switch/dist/css/bulma-switch.min.css';
import './index.css';

function App(props) {

  let initUser = {
    login: null,
    socket: props.socket,
    room: null
  }

  const [user, setUser] = useState(initUser);
  const [page, setPage] = useState('login');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    let regex = /#[A-Z]+\[[A-Z]+\]/gi;
    let hash = window.location.hash;
    let match = hash.match(regex);
    if (match && match.length === 1) {
      socket.emit(EVENTS['DIRECT_LINK'], hash, (response) => {
        if (response.status === 'error') {
          showError(response.message);
        }
        else {
          setUser({
            login: response.login,
            socket: props.socket,
            room: response.room,
          });
          setPage('game');
        }
      });
    }
  }, []);

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
        user.socket.emit(EVENTS['LOGOUT'], (response) => {
          if (response.status === 'error') {
            showError(response.message);
          }
          else {
            setUser(initUser);
            setPage('login');
          }
        });
        break ;
      case 'game':
        user.socket.emit(EVENTS['LEAVE_ROOM'], (response) => {
          if (response.status === 'error') {
            showError(response.message);
          }
          else {
            window.location.hash = "";
            setPage('rooms');
          }
        });
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

  function handleDarkModeSwitch() {
    setDarkMode(!darkMode);
  }

  let header = null;
  let main = <LoginPage onLogin={handleLogin} onSwitch={handleDarkModeSwitch} switchValue={darkMode}></LoginPage>;

  if (user.login) {
    header = <Header goBack={handleGoBack} user={user}></Header>;
    main = <Main 
        page={page}
        user={user}
        onRoomJoin={handleRoomJoin}
        onCreateRoom={handleCreateRoom}
      ></Main>;
  }

  let appClass = darkMode ? "App Dark" : "App"

  return (
    <div className={appClass}>
      {header}
      {main}
      <ToastContainer />
    </div>
  );
}

// ========================================

let socket;

socket = socketIOClient();
// socket = socketIOClient("http://localhost:3000");

ReactDOM.render(
  <App socket={socket}/>,
  document.getElementById('tetris')
);