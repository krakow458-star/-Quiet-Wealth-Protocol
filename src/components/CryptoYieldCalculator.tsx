import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ChevronRight, 
  Coins, 
  ExternalLink,
  Calculator,
  ArrowUpRight
} from 'lucide-react';
import { AFFILIATE_LINKS } from '../protocolData';

interface YieldResult {
  amount: number;
  years: number;
  finalValue: number;
  date: string;
}

export const CryptoYieldCalculator: React.FC<{ name: string }> = ({ name }) => {
  const [amount, setAmount] = useState<string>('');
  const [years, setYears] = useState<number>(1);
  const [result, setResult] = useState<YieldResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`qw_day22_yield_${name}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setResult(parsed);
        setAmount(parsed.amount.toString());
        setYears(parsed.years);
      } catch (e) {
        console.error('Failed to load yield data', e);
      }
    }
  }, [name]);

  const calculateYield = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    const rate = 0.10; // 10% APY
    const finalValue = numAmount * Math.pow((1 + rate), years);

    const newResult: YieldResult = {
      amount: numAmount,
      years: years,
      finalValue: finalValue,
      date: new Date().toISOString()
    };

    setResult(newResult);
    localStorage.setItem(`qw_day22_yield_${name}`, JSON.stringify(newResult));
  };

  const interestEarned = result ? result.finalValue - result.amount : 0;

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border-green-500/20 shadow-2xl">
      <div className="bg-green-500/10 p-4 border-b border-green-500/20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
            <Coins size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Crypto Yield Calculator</h3>
            <p className="text-[8px] text-muted uppercase tracking-widest">Hard Asset Growth Engine</p>
          </div>
        </div>
        <div className="text-[10px] text-green-400 font-bold font-mono">EST_APY: 10%</div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] text-muted font-bold uppercase tracking-widest">Investment Amount ($)</label>
            <input 
              type="number" 
              placeholder="e.g. 1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xl text-white font-mono outline-none focus:border-green-400/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-muted font-bold uppercase tracking-widest">Time Horizon (Years)</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 3, 5, 10].map(y => (
                <button 
                  key={y}
                  onClick={() => setYears(y)}
                  className={`py-2 rounded-lg text-[10px] font-bold transition-all border ${
                    years === y 
                      ? 'bg-green-500 text-black border-green-500' 
                      : 'bg-white/5 text-muted border-white/10 hover:border-white/20'
                  }`}
                >
                  {y}Y
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={calculateYield}
            className="w-full py-4 bg-green-500 text-black rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] flex items-center justify-center gap-3"
          >
            <Calculator size={14} /> Calculate Potential Earnings
          </button>
        </div>

        {result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <TrendingUp size={120} />
              </div>
              
              {/* Scanning line effect */}
              <div className="absolute inset-x-0 top-0 h-px bg-green-500/50 blur-[2px] animate-scan pointer-events-none" />
              
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div>
                  <div className="text-[8px] text-muted uppercase tracking-widest mb-1">Initial Principal</div>
                  <div className="text-sm font-mono text-white">${result.amount.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] text-muted uppercase tracking-widest mb-1">Horizon</div>
                  <div className="text-sm font-mono text-white">{result.years} Years</div>
                </div>
              </div>

              <div className="pt-4 border-t border-green-500/10">
                <div className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                  <ArrowUpRight size={12} /> Total Estimated Value
                </div>
                <div className="text-3xl font-black text-white font-mono tracking-tighter">
                  ${result.finalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[9px] text-green-400/60 font-medium uppercase mt-1">
                  Profits Reclaimed: +${interestEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
              <p className="text-[10px] text-gray-400 italic leading-relaxed text-center">
                "Don't work for money. Make your capital work for you in the high-yield sovereign layer."
              </p>
              <a 
                href={AFFILIATE_LINKS.nexo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-3 bg-white text-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-green-400 transition-all flex items-center justify-center gap-2"
              >
                Join Nexo — Earn 10% APY <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="bg-green-500/5 p-3 px-6 text-[8px] text-green-400/60 uppercase tracking-[0.3em] italic">
        * Estimated growth based on compound interest. Past performance is no guarantee of future results.
      </div>
    </div>
  );
};
