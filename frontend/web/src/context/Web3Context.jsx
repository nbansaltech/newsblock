// src/context/Web3Context.jsx
import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    const isInstalled = typeof window.ethereum !== 'undefined';
    console.log(`MetaMask Installed: ${isInstalled}`);
    return isInstalled;
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (isMetaMaskInstalled()) {
      try {
        console.log('Requesting MetaMask accounts...');

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (accounts.length > 0) {
          setAccount(ethers.utils.getAddress(accounts[2]));
          console.log(`Connected account: ${accounts[2]}`);
        } else {
          console.log('No accounts found');
        }

      } catch (error) {
        if (error.code === 4001) {
          // User rejected request
          console.error('Connection request was rejected by the user.');
        } else {
          // Other errors
          console.error('Error connecting to MetaMask:', error);
        }
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this app.');
      console.log('MetaMask is not installed.');
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(ethers.utils.getAddress(accounts[0]));
          console.log(`Account changed: ${accounts[0]}`);
        } else {
          setAccount(null);
          console.log('No accounts connected.');
        }
      });
    }
  }, []);
  useEffect(() => {
    if (account && typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);
    }
  }, [account]);
  return (
    <Web3Context.Provider value={{ account, connectWallet, isMetaMaskInstalled , contract}}>
      {children}
    </Web3Context.Provider>
  );
};
