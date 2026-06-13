'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const API = 'http://localhost:5000/api';

function AnalyticsContent() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('campaign');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const res = await axios.get(`${API}/campaigns`);
    const campaigns = res.data;
    setCampaigns(campaigns);
    const statsMap = {};
    await Promise.all(
      campaigns.filter(c => c.status !== 'draft').map(async c => {
        const s = await axios.get(`${API}/campaigns/${c.id}/stats`);
        statsMap[c.id] = s.data;
      })
    );
    setStats(statsMap);
    setLoading(false);
  };

  const getRate = (stats, key) => {
    if (!stats || !stats.total || stats.total === 0) return 0;
    return Math.round(((stats[key] || 0) / stats.total) * 100);
  };

  const channelIcon = (channel) => {
    if (channel === 'whatsapp') return '💬';
    if (channel === 'sms') return '📱';
    return '📧';
  };

  const sentCampaigns = campaigns.filter(c => c.status !== 'draft');
  const totalSent = Object.values(stats).reduce((a, s) => a + (s.total || 0), 0);
  const totalOpened = Object.values(stats).reduce((a, s) => a + (s.opened || 0), 0);
  const totalClicked = Object.values(stats).reduce((a, s) => a + (s.clicked || 0), 0);

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">📊 Analytics</h1>
          <p className="text-gray-400 mt-1">Real-time campaign performance tracking</p>
        </div>

        {/* Overall stats */}
        {!loading && sentCampaigns.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Campaigns', value: sentCampaigns.length, icon: '📢', color: 'text-white' },
              { label: 'Total Sent', value: totalSent, icon: '📨', color: 'text-blue-400' },
              { label: 'Total Opened', value: totalOpened, icon: '👁️', color: 'text-yellow-400' },
              { label: 'Total Clicked', value: totalClicked, icon: '🖱️', color: 'text-green-400' },
            ].map(s => (
              <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-xs">{s.label}</p>
                  <span>{s.icon}</span>
                </div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-gray-400 text-center py-20">Loading analytics...</div>
        ) : sentCampaigns.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
            <p className="text-4xl mb-4">📊</p>
            <p className="text-gray-300 font-medium mb-2">No campaign data yet</p>
            <p className="text-gray-500 text-sm mb-6">Send a campaign to see analytics here</p>
            <Link href="/ai">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium">
                ✨ Create AI Campaign
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {sentCampaigns.map(c => {
              const s = stats[c.id] || {};
              return (
                <div
                  key={c.id}
                  className={`bg-gray-900 border rounded-2xl p-6 transition-all ${highlightId === c.id ? 'border-yellow-500/50' : 'border-gray-800'}`}
                >
                  {/* Campaign header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-xl">
                        {channelIcon(c.channel)}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">{c.name}</h2>
                        <p className="text-gray-500 text-xs">{c.channel} · {new Date(c.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-white">{s.total || 0}</p>
                      <p className="text-gray-400 text-xs">messages sent</p>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Delivered', key: 'delivered', color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-800/30', icon: '📬' },
                      { label: 'Opened', key: 'opened', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-800/30', icon: '👁️' },
                      { label: 'Clicked', key: 'clicked', color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-800/30', icon: '🖱️' },
                      { label: 'Failed', key: 'failed', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-800/30', icon: '❌' }
                    ].map(stat => (
                      <div key={stat.key} className={`${stat.bg} border ${stat.border} rounded-xl p-4`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">{stat.icon}</span>
                          <span className={`text-xs font-medium ${stat.color}`}>{getRate(s, stat.key)}%</span>
                        </div>
                        <p className={`text-2xl font-bold ${stat.color}`}>{s[stat.key] || 0}</p>
                        <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  {s.total > 0 && (
                    <div>
                      <p className="text-gray-500 text-xs mb-2">Delivery breakdown</p>
                      <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                        {[
                          { key: 'delivered', color: 'bg-blue-500' },
                          { key: 'opened', color: 'bg-yellow-500' },
                          { key: 'clicked', color: 'bg-green-500' },
                          { key: 'failed', color: 'bg-red-500' },
                          { key: 'sent', color: 'bg-gray-600' }
                        ].map(bar => {
                          const width = getRate(s, bar.key);
                          return width > 0 ? (
                            <div key={bar.key} className={`${bar.color} h-full transition-all`} style={{ width: `${width}%` }} />
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Analytics() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Loading...</div>}>
      <AnalyticsContent />
    </Suspense>
  );
}