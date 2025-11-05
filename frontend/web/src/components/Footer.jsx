// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-primary/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">TrustLens</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering truth in the digital age through blockchain-verified journalism, 
              AI-powered fake news detection, and decentralized content verification.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-secondary mb-4">Our Stack</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center">
                <span className="text-primary mr-2">→</span>
                <span>🤖 ML-Powered Fake News Detection</span>
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">→</span>
                <span>⛓️ Blockchain Authority Verification</span>
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">→</span>
                <span>📱 Cross-Platform Mobile App</span>
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">→</span>
                <span>🔌 Browser Extension Integration</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-secondary mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/register-journalist" className="text-gray-400 hover:text-primary transition-colors">
                  Register as Journalist
                </Link>
              </li>
              <li>
                <Link to="/publish-article" className="text-gray-400 hover:text-primary transition-colors">
                  Publish Article
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            <p className="flex items-center justify-center md:justify-start">
              Built with <span className="text-red-500 mx-1 text-lg">❤️</span> by 
              <span className="text-primary font-semibold ml-1">Nishant Bansal</span>
            </p>
          </div>
          <div className="text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} TrustLens. Decentralizing Truth.</p>
          </div>
        </div>

        {/* Tech Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-xs text-gray-500">
            <span>Powered by</span>
            <span className="text-primary">Ethereum</span>
            <span>•</span>
            <span className="text-secondary">React</span>
            <span>•</span>
            <span className="text-primary">Machine Learning</span>
            <span>•</span>
            <span className="text-secondary">Python</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
