import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scissors, 
  Plus, 
  Trash2, 
  Ghost,
  DollarSign,
  TrendingDown
} from 'lucide-react';

interface Sub {
  id: string;
  name: string;
  cost: number;
  period: 'monthly' | 'yearly';
}

export const SubKiller: React.FC<{ name: string }> = ({ name }) => {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(`qw_subs_${name}`);
    if (saved) {
      try { setSubs(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, [name]);

  useEffect(() => {
    localStorage.setItem(`qw_subs_${name}`, JSON.stringify(subs));
  }, [subs, name]);

  const addSub = () => {
    if (!newName || !newCost) return;
    const newSub: Sub = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      cost: parseFloat(newCost),
      period: 'monthly'
    };
    setSubs([...subs, newSub]);
    setNewName('');
    setNewCost('');
  };

  const removeSub = (id: string) => {
    setSubs(subs.filter(s => s.id !== id));
  };

  const yearlyWaste = useMemo(() => {
    return subs.reduce((acc, curr) => {
      return acc + (curr.period === 'monthly' ? curr.cost * 12 : curr.cost);
    }, 0);
  }, [subs]);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border-red-500/20 shadow-2xl">
      <div className="bg-red-500/10 p-4 border-b border-red-500/20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
            <Scissors size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Parasite Execution Node</h3>
            <p className="text-[8px] text-muted uppercase tracking-widest">Subscription Noise Filter</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="SERVICE NAME"
            value={newName}
            onChange={(e) => setNewName(e.target.value.toUpperCase())}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-white uppercase font-bold tracking-widest outline-none focus:border-red-400/50"
          />
          <input 
            type="number" 
            placeholder="PRICE"
            value={newCost}
            onChange={(e) => setNewCost(e.target.value)}
            className="w-24 bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-red-400 font-bold outline-none focus:border-red-400/50"
          />
          <button 
            onClick={addSub}
            className="px-6 py-3 bg-red-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
          >
            Log
          </button>
        </div>

        <div className="space-y-3">
          {subs.map((sub) => (
            <div key={sub.id} className="p-4 rounded-xl bg-white/2 border border-white/5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-red-400/10 text-red-400">
                  <Ghost size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-white uppercase tracking-widest">{sub.name}</div>
                  <div className="text-[10px] text-muted font-mono">${sub.cost.toFixed(2)}/mo</div>
                </div>
              </div>
              <button onClick={() => removeSub(sub.id)} className="p-2 text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {subs.length > 0 && (
            <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-red-400/70 uppercase tracking-widest">Total Annual Leakage</span>
                <span className="text-xl font-mono font-bold text-red-400">${yearlyWaste.toFixed(2)}</span>
              </div>
              <div className="text-[8px] text-muted uppercase tracking-widest italic flex items-center gap-2">
                <TrendingDown size={10} /> This capital is currently stolen by the system
              </div>
            </div>
          )}

          {subs.length === 0 && (
            <div className="py-12 text-center bg-white/2 border border-dashed border-white/5 rounded-2xl">
              <DollarSign className="mx-auto text-muted/20 mb-3" size={24} />
              <p className="text-[9px] text-muted uppercase tracking-widest">No parasites recorded yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-red-500/5 p-3 px-6 text-[8px] text-red-400/60 uppercase tracking-[0.3em] italic">
        * "Own your tools, or your tools will own you."
      </div>
    </div>
  );
};
