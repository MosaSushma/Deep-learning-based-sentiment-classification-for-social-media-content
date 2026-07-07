import React, { useState } from 'react';
import { analyzeSocialMedia } from '../services/api';
import toast from 'react-hot-toast';

const SocialAnalyzer = () => {
  const [platform, setPlatform] = useState('twitter');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeSocialMedia(platform, query, limit);
      setResult(data);
      toast.success(`Analyzed ${data.total_posts || data.total_tweets} posts`);
    } catch (error) {
      toast.error('Failed to analyze social media');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformLabel = (plat) => {
    switch (plat) {
      case 'twitter': return 'Twitter Search';
      case 'reddit': return 'Reddit Subreddit';
      case 'facebook': return 'Facebook Page';
      case 'instagram': return 'Instagram Hashtag';
      default: return plat;
    }
  };

  const getPlaceholder = () => {
    switch (platform) {
      case 'twitter': return 'e.g., #python, machine learning, AI';
      case 'reddit': return 'e.g., programming, technology, news';
      case 'facebook': return 'e.g., CocaCola, Netflix, Apple';
      case 'instagram': return 'e.g., travel, food, fashion';
      default: return 'Enter search term...';
    }
  };

  const getPlatformNote = () => {
    switch (platform) {
      case 'twitter': return 'Searches recent tweets';
      case 'reddit': return 'Searches posts in subreddit';
      case 'facebook': return 'Analyzes page posts (demo)';
      case 'instagram': return 'Analyzes hashtag posts (demo)';
      default: return '';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Social Media Sentiment Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 mb-2">Platform</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="twitter">Twitter</option>
            <option value="reddit">Reddit</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Search Query</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={getPlaceholder()}
          />
          <p className="text-xs text-gray-500 mt-1">{getPlatformNote()}</p>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Number of Posts</label>
          <input
            type="number"
            min="1"
            max="50"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
          />
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-md text-white font-semibold mb-6 ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Analyzing...' : `Analyze ${getPlatformLabel(platform)}`}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Analysis Results</h3>
            <span className={`px-3 py-1 rounded-full ${getSentimentColor(result.overall_sentiment)}`}>
              Overall: {result.overall_sentiment}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-3xl font-bold">{result.total_posts || result.total_tweets}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg shadow">
              <p className="text-sm text-green-600">Positive</p>
              <p className="text-3xl font-bold">{result.sentiment_distribution?.positive || 0}</p>
              <p className="text-sm text-green-600">
                {result.sentiment_percentages?.positive || 0}%
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg shadow">
              <p className="text-sm text-red-600">Negative</p>
              <p className="text-3xl font-bold">{result.sentiment_distribution?.negative || 0}</p>
              <p className="text-sm text-red-600">
                {result.sentiment_percentages?.negative || 0}%
              </p>
            </div>
          </div>

          {result.source === 'demo_mode' && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
              <p className="text-yellow-800 text-sm">
                ⚠️ Using demo data. Add API keys in backend/.env for real {platform} data.
              </p>
            </div>
          )}

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Sample Posts:</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {(result.posts || result.tweets || []).slice(0, 3).map((post, index) => (
                <div key={index} className="p-3 bg-white border border-gray-200 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded text-xs ${getSentimentColor(post.sentiment)}`}>
                      {post.sentiment}
                    </span>
                    <span className="text-xs text-gray-500">
                      {post.likes || post.upvotes || 0} likes
                    </span>
                  </div>
                  <p className="text-sm">{post.text || post.title || post.message || post.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialAnalyzer;