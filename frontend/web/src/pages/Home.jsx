// src/pages/Home.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const { contract } = useContext(Web3Context);

  const loadArticles = async () => {
    try {
      const allArticles = await contract.getAllArticles();
      setArticles(allArticles);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    if (contract) {
      loadArticles();
    }
  }, [contract]);

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">All Published Articles</h1>
      {articles.length === 0 ? (
        <p>No articles published yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {articles.map((article, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded">
              <h2 className="text-xl font-bold">Article ID: {article.id.toString()}</h2>
              <p>Author: {article.author}</p>
              <p>Metadata URI: {article.metadataURI}</p>
              <p>Timestamp: {new Date(article.timestamp.toNumber() * 1000).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
