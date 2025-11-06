// src/pages/FactChecker.jsx
import React, { useState } from 'react';

const FactChecker = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeNews = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/predict/simple/free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze text');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while analyzing the text. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  const getResultColor = () => {
    if (!result) return '';
    const prediction = result.prediction?.toLowerCase();
    if (prediction === 'fake' || prediction === 'false') {
      return 'text-red-500';
    } else if (prediction === 'real' || prediction === 'true') {
      return 'text-green-500';
    }
    return 'text-yellow-500';
  };

  const getConfidenceColor = () => {
    if (!result || !result.probability) return '';
    const confidence = result.probability * 100;
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-surface to-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            AI Fact Checker
          </h1>
          <p className="text-gray-400 text-lg">
            Powered by Machine Learning to detect fake news in real-time
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-surface border border-primary/20 rounded-lg p-8 shadow-lg">
          {/* Info Banner */}
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <span className="text-2xl mr-3">🤖</span>
              <div>
                <h3 className="text-primary font-semibold mb-1">How It Works</h3>
                <p className="text-sm text-gray-300">
                  Our advanced ML model analyzes the linguistic patterns, writing style, and content 
                  structure to determine if the news is authentic or potentially fake.
                </p>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-primary mb-3">
              Enter News Text to Analyze
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the news article, headline, or any text you want to fact-check..."
              rows={8}
              className="w-full p-4 bg-surface-light border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Longer text provides more accurate results
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={analyzeNews}
              disabled={loading || !text.trim()}
              className="flex-1 bg-primary hover:bg-secondary text-black font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="mr-2">🔍</span>
                  Analyze Text
                </>
              )}
            </button>
            <button
              onClick={clearForm}
              disabled={loading}
              className="bg-surface-light hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          </div>

          {/* Results Section */}
          {result && (
            <div className="border-t border-primary/20 pt-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-2">📊</span>
                Analysis Results
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prediction Card */}
                <div className="bg-surface-light border border-primary/20 rounded-lg p-6">
                  <p className="text-gray-400 text-sm mb-2">Prediction</p>
                  <p className={`text-4xl font-bold ${getResultColor()}`}>
                    {result.prediction ? result.prediction.toUpperCase() : 'N/A'}
                  </p>
                  <div className="mt-4">
                    {result.prediction?.toLowerCase() === 'fake' || result.prediction?.toLowerCase() === 'false' ? (
                      <div className="flex items-start bg-red-500/10 border border-red-500/30 rounded p-3">
                        <span className="text-xl mr-2">⚠️</span>
                        <p className="text-sm text-red-300">
                          This content appears to be potentially misleading or fake news
                        </p>
                      </div>
                    ) : result.prediction?.toLowerCase() === 'real' || result.prediction?.toLowerCase() === 'true' ? (
                      <div className="flex items-start bg-green-500/10 border border-green-500/30 rounded p-3">
                        <span className="text-xl mr-2">✓</span>
                        <p className="text-sm text-green-300">
                          This content appears to be legitimate news
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Confidence Card */}
                <div className="bg-surface-light border border-primary/20 rounded-lg p-6">
                  <p className="text-gray-400 text-sm mb-2">Confidence Score</p>
                  <p className={`text-4xl font-bold ${getConfidenceColor()}`}>
                    {result.probability ? `${(result.probability * 100).toFixed(2)}%` : 'N/A'}
                  </p>
                  <div className="mt-4">
                    {result.probability && (
                      <>
                        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              result.probability >= 0.8 ? 'bg-green-500' :
                              result.probability >= 0.6 ? 'bg-yellow-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${result.probability * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400">
                          {result.probability >= 0.8 ? 'High confidence' :
                           result.probability >= 0.6 ? 'Moderate confidence' : 'Low confidence'}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 bg-accent/10 border border-accent/30 rounded-lg p-4">
                <p className="text-xs text-gray-300">
                  <strong>Note:</strong> This is an AI-powered prediction and should be used as a 
                  reference tool. Always verify important information from multiple trusted sources.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-surface border border-primary/10 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-primary mb-2">Instant Analysis</h3>
            <p className="text-sm text-gray-400">
              Get results in seconds with our optimized ML model
            </p>
          </div>
          
          <div className="bg-surface border border-primary/10 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-primary mb-2">High Accuracy</h3>
            <p className="text-sm text-gray-400">
              Trained on thousands of verified news articles
            </p>
          </div>
          
          <div className="bg-surface border border-primary/10 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-primary mb-2">Privacy First</h3>
            <p className="text-sm text-gray-400">
              Your data is analyzed locally and not stored
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactChecker;
