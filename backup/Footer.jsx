import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaHeart, FaCode } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                <FaCode className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Sentiment Analyzer</h3>
                <p className="text-sm text-gray-500">AI-Powered Insights</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Advanced sentiment analysis for social media content using machine learning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/analyze" className="text-gray-600 hover:text-primary-600 transition-colors">Analyze Text</a></li>
              <li><a href="/social-media" className="text-gray-600 hover:text-primary-600 transition-colors">Social Media</a></li>
              <li><a href="/history" className="text-gray-600 hover:text-primary-600 transition-colors">History</a></li>
              <li><a href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">Dashboard</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Features</h4>
            <ul className="space-y-2">
              <li className="text-gray-600">Real-time Analysis</li>
              <li className="text-gray-600">Multi-platform Support</li>
              <li className="text-gray-600">Advanced AI Models</li>
              <li className="text-gray-600">Detailed Analytics</li>
              <li className="text-gray-600">Batch Processing</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Connect</h4>
            <div className="flex space-x-4 mb-6">
              <a href="https://github.com" className="text-gray-400 hover:text-gray-900 transition-colors">
                <FaGithub size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-blue-700 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                Need help? Contact our support team at{' '}
                <a href="mailto:support@sentiment.com" className="text-primary-600 hover:underline">
                  support@sentiment.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Sentiment Analyzer Pro. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center mt-2 md:mt-0">
            Made with <FaHeart className="text-red-500 mx-1" /> for AI enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;