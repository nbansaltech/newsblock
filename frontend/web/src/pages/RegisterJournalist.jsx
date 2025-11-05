// src/pages/RegisterJournalist.jsx
import React, { useContext } from 'react';
import { Web3Context } from '../context/Web3Context';

const RegisterJournalist = () => {
  const { account, contract } = useContext(Web3Context);

  const registerJournalist = async () => {
    if (!account) {
      alert('Please connect your wallet.');
      return;
    }

    try {
      const tx = await contract.registerJournalist();
      await tx.wait();
      alert('Registered as journalist successfully.');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to register.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Register as Journalist</h1>
      <button
        onClick={registerJournalist}
        className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
      >
        Register
      </button>
    </div>
  );
};

export default RegisterJournalist;
