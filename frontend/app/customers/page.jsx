'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get(`${API}/customers`).then(res => {
      setCustomers(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    if (filter === 'active') return matchSearch && c.total_orders > 3;
    if (filter === 'atrisk') return matchSearch && c.total_orders <= 1;
    if (filter === 'new') return matchSearch && c.total_orders === 0;
    return matchSearch;
  });

  const daysSince = (date) => {
    if (!date) return 999;
    return Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
  };

  const getEngagementBadge = (c) => {
    if (c.total_orders >= 5) return { label: 'VIP', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    if (c.total_orders >= 3) return { label: 'Active', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (c.total_orders === 0) return { label: 'New', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    return { label: 'At Risk', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">👥 Customers</h1>
          <p className="text-gray-400 mt-1">Manage and explore your customer base</p>
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'active', label: '🌟 VIP' },
              { key: 'atrisk', label: '⚠️ At Risk' },
              { key: 'new', label: '✨ New' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.key ? 'bg-purple-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: customers.length, color: 'text-white' },
            { label: 'VIP (5+ orders)', value: customers.filter(c => c.total_orders >= 5).length, color: 'text-yellow-400' },
            { label: 'At Risk (≤1 order)', value: customers.filter(c => c.total_orders <= 1).length, color: 'text-red-400' },
            { label: 'New (0 orders)', value: customers.filter(c => c.total_orders === 0).length, color: 'text-blue-400' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-gray-400 text-center py-20">Loading customers...</div>
        ) : (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/50">
                  <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Customer</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">City</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Orders</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Last Order</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const badge = getEngagementBadge(c);
                  const days = daysSince(c.last_order_date);
                  return (
                    <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{c.name}</p>
                            <p className="text-gray-500 text-xs">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-800 text-gray-300 px-2.5 py-1 rounded-lg text-xs">{c.city}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-medium text-sm">{c.total_orders}</span>
                        <span className="text-gray-500 text-xs ml-1">orders</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-300 text-sm">{c.last_order_date ? new Date(c.last_order_date).toLocaleDateString() : 'Never'}</p>
                        {days < 999 && <p className="text-gray-500 text-xs">{days} days ago</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs border px-2.5 py-1 rounded-full font-medium ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-6 py-4 text-gray-500 text-sm border-t border-gray-800">
              Showing {filtered.length} of {customers.length} customers
            </div>
          </div>
        )}
      </div>
    </div>
  );
}