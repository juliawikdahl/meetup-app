
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import MeetupList from './components/MeetupList';
import MeetupDetail from './components/MeetupDetail';
import MyMeetups from './components/MyMeetups';
import MyPastMeetups from './components/MyPastMeetups';
import './styles/App.css'; 

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/meetups" element={<MeetupList />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/meetups/:id" element={<MeetupDetail />} />
          <Route path="/my-meetups" element={<MyMeetups />} />
          <Route path="/my-meetups/past" element={<MyPastMeetups />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
