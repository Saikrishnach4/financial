import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import Dashboard from './components/dashboard';
import api from './api';

const App = () => {


  return (
    <Router>
      <Routes>
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/"
          element={<Dashboard />}
        />
      </Routes>
    </Router>
  );
};

export default App;
