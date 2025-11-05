// src/pages/MyArticles.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';

const MyArticles = () => {
  const [myArticles, setMyArticles] = useState([]);
  const { account, contract } = useContext(Web3Context);

  const loadMyArticles = async () => {
    if (!account) {
      alert('Please connect your wallet.');
      return;
    }

    try {
      const articleIds = await contract.getArticlesByJournalist(account);
      const articles = await Promise.all(
        articleIds.map(async (id) => {
          const article = await contract.getArticle(id);
          return article;
        })
      );
      setMyArticles(articles);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    if (contract) {
      loadMyArticles();
    }
  }, [contract]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-surface to-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            My Articles
          </h1>
          <p className="text-gray-400 text-lg">
            Your blockchain-verified content portfolio
          </p>
        </div>

        {!account ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔒</div>
            <p className="text-xl text-gray-400">Please connect your wallet to view your articles</p>
          </div>
        ) : myArticles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-xl text-gray-400 mb-4">You haven't published any articles yet.</p>
            <p className="text-gray-500 mb-8">Start building your blockchain-verified portfolio today!</p>
            <a 
              href="/publish-article"
              className="inline-block bg-primary hover:bg-secondary text-black font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Publish Your First Article
            </a>
          </div>
        ) : (
          <div>
            <div className="bg-surface border border-primary/20 rounded-lg p-4 mb-6 flex justify-between items-center">
              <div>
                <p className="text-gray-300">
                  <span className="text-primary font-bold">{myArticles.length}</span> article{myArticles.length !== 1 ? 's' : ''} published
                </p>
              </div>
              <a 
                href="/publish-article"
                className="bg-primary hover:bg-secondary text-black font-semibold py-2 px-4 rounded transition-colors text-sm"
              >
                + New Article
              </a>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {myArticles.map((article, index) => (
                <div 
                  key={index} 
                  className="bg-surface border border-primary/20 p-6 rounded-lg hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-primary">
                      Article #{article.id.toString()}
                    </h2>
                    <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm font-semibold">
                      Published
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <span className="text-primary mr-2">🔗</span>
                      <span className="font-semibold mr-2">Metadata URI:</span>
                      <span className="text-sm text-gray-400 truncate flex-1">
                        {article.metadataURI}
                      </span>
                      <button className="ml-2 text-primary hover:text-secondary text-xs">
                        Copy
                      </button>
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
                      Permanently stored on Ethereum
                    </span>
                    <div className="space-x-2">
                      <button className="text-primary hover:text-secondary text-sm font-semibold transition-colors">
                        View on Explorer →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyArticles;
