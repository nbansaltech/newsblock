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
    <div className="p-8">
      <h1 className="text-2xl mb-4">Publish Article</h1>
      <input
        type="text"
        placeholder="Metadata URI (e.g., IPFS link)"
        value={metadataURI}
        onChange={(e) => setMetadataURI(e.target.value)}
        className="w-full p-2 mb-4 text-black"
      />
      <button
        onClick={publishArticle}
        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
      >
        Publish
      </button>
    </div>
  );
};

export default PublishArticle;
