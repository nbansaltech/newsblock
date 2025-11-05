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
    <div className="p-8">
      <h1 className="text-3xl mb-6">My Articles</h1>
      {myArticles.length === 0 ? (
        <p>You have not published any articles yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {myArticles.map((article, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded">
              <h2 className="text-xl font-bold">Article ID: {article.id.toString()}</h2>
              <p>Metadata URI: {article.metadataURI}</p>
              <p>Timestamp: {new Date(article.timestamp.toNumber() * 1000).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyArticles;
