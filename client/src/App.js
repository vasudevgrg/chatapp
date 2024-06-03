import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import io from "socket.io-client";
import Chat from './pages/chat';

const socket = io.connect('http://localhost:5002');

function App() {
  const [username, setUsername] = React.useState('');
  const [room, setRoom] = React.useState(''); 
  return (
 <>
  <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={ <Home
                username={username} // Add this
                setUsername={setUsername} // Add this
                room={room} // Add this
                setRoom={setRoom} // Add this
                socket={socket} // Add this
              />
            }
          />
           <Route
            path='/chat'
            element={<Chat username={username} room={room} socket={socket} />}
          />
        </Routes>
      </div>
    </Router>
 </>
  );
}

export default App;
