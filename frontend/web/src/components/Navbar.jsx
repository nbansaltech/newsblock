// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';

const Navbar = () => {
  const { account, connectWallet } = useContext(Web3Context);

  return (
    <nav className="bg-surface p-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-2xl font-bold text-primary">
        TrustLens
      </Link>
      <div className="flex items-center">
        {account ? (
          <span className="mr-4 text-secondary">
            {account.substring(0, 6)}...{account.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            className="mr-4 bg-primary hover:bg-secondary text-black font-bold py-2 px-4 rounded"
          >
            Connect Wallet
          </button>
        )}
        <Link to="/register-journalist" className="mr-4 hover:text-secondary">
          Register
        </Link>
        <Link to="/publish-article" className="mr-4 hover:text-secondary">
          Publish
        </Link>
        <Link to="/my-articles" className="hover:text-secondary">
          My Articles
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
