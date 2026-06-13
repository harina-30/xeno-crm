'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API = 'https://xeno-crm-backend-juzy.onrender.com/api';

export default function Home() {
  const [stats, setStats] = useState({ customers: 0, campaigns: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [customers, campaigns, orders] = await Promise.all([
        axios.get(`${API}/customers`),
        axios.get(`${API}/campaigns`),
        axios.get(`${API}/orders`)
      ]);
      setStats({
        customers: customers.data.length,
        campaigns: campaigns.data.length,
        orders: orders.data.length
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="border-b border-gray-800 bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full">AI-Native CRM</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              Reach your shoppers<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">intelligently</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">AI-powered segmentation, personalized messaging, and real-time delivery tracking — all in one place.</p>
            <div className="flex gap-3">
              <Link href="/ai">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all hover:scale-105">
                  ✨ Create AI Campaign
                </button>
              </Link>
              <Link href="/customers">
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all">
                  👥 View Customers
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Customers', value: stats.customers, icon: '👥', color: 'from-blue-600/20 to-blue-800/20', border: 'border-blue-700/30', text: 'text-blue-400' },
            { label: 'Total Orders', value: stats.orders, icon: '🛍️', color: 'from-purple-600/20 to-purple-800/20', border: 'border-purple-700/30', text: 'text-purple-400' },
            { label: 'Campaigns Sent', value: stats.campaigns, icon: '📢', color: 'from-green-600/20 to-green-800/20', border: 'border-green-700/30', text: 'text-green-400' }
          ].map((stat) => (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-2xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className={`text-4xl font-bold ${stat.text}`}>
                {loading ? '...' : stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              href: '/ai',
              icon: '🤖',
              title: 'AI Assistant',
              desc: 'Describe your goal in plain English. AI segments your audience, writes the message, and launches the campaign.',
              tag: 'Most Powerful',
              tagColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
              border: 'hover:border-yellow-500/50'
            },
            {
              href: '/campaigns',
              icon: '📢',
              title: 'Campaigns',
              desc: 'Create targeted campaigns manually or from AI suggestions. Send across WhatsApp, SMS, and Email.',
              tag: 'Core Feature',
              tagColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
              border: 'hover:border-blue-500/50'
            },
            {
              href: '/customers',
              icon: '👥',
              title: 'Customers',
              desc: 'Browse your entire customer base. Search by name or city, view order history and engagement.',
              tag: 'Data',
              tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
              border: 'hover:border-purple-500/50'
            },
            {
              href: '/analytics',
              icon: '📊',
              title: 'Analytics',
              desc: 'Track campaign performance in real-time. See delivery, open, click and failure rates per campaign.',
              tag: 'Insights',
              tagColor: 'bg-green-500/20 text-green-400 border-green-500/30',
              border: 'hover:border-green-500/50'
            }
          ].map((card) => (
            <Link key={card.href} href={card.href}>
              <div className={`bg-gray-900 border border-gray-800 ${card.border} rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02] h-full`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{card.icon}</span>
                  <span className={`text-xs border px-2 py-0.5 rounded-full ${card.tagColor}`}>{card.tag}</span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">{card.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}