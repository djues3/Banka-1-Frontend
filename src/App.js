import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/common/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* Add more routes as needed */}
        </Routes>
        <ThemeToggle />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;