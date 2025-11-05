import React, { useState, useContext } from 'react';
import { ethers } from 'ethers';
import OwnershipVerificationABI from '../OwnershipVerification.json';
import { Web3Context } from '../context/Web3Context';

const VerifyJournalist = () => {
  const [journalistAddress, setJournalistAddress] = useState('');
  const { account } = useContext(Web3Context);

  const contractAddress = '0x407125EE8a14f4488BB8551BCd47Dd1045F9Fd76'; // Replace with your contract address

  const verifyJournalist = async () => {
    if (!account) {
      alert('Please connect your wallet.');
      return;
    }

    if (!ethers.utils.isAddress(journalistAddress)) {
      alert('Invalid address.');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, OwnershipVerificationABI.abi, signer);

    try {
      const tx = await contract.verifyJournalist(journalistAddress);
      await tx.wait();
      alert('Journalist verified successfully.');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to verify journalist.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Verify Journalist</h1>
      <input
        type="text"
        placeholder="Journalist Address"
        value={journalistAddress}
        onChange={(e) => setJournalistAddress(e.target.value)}
        className="w-full p-2 mb-4 text-black"
      />
      <button
        onClick={verifyJournalist}
        className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
      >
        Verify
      </button>
    </div>
  );
};

export default VerifyJournalist;
