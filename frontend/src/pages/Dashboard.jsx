import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';
import { 
  TrendingUp, TrendingDown, BrainCircuit, Search, 
  Loader2, LayoutGrid, LogOut, Scale, Activity,
  ChevronRight, Globe
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [coin, setCoin] = useState('bitcoin');
  const [allCoins, setAllCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoinList = async () => {
      try {
        const res = await api.get('/crypto/list-coins');
        setAllCoins(res.data);
      } catch (err) {
        console.error("Error fetching coin list", err);
      }
    };
    fetchCoinList();
  }, []);

  useEffect(() => {
    fetchData();
  }, [coin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const marketRes = await api.get(`/crypto/market-data/${coin}`);
      const analysisRes = await api.get(`/crypto/analyze/${coin}`);
      setData(marketRes.data.prices);
      setAnalysis(analysisRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCoins = allCoins.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex">
      {/* 1. Glass-morphism Sidebar */}
      <aside className="w-72 bg-[#1e293b]/50 border-r border-slate-800 p-6 flex flex-col hidden md:flex backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Activity className="text-white" size={24} />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">CRYPTO<span className="text-blue-500">AI</span></span>
        </div>

        <nav className="space-y-2 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 px-2">Navigation</p>
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl font-bold transition-all border border-blue-500/20">
            <Activity size={18} /> Dashboard
          </Link>
          <Link to="/coins" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl font-semibold transition-all group">
            <Globe size={18} className="group-hover:text-blue-400" /> Market Overview
          </Link>
          <Link to="/comparison" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl font-semibold transition-all group">
            <Scale size={18} className="group-hover:text-purple-400" /> Compare Assets
          </Link>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl font-bold transition-all border border-transparent hover:border-rose-500/20"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight capitalize">{coin} <span className="text-blue-500">Analysis</span></h2>
            <p className="text-slate-500 text-sm font-medium mt-1 italic">Real-time Decision Support System</p>
          </div>

          {/* Styled Searchable Selector */}
          <div className="relative w-full md:w-80 group">
            <div className="flex items-center bg-[#1e293b] border border-slate-700 rounded-2xl px-4 py-3 shadow-2xl group-focus-within:border-blue-500 transition-all">
              <Search size={18} className="text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Find an asset..."
                className="bg-transparent outline-none text-sm w-full ml-3 text-white placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {searchTerm && (
              <div className="absolute z-50 w-full mt-2 bg-[#1e293b] border border-slate-700 rounded-2xl shadow-2xl max-h-64 overflow-y-auto backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                {filteredCoins.map(c => (
                  <div 
                    key={c.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-800 cursor-pointer border-b border-slate-800/50 last:border-0 group/item"
                    onClick={() => { setCoin(c.id); setSearchTerm(""); }}
                  >
                    <div className="flex items-center gap-3">
                      <img src={c.image} alt={c.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="text-sm font-bold text-white">{c.name}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{c.symbol}</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-600 group-hover/item:text-blue-500 transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* 3. Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-[#1e293b]/40 p-8 rounded-[32px] border border-slate-800/50 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-500" /> Market Trajectory
              </h3>
              {loading && <Loader2 className="animate-spin text-blue-500" size={20} />}
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px'}}
                    itemStyle={{color: '#3b82f6', fontWeight: 'bold'}}
                  />
                  <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot={false} animationDuration={1500} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-8 rounded-[32px] border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
              <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
                <BrainCircuit className="text-purple-400" /> Neural Insight
              </h3>
              
              {analysis && !loading ? (
                <div className="space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Action</p>
                      <p className={`text-4xl font-black tracking-tighter ${analysis.prediction === 'Rise' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {analysis.prediction}
                      </p>
                    </div>
                    {analysis.prediction === 'Rise' ? <TrendingUp size={40} className="text-emerald-500/20" /> : <TrendingDown size={40} className="text-rose-500/20" />}
                  </div>

                  <div className="bg-[#0f172a]/50 p-6 rounded-2xl border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Current Valuation</p>
                    <p className="text-2xl font-mono font-bold text-white tracking-tight">
                      ${analysis.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Model Confidence</p>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{analysis.confidence}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-600 gap-4">
                  <Loader2 className="animate-spin text-slate-700" size={32} />
                  <p className="text-sm font-medium animate-pulse">Running Random Forest Model...</p>
                </div>
              )}
            </div>

            {/* Disclaimer Mini-Card */}
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800/50">
               <p className="text-[9px] text-slate-500 leading-relaxed uppercase tracking-tighter">
                 {analysis?.disclaimer || "System processing educational data."}
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;