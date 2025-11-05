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
    <div className="min-h-screen bg-gradient-to-b from-background via-surface to-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-surface border border-primary/20 rounded-lg p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✍️</div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Register as Journalist
            </h1>
            <p className="text-gray-400">
              Join the blockchain-verified journalism community
            </p>
          </div>

          <div className="bg-surface-light border border-primary/10 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-primary mb-4">What You Get:</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-secondary mr-3">✓</span>
                <span>Verified identity stored permanently on the blockchain</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary mr-3">✓</span>
                <span>Ability to publish blockchain-verified articles</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary mr-3">✓</span>
                <span>Cryptographic proof of authorship for all your content</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary mr-3">✓</span>
                <span>Build trust and credibility with immutable records</span>
              </li>
            </ul>
          </div>

          {!account && (
            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 mb-6">
              <p className="text-secondary text-sm">
                ⚠️ Please connect your wallet first to register as a journalist.
              </p>
            </div>
          )}

          <button
            onClick={registerJournalist}
            disabled={!account}
            className="w-full bg-primary hover:bg-secondary text-black font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {account ? 'Register Now' : 'Connect Wallet First'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By registering, you agree to maintain ethical journalism standards
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterJournalist;
