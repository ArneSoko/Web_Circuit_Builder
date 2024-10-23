import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import Index from './pages';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={ <Index /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
