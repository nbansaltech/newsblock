// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegisterJournalist from './pages/RegisterJournalist';
import PublishArticle from './pages/PublishArticle';
import MyArticles from './pages/MyArticles';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register-journalist" element={<RegisterJournalist />} />
          <Route path="/publish-article" element={<PublishArticle />} />
          <Route path="/my-articles" element={<MyArticles />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
