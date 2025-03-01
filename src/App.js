import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Landing from './pages/Landing';  
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/common/ThemeToggle';
import UserPortal from './pages/UserPortal';
import PasswordReset from './pages/PasswordReset';
import HomePage from './pages/HomePage'; // Import the new component

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/user-portal" element={<UserPortal />} />
          <Route path="/reset-password" element={<PasswordReset />} /> 
          {/* Add more routes as needed */}
        </Routes>
        <ThemeToggle />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;