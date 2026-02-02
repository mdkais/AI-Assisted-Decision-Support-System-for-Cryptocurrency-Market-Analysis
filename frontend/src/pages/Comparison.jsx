import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Scale, ArrowLeft, BrainCircuit, TrendingUp, TrendingDown, Loader2, Zap } from 'lucide-react';

const Comparison = () => {
  const [allCoins, setAllCoins] = useState([]);
  const [coinA, setCoinA] = useState('bitcoin');
  const [coinB, setCoinB] = useState('ethereum');
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await api.get('/crypto/list-coins');
        setAllCoins(res.data);
      } catch (err) { console.error(err); }
    };
    fetchList();
  }, []);

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true);
      try {
        const [resA, resB] = await Promise.all([
          api.get(`/crypto/analyze/${coinA}`),
          api.get(`/crypto/analyze/${coinB}`)
        ]);
        setDataA(resA.data);
        setDataB(resB.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchComparison();
  }, [coinA, coinB]);

  // Design Logic: Determine which coin is "Better"
  const getVerdict = () => {
    if (!dataA || !dataB) return null;
    if (dataA.prediction === 'Rise' && dataB.prediction === 'Fall') return dataA.coin;
    if (dataB.prediction === 'Rise' && dataA.prediction === 'Fall') return dataB.coin;
    return "Neutral";
  };

  const ComparisonCard = ({ analysis, onSelect, isWinner }) => (
    <div className={`relative transition-all duration-500 rounded-3xl p-1 ${isWinner ? 'bg-gradient-to-b from-blue-500 to-purple-600 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'bg-gray-700/50'}`}>
      <div className="bg-[#1e293b] rounded-[22px] p-8 h-full">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Select Asset</label>
        <select 
          className="w-full bg-[#0f172a] border border-gray-700 p-4 rounded-xl mb-8 text-blue-400 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
          value={analysis?.coin || ""}
          onChange={(e) => onSelect(e.target.value)}
        >
          {allCoins.map(c => <option key={c.id} value={c.id}>{c.name} ({c.symbol.toUpperCase()})</option>)}
        </select>

        {analysis ? (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center">
              <p className="text-gray-400 text-xs uppercase font-bold tracking-tighter mb-1">Live Valuation</p>
              <p className="text-4xl font-mono font-bold text-white tracking-tight">
                ${analysis.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className={`p-6 rounded-2xl border ${analysis.prediction === 'Rise' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
              <div className="flex items-center gap-2 mb-3">
                <BrainCircuit size={20} className="text-purple-400" />
                <span className="text-xs font-black uppercase text-gray-400">AI Momentum Forecast</span>
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-3xl font-black ${analysis.prediction === 'Rise' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {analysis.prediction}
                </p>
                {analysis.prediction === 'Rise' ? <TrendingUp className="text-emerald-400" /> : <TrendingDown className="text-rose-400" />}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-gray-600 italic">Syncing market data...</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <Link to="/dashboard" className="group text-gray-500 flex items-center gap-2 text-sm mb-4 hover:text-blue-400 transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </Link>
            <h1 className="text-5xl font-extrabold tracking-tighter text-white">
              Comparison <span className="text-blue-500">Engine</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Parallel AI Analysis for Strategic Entries</p>
          </div>
          <div className="flex items-center gap-4 bg-[#1e293b] p-4 rounded-2xl border border-gray-800">
            <Scale className="text-blue-500" size={32} />
            {loading && <Loader2 className="animate-spin text-blue-500" />}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
          <ComparisonCard 
            analysis={dataA} 
            onSelect={setCoinA} 
            isWinner={getVerdict() === dataA?.coin}
          />
          <ComparisonCard 
            analysis={dataB} 
            onSelect={setCoinB} 
            isWinner={getVerdict() === dataB?.coin}
          />
        </div>

        {/* Dynamic Verdict Logic */}
        {dataA && dataB && (
          <div className="mt-16 p-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-in slide-in-from-bottom duration-1000">
            <div className="bg-[#1e293b]/50 backdrop-blur-xl p-10 rounded-3xl text-center border border-white/5">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                <Zap size={14} /> AI Recommendation
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                {getVerdict() === "Neutral" 
                  ? "Market Sentiment is Symmetrical" 
                  : `${getVerdict().toUpperCase()} shows stronger bullish signals`}
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                The Decision Support System suggests {getVerdict() === "Neutral" 
                  ? "waiting for a clearer divergence in price action." 
                  : `prioritizing ${getVerdict()} for current-window long positions.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comparison;