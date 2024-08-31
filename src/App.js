// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MindmapPage from './pages/MindmapPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MindmapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
