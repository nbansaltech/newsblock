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
    <div className="min-h-screen bg-gradient-to-b from-background via-surface to-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Blockchain-Verified Articles
          </h1>
          <p className="text-gray-400 text-lg">
            Immutable, Transparent, and Trustworthy Journalism
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📰</div>
            <p className="text-xl text-gray-400">No articles published yet.</p>
            <p className="text-gray-500 mt-2">Be the first to publish blockchain-verified content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {articles.map((article, index) => (
              <div 
                key={index} 
                className="bg-surface border border-primary/20 p-6 rounded-lg hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-primary">
                    Article #{article.id.toString()}
                  </h2>
                  <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm font-semibold">
                    Verified
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <span className="text-secondary mr-2">👤</span>
                    <span className="font-semibold mr-2">Author:</span>
                    <span className="font-mono text-sm bg-surface-light px-2 py-1 rounded">
                      {article.author.substring(0, 10)}...{article.author.slice(-8)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <span className="text-primary mr-2">🔗</span>
                    <span className="font-semibold mr-2">Metadata URI:</span>
                    <span className="text-sm text-gray-400 truncate">
                      {article.metadataURI}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <span className="text-accent mr-2">⏰</span>
                    <span className="font-semibold mr-2">Published:</span>
                    <span className="text-sm">
                      {new Date(article.timestamp.toNumber() * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Stored on Ethereum Blockchain
                  </span>
                  <button className="text-primary hover:text-secondary text-sm font-semibold transition-colors">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
