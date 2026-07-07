import React, { useState, useEffect } from 'react';
import { 
  FaFilter, FaCalendar, FaDownload, FaRefresh, 
  FaChartPie, FaChartBar, FaChartLine, FaTable,
  FaTwitter, FaFacebook, FaInstagram, FaReddit,
  FaArrowUp, FaArrowDown, FaMinus 
} from 'react-icons/fa';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState(null);
  const [stats, setStats] = useState({
    total: 1250,
    average_confidence: 0.85,
    by_sentiment: { positive: 580, negative: 320, neutral: 350 },
    by_platform: { twitter: 45, facebook: 25, instagram: 15, reddit: 10, general: 5 }
  });
  const [analyses, setAnalyses] = useState([
    { id: 1, text: "I love this product!", sentiment: "positive", confidence: 0.95, platform: "twitter" },
    { id: 2, text: "Terrible service", sentiment: "negative", confidence: 0.88, platform: "facebook" },
    { id: 3, text: "It's okay I guess", sentiment: "neutral", confidence: 0.76, platform: "instagram" },
    { id: 4, text: "Amazing experience!", sentiment: "positive", confidence: 0.92, platform: "reddit" },
    { id: 5, text: "Not worth the money", sentiment: "negative", confidence: 0.84, platform: "general" },
  ]);

  // Fetch trend data
  useEffect(() => {
    fetchTrendData();
  }, [timeRange, platformFilter]);

  const fetchTrendData = async () => {
    setLoading(true);
    try {
      // Mock trend data
      const mockTrendData = generateMockTrendData();
      setTrendData(mockTrendData);
    } catch (error) {
      console.error('Error fetching trend data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTrendData = () => {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Positive',
          data: [65, 59, 80, 81, 56, 55, 40],
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Negative',
          data: [28, 48, 40, 19, 86, 27, 90],
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Neutral',
          data: [18, 30, 25, 35, 40, 45, 30],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  // Platform distribution data
  const platformData = {
    labels: ['Twitter', 'Facebook', 'Instagram', 'Reddit', 'General'],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          'rgba(29, 161, 242, 0.8)',
          'rgba(66, 103, 178, 0.8)',
          'rgba(225, 48, 108, 0.8)',
          'rgba(255, 69, 0, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          'rgba(29, 161, 242)',
          'rgba(66, 103, 178)',
          'rgba(225, 48, 108)',
          'rgba(255, 69, 0)',
          'rgba(156, 163, 175)',
        ],
        borderWidth: 1
      }
    ]
  };

  // Hourly distribution data
  const hourlyData = {
    labels: ['12AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
    datasets: [
      {
        label: 'Analyses per Hour',
        data: [5, 3, 8, 25, 45, 38, 28, 15],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246)',
        borderWidth: 1
      }
    ]
  };

  const platformIcons = {
    twitter: <FaTwitter className="text-blue-400" />,
    facebook: <FaFacebook className="text-blue-600" />,
    instagram: <FaInstagram className="text-pink-600" />,
    reddit: <FaReddit className="text-orange-600" />,
    general: <FaChartBar className="text-gray-600" />
  };

  const refreshDashboard = async () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const exportDashboardData = () => {
    const data = {
      exported_at: new Date().toISOString(),
      stats,
      analyses_count: analyses.length
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // KPI data
  const kpiData = [
    {
      title: 'Total Analyses',
      value: stats?.total || 0,
      change: '+12.5%',
      trend: 'up',
      icon: <FaChartBar className="text-primary-600" />
    },
    {
      title: 'Avg. Confidence',
      value: stats?.average_confidence ? `${(stats.average_confidence * 100).toFixed(1)}%` : '75.2%',
      change: '+2.3%',
      trend: 'up',
      icon: <FaChartLine className="text-green-600" />
    },
    {
      title: 'Positive Rate',
      value: stats?.by_sentiment?.positive ? 
        `${((stats.by_sentiment.positive / stats.total) * 100).toFixed(1)}%` : '45.8%',
      change: '+5.1%',
      trend: 'up',
      icon: <FaChartPie className="text-blue-600" />
    },
    {
      title: 'Active Platforms',
      value: Object.keys(stats?.by_platform || {}).length,
      change: '+2',
      trend: 'up',
      icon: <FaTable className="text-purple-600" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time sentiment analysis insights</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300 px-3 py-2">
            <FaCalendar className="text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* Platform Filter */}
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300 px-3 py-2">
            <FaFilter className="text-gray-400" />
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm"
            >
              <option value="all">All Platforms</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="reddit">Reddit</option>
            </select>
          </div>

          {/* Action Buttons */}
          <button
            onClick={refreshDashboard}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FaRefresh className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={exportDashboardData}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <FaDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                {kpi.icon}
              </div>
              <div className={`flex items-center text-sm ${
                kpi.trend === 'up' ? 'text-green-600' : 
                kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {kpi.trend === 'up' ? <FaArrowUp className="mr-1" /> : 
                 kpi.trend === 'down' ? <FaArrowDown className="mr-1" /> : 
                 <FaMinus className="mr-1" />}
                {kpi.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{kpi.value}</h3>
            <p className="text-sm text-gray-600">{kpi.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Trends</h3>
          <div className="h-72">
            {trendData && (
              <Line
                data={trendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false
                    }
                  },
                  interaction: {
                    intersect: false,
                    mode: 'nearest'
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        drawBorder: false
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Distribution</h3>
          <div className="h-72">
            <Pie
              data={platformData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Hourly Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Activity</h3>
          <div className="h-64">
            <Bar
              data={hourlyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      drawBorder: false
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {analyses.slice(0, 8).map((analysis, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${
                    analysis.sentiment === 'positive' ? 'bg-green-100' :
                    analysis.sentiment === 'negative' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {platformIcons[analysis.platform] || platformIcons.general}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {analysis.text}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        analysis.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        analysis.sentiment === 'negative' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {analysis.sentiment}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(analysis.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;