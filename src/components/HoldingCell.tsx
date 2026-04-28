import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Plus, 
  Trash2, 
  Heart,
  Timer
} from 'lucide-react';

interface WishlistItem {
  id: string;
  item: string;
  cost: number;
  addedAt: number;
}

export const HoldingCell: React.FC<{ name: string }> = ({ name }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(`qw_holding_${name}`);
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, [name]);

  useEffect(() => {
    localStorage.setItem(`qw_holding_${name}`, JSON.stringify(items));
  }, [items, name]);

  const addItem = () => {
    if (!newItemName || !newItemCost) return;
    const newItem: WishlistItem = {
      id: Math.random().toString(36).substr(2, 9),
      item: newItemName,
      cost: parseFloat(newItemCost),
      addedAt: Date.now()
    };
    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemCost('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const isLocked = (addedAt: number) => {
    return Date.now() - addedAt < 24 * 60 * 60 * 1000;
  };

  const getRemaining = (addedAt: number) => {
    const diff = 24 * 60 * 60 * 1000 - (Date.now() - addedAt);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border-blue-500/20 shadow-2xl">
      <div className="bg-blue-500/10 p-4 border-b border-blue-500/20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Holding Cell (24h Buffer)</h3>
            <p className="text-[8px] text-muted uppercase tracking-widest">Digital Impulse Friction Layer</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            placeholder="DESIRED OBJECT"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value.toUpperCase())}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-white uppercase font-bold tracking-widest outline-none focus:border-blue-400/50"
          />
          <input 
            type="number" 
            placeholder="COST"
            value={newItemCost}
            onChange={(e) => setNewItemCost(e.target.value)}
            className="w-full sm:w-24 bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-blue-400 font-bold outline-none focus:border-blue-400/50"
          />
          <button 
            onClick={addItem}
            className="px-6 py-3 bg-blue-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
          >
            Lock Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-white/2 border border-white/5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isLocked(item.addedAt) ? 'bg-red-400/10 text-red-400' : 'bg-green-400/10 text-green-400'}`}>
                  {isLocked(item.addedAt) ? <Clock size={16} /> : <Timer size={16} />}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-white uppercase tracking-widest">{item.item}</div>
                  <div className="text-[10px] text-muted font-mono">${item.cost.toFixed(2)}</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {isLocked(item.addedAt) ? (
                   <div className="text-right">
                      <div className="text-[8px] text-red-400 font-bold uppercase tracking-widest">Locked</div>
                      <div className="text-[10px] text-muted font-mono">{getRemaining(item.addedAt)}</div>
                   </div>
                ) : (
                   <div className="text-right">
                      <div className="text-[8px] text-green-400 font-bold uppercase tracking-widest">Cleared</div>
                      <div className="text-[10px] text-muted font-mono">Ready for execution</div>
                   </div>
                )}
                <button onClick={() => removeItem(item.id)} className="p-2 text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="py-12 text-center bg-white/2 border border-dashed border-white/5 rounded-2xl">
              <Heart className="mx-auto text-muted/20 mb-3" size={24} />
              <p className="text-[9px] text-muted uppercase tracking-widest">No active desires detected</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-500/5 p-3 px-6 text-[8px] text-blue-400/60 uppercase tracking-[0.3em] italic">
        * "Desire is a contract you make with yourself to be unhappy until you get what you want."
      </div>
    </div>
  );
};
