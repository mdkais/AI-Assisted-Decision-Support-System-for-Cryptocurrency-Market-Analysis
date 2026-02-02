import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Search, Loader2, TrendingUp, TrendingDown, 
  LayoutDashboard, LogOut, ArrowRight, BarChart3 
} from 'lucide-react';

const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCoins = async () => {
      try {
        const res = await api.get('/crypto/list-coins');
        setCoins(res.data);
      } catch (err) {
        console.error("Error fetching coins:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCoins();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-500 w-12 h-12 mx-auto mb-4" />
          <p className="text-slate-400 animate-pulse font-medium">Syncing Market Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <BarChart3 className="text-blue-500" size={24} />
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white">Market <span className="text-blue-500">Assets</span></h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-sm font-semibold text-slate-400 hover:text-blue-400 transition-all flex items-center gap-2">
                <LayoutDashboard size={14} /> AI Dashboard
              </Link>
              <button onClick={handleLogout} className="text-sm font-semibold text-slate-400 hover:text-rose-400 transition-all flex items-center gap-2">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by name or symbol..."
              className="w-full bg-[#1e293b]/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all backdrop-blur-md placeholder:text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Assets Table */}
        <div className="bg-[#1e293b]/30 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Asset</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Price (USD)</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-500 text-right">24h Change</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-500 text-right hidden lg:table-cell">Market Cap</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-500 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredCoins.map((coin) => (
                <tr 
                  key={coin.id} 
                  className="group hover:bg-blue-500/5 transition-all duration-300 cursor-default"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full shadow-lg group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{coin.name}</p>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-tighter">{coin.symbol}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-5">
                    <p className="text-lg font-mono font-bold text-slate-100">
                      ${coin.current_price < 1 
                        ? coin.current_price.toFixed(6) 
                        : coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })
                      }
                    </p>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <div className={`inline-flex items-center gap-1 font-black text-sm px-3 py-1 rounded-full ${
                      coin.price_change_24h > 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'
                    }`}>
                      {coin.price_change_24h > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {Math.abs(coin.price_change_24h || 0).toFixed(2)}%
                    </div>
                  </td>

                  <td className="px-6 py-5 text-right hidden lg:table-cell">
                    <p className="text-sm font-medium text-slate-400">
                      ${(coin.market_cap / 1e9).toFixed(2)}B
                    </p>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <Link 
                      to={`/dashboard?coin=${coin.id}`} 
                      className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all group/btn"
                    >
                      <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCoins.length === 0 && (
            <div className="py-24 text-center">
              <div className="bg-slate-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                <Search size={32} className="text-slate-600" />
              </div>
              <p className="text-xl font-bold text-slate-400">No matching assets found</p>
              <p className="text-slate-600 text-sm mt-1">Try searching for a different name or ticker.</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex justify-center">
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600">
            Real-time data powered by CoinGecko API
          </p>
        </div>
      </div>
    </div>
  );
};

export default Coins;