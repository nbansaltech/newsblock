// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import RegisterJournalist from './pages/RegisterJournalist';
import PublishArticle from './pages/PublishArticle';
import MyArticles from './pages/MyArticles';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/register-journalist" element={<RegisterJournalist />} />
            <Route path="/publish-article" element={<PublishArticle />} />
            <Route path="/my-articles" element={<MyArticles />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
