import React, { useEffect, useState } from 'react';
import { FaChartLine, FaSmile, FaFrown, FaMeh, FaHistory, FaTwitter, FaUsers } from 'react-icons/fa';
import { useSentiment } from '../context/SentimentContext';
import { sentimentAPI } from '../services/api';

const QuickStats = () => {
  const { stats, recentAnalyses } = useSentiment();
  const [platformStats, setPlatformStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatformStats = async () => {
      try {
        const data = await sentimentAPI.getStats();
        setPlatformStats(data);
      } catch (error) {
        console.error('Error fetching platform stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Analyses',
      value: stats?.total || 0,
      icon: <FaChartLine className="text-2xl text-primary-600" />,
      color: 'bg-gradient-to-br from-primary-50 to-primary-100',
      change: '+12%'
    },
    {
      title: 'Positive',
      value: stats?.by_sentiment?.positive || 0,
      icon: <FaSmile className="text-2xl text-green-600" />,
      color: 'bg-gradient-to-br from-green-50 to-green-100',
      percentage: stats?.total ? ((stats.by_sentiment?.positive || 0) / stats.total * 100).toFixed(1) + '%' : '0%'
    },
    {
      title: 'Negative',
      value: stats?.by_sentiment?.negative || 0,
      icon: <FaFrown className="text-2xl text-red-600" />,
      color: 'bg-gradient-to-br from-red-50 to-red-100',
      percentage: stats?.total ? ((stats.by_sentiment?.negative || 0) / stats.total * 100).toFixed(1) + '%' : '0%'
    },
    {
      title: 'Neutral',
      value: stats?.by_sentiment?.neutral || 0,
      icon: <FaMeh className="text-2xl text-blue-600" />,
      color: 'bg-gradient-to-br from-blue-50 to-blue-100',
      percentage: stats?.total ? ((stats.by_sentiment?.neutral || 0) / stats.total * 100).toFixed(1) + '%' : '0%'
    }
  ];

  const platformData = [
    { name: 'Twitter', value: platformStats?.by_platform?.twitter || 0, color: 'bg-blue-400', icon: <FaTwitter /> },
    { name: 'Facebook', value: platformStats?.by_platform?.facebook || 0, color: 'bg-blue-600', icon: <FaUsers /> },
    { name: 'General', value: platformStats?.by_platform?.general || 0, color: 'bg-gray-600', icon: <FaChartLine /> },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className={`card ${stat.color}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-white/50">
                {stat.icon}
              </div>
              {stat.change && (
                <span className="text-xs font-medium px-2 py-1 bg-white rounded-full text-primary-700">
                  {stat.change}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600">
              {stat.title}
            </p>
            {stat.percentage && (
              <div className="mt-2 text-xs font-medium text-gray-700">
                {stat.percentage} of total
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Platform Distribution */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Platform Distribution</h3>
          <FaHistory className="text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {platformData.map((platform, index) => {
            const total = platformStats?.total || 1;
            const percentage = (platform.value / total * 100).toFixed(1);
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center text-white`}>
                      {platform.icon}
                    </div>
                    <span className="font-medium text-gray-700">{platform.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{platform.value}</div>
                    <div className="text-xs text-gray-500">{percentage}%</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${platform.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Recent Activity</h4>
          <div className="space-y-3">
            {recentAnalyses.slice(0, 3).map((analysis, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    analysis.sentiment === 'positive' ? 'bg-green-500' :
                    analysis.sentiment === 'negative' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <span className="text-sm text-gray-600 truncate max-w-[200px]">
                    {analysis.text}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {analysis.timestamp ? new Date(analysis.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;