import React, { useState } from 'react';

const OLLAMA_API_BASE_URL = 'http://localhost:11434/api';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const generateResponse = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${OLLAMA_API_BASE_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'llama3.2', prompt: message, stream: false }),
      });
      const data = await res.json();
      setResponse(data.response || 'No response');
    } catch (error) {
      setResponse('Error connecting to Ollama API');
    }
    setMessage('');
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateResponse();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-4 flex flex-col h-[80vh]">
        <h2 className="text-xl font-bold text-blue-600 text-center mb-4">MentorConnectAI</h2>
        <div className="flex-grow overflow-y-auto p-4 border border-gray-300 rounded-lg bg-gray-50">
          {response && (
            <div className="p-3 bg-blue-100 rounded-lg text-sm text-gray-800">
              <strong>MentorConnectAI:</strong>
              <p className="mt-1">{response}</p>
            </div>
          )}
        </div>
        <div className="mt-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message here..."
          ></textarea>
          <button
            className={`w-full mt-3 p-3 rounded-lg text-white font-semibold transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            onClick={generateResponse}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;