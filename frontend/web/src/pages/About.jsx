// src/pages/About.jsx
import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            About NewsBlock
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Revolutionizing journalism through blockchain verification and AI-powered truth detection
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-surface rounded-lg p-8 mb-12 border border-primary/20">
          <h2 className="text-3xl font-bold text-primary mb-4">Our Mission</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            In an era of misinformation and fake news, NewsBlock stands as a beacon of truth. 
            We combine the immutability of blockchain technology with advanced machine learning 
            to create a trustless, decentralized platform for verified journalism. Our mission 
            is to restore faith in digital media by ensuring every piece of content can be 
            traced, verified, and trusted.
          </p>
        </div>

        {/* What We Do */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-secondary mb-8 text-center">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-lg p-6 border border-primary/10 hover:border-primary/50 transition-all">
              <div className="text-4xl mb-4">⛓️</div>
              <h3 className="text-xl font-bold text-primary mb-3">Blockchain Verification</h3>
              <p className="text-gray-400">
                Every article is recorded on the Ethereum blockchain, creating an immutable 
                record of authorship and publication. Journalists register with cryptographic 
                proof, ensuring accountability and authenticity.
              </p>
            </div>

            <div className="bg-surface rounded-lg p-6 border border-primary/10 hover:border-primary/50 transition-all">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-primary mb-3">AI Fake News Detection</h3>
              <p className="text-gray-400">
                Our sophisticated machine learning model analyzes content in real-time, 
                trained on thousands of verified news articles to distinguish between 
                authentic journalism and misleading information with high accuracy.
              </p>
            </div>

            <div className="bg-surface rounded-lg p-6 border border-primary/10 hover:border-primary/50 transition-all">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-primary mb-3">Mobile Application</h3>
              <p className="text-gray-400">
                Access NewsBlock anywhere with our cross-platform mobile app. Verify news 
                on the go, check article authenticity, and stay informed with blockchain-verified 
                content right from your smartphone.
              </p>
            </div>

            <div className="bg-surface rounded-lg p-6 border border-primary/10 hover:border-primary/50 transition-all">
              <div className="text-4xl mb-4">🔌</div>
              <h3 className="text-xl font-bold text-primary mb-3">Browser Extension</h3>
              <p className="text-gray-400">
                Our browser extension works seamlessly as you browse, instantly verifying 
                articles and flagging potentially fake news. Get real-time credibility scores 
                without leaving your current page.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-secondary mb-8 text-center">How It Works</h2>
          <div className="space-y-6">
            <div className="flex items-start bg-surface rounded-lg p-6 border border-primary/10">
              <div className="bg-primary text-black rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Journalist Registration</h3>
                <p className="text-gray-400">
                  Journalists register on the blockchain with their credentials, creating 
                  a verified identity that's permanently recorded and cannot be forged.
                </p>
              </div>
            </div>

            <div className="flex items-start bg-surface rounded-lg p-6 border border-primary/10">
              <div className="bg-secondary text-black rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Article Publication</h3>
                <p className="text-gray-400">
                  Articles are published through smart contracts, linking the content to 
                  the verified journalist's identity with timestamp and metadata.
                </p>
              </div>
            </div>

            <div className="flex items-start bg-surface rounded-lg p-6 border border-primary/10">
              <div className="bg-primary text-black rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">AI Analysis</h3>
                <p className="text-gray-400">
                  Our ML model analyzes the content for patterns associated with fake news, 
                  providing a credibility score based on linguistic and contextual factors.
                </p>
              </div>
            </div>

            <div className="flex items-start bg-surface rounded-lg p-6 border border-primary/10">
              <div className="bg-secondary text-black rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Verification & Trust</h3>
                <p className="text-gray-400">
                  Readers can verify any article's authenticity by checking the blockchain 
                  record, view the journalist's verification status, and see the AI credibility score.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 border border-primary/20">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-surface/50 rounded-lg p-4">
              <div className="text-3xl mb-2">⚡</div>
              <p className="text-sm font-semibold text-primary">Ethereum</p>
              <p className="text-xs text-gray-500">Blockchain</p>
            </div>
            <div className="bg-surface/50 rounded-lg p-4">
              <div className="text-3xl mb-2">⚛️</div>
              <p className="text-sm font-semibold text-secondary">React</p>
              <p className="text-xs text-gray-500">Frontend</p>
            </div>
            <div className="bg-surface/50 rounded-lg p-4">
              <div className="text-3xl mb-2">🐍</div>
              <p className="text-sm font-semibold text-primary">Python</p>
              <p className="text-xs text-gray-500">Backend</p>
            </div>
            <div className="bg-surface/50 rounded-lg p-4">
              <div className="text-3xl mb-2">🧠</div>
              <p className="text-sm font-semibold text-secondary">ML Model</p>
              <p className="text-xs text-gray-500">AI Detection</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4 text-white">Join the Revolution</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Be part of the movement to restore trust in journalism. Whether you're a 
            journalist, reader, or developer, there's a place for you in the NewsBlock ecosystem.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/fact-checker" 
              className="bg-accent hover:bg-accent/80 text-white font-bold py-3 px-8 rounded-lg transition-all"
            >
              Try Fact Checker
            </a>
            <a 
              href="/register-journalist" 
              className="bg-primary hover:bg-primary/80 text-black font-bold py-3 px-8 rounded-lg transition-all"
            >
              Register as Journalist
            </a>
            <a 
              href="/" 
              className="bg-secondary hover:bg-secondary/80 text-black font-bold py-3 px-8 rounded-lg transition-all"
            >
              Explore Articles
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
