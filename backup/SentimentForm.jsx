import React, { useState } from 'react';
import { FaTwitter, FaFacebook, FaInstagram, FaReddit, FaPaperPlane, FaUpload } from 'react-icons/fa';
import { useSentiment } from '../context/SentimentContext';
import { toast } from 'react-toastify';

const SentimentForm = ({ onAnalyze, showExamples = true }) => {
  const [text, setText] = useState('');
  const [platform, setPlatform] = useState('general');
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchTexts, setBatchTexts] = useState(['']);
  const { analyzeText, analyzeBatch, loading } = useSentiment();

  const platforms = [
    { id: 'general', name: 'General', icon: null, color: 'bg-gray-600' },
    { id: 'twitter', name: 'Twitter/X', icon: <FaTwitter />, color: 'bg-blue-400' },
    { id: 'facebook', name: 'Facebook', icon: <FaFacebook />, color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', icon: <FaInstagram />, color: 'bg-pink-600' },
    { id: 'reddit', name: 'Reddit', icon: <FaReddit />, color: 'bg-orange-600' },
  ];

  const exampleTexts = [
    { text: "I absolutely love this product! Best purchase ever!", sentiment: "positive" },
    { text: "Terrible service, would not recommend to anyone.", sentiment: "negative" },
    { text: "The weather is okay today, nothing special.", sentiment: "neutral" },
    { text: "Amazing customer support! They resolved my issue in minutes.", sentiment: "positive" },
    { text: "Worst experience ever. Complete waste of money.", sentiment: "negative" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isBatchMode) {
      const validTexts = batchTexts.filter(t => t.trim().length > 0);
      if (validTexts.length === 0) {
        toast.error('Please enter at least one text to analyze');
        return;
      }
      if (validTexts.length > 100) {
        toast.error('Maximum 100 texts allowed');
        return;
      }
      
      try {
        const result = await analyzeBatch(validTexts, platform);
        onAnalyze && onAnalyze(result);
        setBatchTexts(['']);
      } catch (error) {
        // Error handled in context
      }
    } else {
      if (!text.trim()) {
        toast.error('Please enter some text to analyze');
        return;
      }
      
      try {
        const result = await analyzeText(text, platform);
        onAnalyze && onAnalyze(result);
        setText('');
      } catch (error) {
        // Error handled in context
      }
    }
  };

  const addBatchField = () => {
    if (batchTexts.length < 10) {
      setBatchTexts([...batchTexts, '']);
    }
  };

  const removeBatchField = (index) => {
    if (batchTexts.length > 1) {
      const newTexts = [...batchTexts];
      newTexts.splice(index, 1);
      setBatchTexts(newTexts);
    }
  };

  const updateBatchText = (index, value) => {
    const newTexts = [...batchTexts];
    newTexts[index] = value;
    setBatchTexts(newTexts);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        const lines = content.split('\n').filter(line => line.trim().length > 0);
        if (lines.length > 100) {
          toast.warning('Only first 100 lines will be processed');
          setBatchTexts(lines.slice(0, 100));
        } else {
          setBatchTexts(lines);
        }
        setIsBatchMode(true);
        toast.success(`Loaded ${lines.length} texts from file`);
      } catch (error) {
        toast.error('Failed to read file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isBatchMode ? 'Batch Analysis' : 'Sentiment Analysis'}
        </h2>
        
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setIsBatchMode(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !isBatchMode
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Single
          </button>
          <button
            type="button"
            onClick={() => setIsBatchMode(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isBatchMode
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Batch
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Platform
          </label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  platform === p.id
                    ? `${p.color} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p.icon && <span className="mr-2">{p.icon}</span>}
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        {!isBatchMode ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Text to Analyze
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here... Example: 'I love this product!'"
              className="input-field min-h-[150px] resize-y"
              rows={4}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {text.length}/1000 characters
              </span>
              <span className="text-sm text-gray-500">
                Words: {text.trim().split(/\s+/).filter(w => w.length > 0).length}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Enter Multiple Texts (Max 10)
              </label>
              <label className="flex items-center px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                <FaUpload className="mr-2" />
                Upload Text File
                <input
                  type="file"
                  accept=".txt,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            <div className="space-y-3">
              {batchTexts.map((text, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={text}
                    onChange={(e) => updateBatchText(index, e.target.value)}
                    placeholder={`Text ${index + 1}...`}
                    className="input-field flex-1 min-h-[80px] resize-y"
                    rows={2}
                  />
                  {batchTexts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBatchField(index)}
                      className="px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              
              {batchTexts.length < 10 && (
                <button
                  type="button"
                  onClick={addBatchField}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                >
                  + Add Another Text
                </button>
              )}
            </div>
            
            <div className="mt-3 text-sm text-gray-500">
              {batchTexts.filter(t => t.trim().length > 0).length} texts ready for analysis
            </div>
          </div>
        )}

        {/* Example Texts */}
        {showExamples && !isBatchMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Try Examples
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {exampleTexts.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setText(example.text)}
                  className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="text-sm text-gray-600 mb-1">{example.text}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    example.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                    example.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {example.sentiment}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {isBatchMode ? (
              <span>
                Analyzing {batchTexts.filter(t => t.trim().length > 0).length} texts on{' '}
                {platforms.find(p => p.id === platform)?.name}
              </span>
            ) : (
              <span>
                Analyzing on {platforms.find(p => p.id === platform)?.name} platform
              </span>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading || (!isBatchMode && !text.trim()) || (isBatchMode && batchTexts.filter(t => t.trim().length > 0).length === 0)}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <FaPaperPlane className="mr-2" />
                {isBatchMode ? 'Analyze All' : 'Analyze Sentiment'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SentimentForm;