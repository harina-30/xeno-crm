'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const API = 'http://localhost:5000/api';

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const suggestions = [
    { text: "Reach customers who haven't ordered in 30 days", icon: "⏰" },
    { text: "Send a thank you to our most loyal customers", icon: "⭐" },
    { text: "Win back customers who haven't bought in 3 months", icon: "🔄" },
    { text: "Promote new arrivals to recent buyers", icon: "🆕" },
    { text: "Send a birthday discount to customers", icon: "🎂" },
    { text: "Re-engage customers from Mumbai with a special offer", icon: "📍" },
  ];

  const getSuggestion = async () => {
    if (!prompt) return;
    setLoading(true);
    setSuggestion(null);
    try {
      const res = await axios.post(`${API}/ai/suggest`, { prompt });
      setSuggestion(res.data);
    } catch (err) {
      alert('AI error: ' + err.message);
    }
    setLoading(false);
  };

  const createAndSend = async () => {
    if (!suggestion) return;
    setCreating(true);
    try {
      const campaign = await axios.post(`${API}/campaigns`, {
        name: suggestion.campaign_name,
        message_template: suggestion.message_template,
        channel: suggestion.channel
      });
      await axios.post(`${API}/campaigns/${campaign.data.id}/send`);
      setSuccess(true);
      setTimeout(() => router.push('/analytics'), 2000);
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setCreating(false);
  };

  const channelIcon = (channel) => {
    if (channel === 'whatsapp') return '💬';
    if (channel === 'sms') return '📱';
    return '📧';
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            🤖
          </div>
          <h1 className="text-3xl font-bold text-white">AI Campaign Assistant</h1>
          <p className="text-gray-400 mt-2">Describe your marketing goal in plain English. AI will handle the rest.</p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { step: '1', label: 'Describe your goal', icon: '💬' },
            { step: '2', label: 'AI segments & writes', icon: '🤖' },
            { step: '3', label: 'Review & launch', icon: '🚀' },
          ].map(s => (
            <div key={s.step} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <span className="text-2xl mb-2 block">{s.icon}</span>
              <p className="text-gray-400 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <label className="text-gray-300 text-sm font-medium mb-3 block">What do you want to achieve?</label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. Reach customers who haven't ordered in 30 days with a discount offer..."
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 resize-none mb-4 text-sm"
          />

          {/* Quick suggestions */}
          <div className="mb-4">
            <p className="text-gray-500 text-xs mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button
                  key={s.text}
                  onClick={() => setPrompt(s.text)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>{s.icon}</span>
                  <span>{s.text}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={getSuggestion}
            disabled={loading || !prompt}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 text-black font-semibold px-6 py-3 rounded-xl transition-all"
          >
            {loading ? '🤔 AI is thinking...' : '✨ Generate Campaign with AI'}
          </button>
        </div>

        {/* AI Result */}
        {suggestion && (
          <div className="bg-gray-900 border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-yellow-400 text-lg">✨</span>
              <h2 className="text-lg font-semibold text-yellow-400">AI Suggestion Ready</h2>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-800 rounded-xl p-4">
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">Campaign Name</label>
                <p className="text-white font-semibold">{suggestion.campaign_name}</p>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">Target Audience</label>
                <p className="text-white text-sm">{suggestion.segment_description}</p>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Message Preview</label>
                <div className="bg-gray-700 rounded-lg p-3 border-l-4 border-yellow-500">
                  <p className="text-white text-sm leading-relaxed">{suggestion.message_template}</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">Channel</label>
                  <p className="text-white text-sm font-medium capitalize">
                    {channelIcon(suggestion.channel)} {suggestion.channel}
                  </p>
                </div>
                <div className="text-right">
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">Audience Size</label>
                  <p className="text-white text-sm font-medium">50 customers</p>
                </div>
              </div>
            </div>

            {success ? (
              <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4 text-center">
                <p className="text-green-400 font-medium">✅ Campaign launched! Redirecting to analytics...</p>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={createAndSend}
                  disabled={creating}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  {creating ? 'Launching...' : '🚀 Launch Campaign'}
                </button>
                <button
                  onClick={() => setSuggestion(null)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-400 px-4 py-3 rounded-xl transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}