// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';

const Navbar = () => {
  const { account, connectWallet } = useContext(Web3Context);

  return (
    <nav className="bg-surface p-4 flex justify-between items-center shadow-lg border-b border-primary/20">
      <Link to="/" className="text-2xl font-bold text-primary hover:text-secondary transition-colors">
        TrustLens
      </Link>
      <div className="flex items-center space-x-2">
        <Link to="/about" className="mr-2 hover:text-primary transition-colors px-3 py-2 rounded">
          About
        </Link>
        <Link to="/register-journalist" className="mr-2 hover:text-primary transition-colors px-3 py-2 rounded">
          Register
        </Link>
        <Link to="/publish-article" className="mr-2 hover:text-primary transition-colors px-3 py-2 rounded">
          Publish
        </Link>
        <Link to="/my-articles" className="mr-4 hover:text-primary transition-colors px-3 py-2 rounded">
          My Articles
        </Link>
        {account ? (
          <span className="bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded font-mono text-sm">
            {account.substring(0, 6)}...{account.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-primary hover:bg-secondary text-black font-bold py-2 px-6 rounded transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
