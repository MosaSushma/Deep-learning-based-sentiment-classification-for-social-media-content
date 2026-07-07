import React from 'react';
import { FaSmile, FaFrown, FaMeh, FaChartBar, FaCopy, FaDownload } from 'react-icons/fa';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultsDisplay = ({ result, showDetails = true }) => {
  if (!result) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-400 mb-4">
          <FaChartBar className="text-5xl mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No Analysis Results Yet
        </h3>
        <p className="text-gray-500">
          Enter text above to see sentiment analysis results
        </p>
      </div>
    );
  }

  const getSentimentIcon = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return <FaSmile className="text-3xl text-green-500" />;
      case 'negative': return <FaFrown className="text-3xl text-red-500" />;
      case 'neutral': return <FaMeh className="text-3xl text-blue-500" />;
      default: return <FaChartBar className="text-3xl text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        gradient: 'from-green-400 to-green-600'
      };
      case 'negative': return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        gradient: 'from-red-400 to-red-600'
      };
      case 'neutral': return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200',
        gradient: 'from-blue-400 to-blue-600'
      };
      default: return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200',
        gradient: 'from-gray-400 to-gray-600'
      };
    }
  };

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 0.8) return { text: 'High', color: 'text-green-600', bg: 'bg-green-100' };
    if (confidence >= 0.6) return { text: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { text: 'Low', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const colors = getSentimentColor(result.sentiment);
  const confidenceLevel = getConfidenceLevel(result.confidence);

  // Prepare data for charts
  const pieData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [
          result.scores?.positive || (result.sentiment === 'positive' ? result.confidence : 0),
          result.scores?.negative || (result.sentiment === 'negative' ? result.confidence : 0),
          result.scores?.neutral || (result.sentiment === 'neutral' ? result.confidence : 0)
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)'
        ],
        borderWidth: 1
      }
    ]
  };

  const barData = {
    labels: ['Confidence'],
    datasets: [
      {
        label: 'Confidence Level',
        data: [result.confidence * 100],
        backgroundColor: `rgba(${result.sentiment === 'positive' ? '16, 185, 129' : result.sentiment === 'negative' ? '239, 68, 68' : '59, 130, 246'}, 0.7)`,
        borderColor: `rgb(${result.sentiment === 'positive' ? '16, 185, 129' : result.sentiment === 'negative' ? '239, 68, 68' : '59, 130, 246'})`,
        borderWidth: 1
      }
    ]
  };

  const copyToClipboard = () => {
    const text = `Sentiment: ${result.sentiment}\nConfidence: ${(result.confidence * 100).toFixed(1)}%\nText: ${result.text}`;
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
    alert('Results copied to clipboard!');
  };

  const downloadResults = () => {
    const data = {
      analysis: result,
      analyzed_at: new Date().toISOString(),
      model: result.model || 'sentiment-analyzer'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentiment-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {getSentimentIcon(result.sentiment)}
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Analysis Results</h3>
            <p className="text-sm text-gray-500">
              {result.model === 'mock' ? 'Mock Analysis (API unavailable)' : 'AI-Powered Analysis'}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            title="Copy to clipboard"
          >
            <FaCopy />
          </button>
          <button
            onClick={downloadResults}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            title="Download results"
          >
            <FaDownload />
          </button>
        </div>
      </div>

      {/* Sentiment Badge */}
      <div className={`inline-flex items-center px-4 py-2 rounded-full ${colors.bg} ${colors.text} font-medium`}>
        <span className="mr-2">{result.sentiment.toUpperCase()}</span>
        <span className="text-sm opacity-80">
          {(result.confidence * 100).toFixed(1)}% confidence
        </span>
      </div>

      {/* Text Preview */}
      {showDetails && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Analyzed Text</h4>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-800 whitespace-pre-wrap">
              {result.text || 'No text provided'}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              {result.text?.length || 0} characters • {result.text?.split(/\s+/).filter(w => w.length > 0).length || 0} words
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      {showDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Sentiment Distribution</h4>
            <div className="h-64">
              <Pie 
                data={pieData}
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

          {/* Bar Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Confidence Level</h4>
            <div className="h-64">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: value => `${value}%`
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: context => `${context.raw.toFixed(1)}% confidence`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Detailed Scores */}
      {result.scores && showDetails && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Detailed Sentiment Scores</h4>
          <div className="space-y-3">
            {Object.entries(result.scores).map(([sentiment, score]) => (
              <div key={sentiment} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize font-medium text-gray-700">{sentiment}</span>
                  <span className="font-semibold">{(score * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      sentiment === 'positive' ? 'bg-green-500' :
                      sentiment === 'negative' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${score * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Confidence</div>
            <div className={`font-medium ${confidenceLevel.color}`}>
              {confidenceLevel.text} ({(result.confidence * 100).toFixed(1)}%)
            </div>
          </div>
          
          <div>
            <div className="text-gray-500">Model</div>
            <div className="font-medium text-gray-900">
              {result.model === 'transformers' ? 'Transformers' : 
               result.model === 'ml' ? 'Machine Learning' :
               result.model || 'Sentiment Analyzer'}
            </div>
          </div>
          
          <div>
            <div className="text-gray-500">Platform</div>
            <div className="font-medium text-gray-900 capitalize">
              {result.platform || 'general'}
            </div>
          </div>
          
          <div>
            <div className="text-gray-500">Analyzed</div>
            <div className="font-medium text-gray-900">
              {result.timestamp ? new Date(result.timestamp).toLocaleTimeString() : 'Just now'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showDetails && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Print Results
          </button>
          <button
            onClick={() => alert('Share feature coming soon!')}
            className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
          >
            Share Analysis
          </button>
          {result.isMock && (
            <div className="ml-auto text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-lg">
              ⚠️ Mock data (API unavailable)
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;