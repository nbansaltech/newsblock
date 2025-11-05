// src/pages/PublishArticle.jsx
import React, { useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';

const PublishArticle = () => {
  const [metadataURI, setMetadataURI] = useState('');
  const { account, contract } = useContext(Web3Context);

  const publishArticle = async () => {
    if (!account) {
      alert('Please connect your wallet.');
      return;
    }

    if (!metadataURI) {
      alert('Please enter the metadata URI.');
      return;
    }

    try {
      const tx = await contract.publishArticle(metadataURI);
      await tx.wait();
      alert('Article published successfully.');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to publish article.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-surface to-background p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-surface border border-primary/20 rounded-lg p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📝</div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Publish Article
            </h1>
            <p className="text-gray-400">
              Submit your content to the blockchain for permanent verification
            </p>
          </div>

          {!account && (
            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 mb-6">
              <p className="text-secondary text-sm">
                ⚠️ Please connect your wallet first to publish an article.
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-semibold text-primary mb-2">
              Metadata URI
            </label>
            <input
              type="text"
              placeholder="e.g., ipfs://QmX... or https://your-storage.com/article.json"
              value={metadataURI}
              onChange={(e) => setMetadataURI(e.target.value)}
              className="w-full p-4 bg-surface-light border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter the URI where your article metadata is stored (IPFS, Arweave, etc.)
            </p>
          </div>

          <div className="bg-surface-light border border-primary/10 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-primary mb-4">What Happens Next:</h3>
            <ol className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-secondary mr-3 font-bold">1.</span>
                <span>Your article will be linked to your verified journalist identity</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary mr-3 font-bold">2.</span>
                <span>The metadata URI will be stored permanently on the blockchain</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary mr-3 font-bold">3.</span>
                <span>A timestamp will be recorded proving when you published</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary mr-3 font-bold">4.</span>
                <span>Your article becomes part of the immutable record</span>
              </li>
            </ol>
          </div>

          <button
            onClick={publishArticle}
            disabled={!account || !metadataURI}
            className="w-full bg-primary hover:bg-secondary text-black font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            Publish to Blockchain
          </button>

          <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              💡 <strong>Pro Tip:</strong> Store your article content on IPFS or Arweave for 
              decentralized, permanent storage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishArticle;
