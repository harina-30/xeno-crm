'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const API = 'https://xeno-crm-backend-juzy.onrender.com/api';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', message_template: '', channel: 'email' });

  const fetchCampaigns = async () => {
    const res = await axios.get(`${API}/campaigns`);
    setCampaigns(res.data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCampaigns();
  }, []);

  const createCampaign = async () => {
    if (!form.name || !form.message_template) return;
    setCreating(true);
    await axios.post(`${API}/campaigns`, form);
    setForm({ name: '', message_template: '', channel: 'email' });
    setShowForm(false);
    await fetchCampaigns();
    setCreating(false);
  };

  const sendCampaign = async (id) => {
    setSending(id);
    await axios.post(`${API}/campaigns/${id}/send`);
    await fetchCampaigns();
    setSending(null);
  };

  const channelIcon = (channel) => {
    if (channel === 'whatsapp') return '💬';
    if (channel === 'sms') return '📱';
    return '📧';
  };

  const statusStyle = (status) => {
    if (status === 'sent') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (status === 'completed') return 'bg-green-500/20 text-green-400 border-green-500/30';
    return 'bg-gray-700/50 text-gray-400 border-gray-600/30';
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">📢 Campaigns</h1>
            <p className="text-gray-400 mt-1">Create and manage your marketing campaigns</p>
          </div>
          <div className="flex gap-3">
            <Link href="/ai">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                ✨ Create with AI
              </button>
            </Link>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              {showForm ? '✕ Cancel' : '+ New Campaign'}
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">New Campaign</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Campaign name..."
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
              />
              <select
                value={form.channel}
                onChange={e => setForm({ ...form, channel: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
              >
                <option value="email">📧 Email</option>
                <option value="whatsapp">💬 WhatsApp</option>
                <option value="sms">📱 SMS</option>
              </select>
            </div>
            <textarea
              placeholder="Message template... use {{name}} for personalization"
              value={form.message_template}
              onChange={e => setForm({ ...form, message_template: e.target.value })}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 mb-4 resize-none text-sm"
            />
            <div className="flex gap-3">
              <button
                onClick={createCampaign}
                disabled={creating}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium transition-colors text-sm"
              >
                {creating ? 'Creating...' : 'Create Campaign'}
              </button>
              <button onClick={() => setShowForm(false)} className="bg-gray-800 hover:bg-gray-700 text-gray-400 px-6 py-2.5 rounded-xl text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: campaigns.length, color: 'text-white' },
            { label: 'Sent', value: campaigns.filter(c => c.status === 'sent').length, color: 'text-blue-400' },
            { label: 'Draft', value: campaigns.filter(c => c.status === 'draft').length, color: 'text-gray-400' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Campaigns List */}
        {loading ? (
          <div className="text-gray-400 text-center py-20">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No campaigns yet.</p>
            <Link href="/ai">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium">
                ✨ Create your first AI campaign
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map(c => (
              <div key={c.id} className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 flex items-center justify-between transition-all">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-xl">
                    {channelIcon(c.channel)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{c.name}</h3>
                      <span className={`text-xs border px-2 py-0.5 rounded-full ${statusStyle(c.status)}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm truncate max-w-lg">{c.message_template}</p>
                    <p className="text-gray-600 text-xs mt-1">{new Date(c.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link href={`/analytics?campaign=${c.id}`}>
                    <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-xl text-sm transition-colors">
                      📊 Stats
                    </button>
                  </Link>
                  {c.status === 'draft' && (
                    <button
                      onClick={() => sendCampaign(c.id)}
                      disabled={sending === c.id}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      {sending === c.id ? 'Sending...' : '🚀 Send'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}