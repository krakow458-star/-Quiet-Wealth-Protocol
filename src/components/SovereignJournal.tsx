import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  CheckCircle2, 
  Terminal,
  Activity,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JournalEntry {
  day: number;
  reflection: string;
  timestamp: number;
}

export const SovereignJournal: React.FC<{ day: number; name: string; task: string }> = ({ day, name, task }) => {
  const [reflection, setReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [history, setHistory] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`qw_journal_${name}`);
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, [name]);

  const saveEntry = () => {
    if (!reflection) return;
    const newEntry: JournalEntry = {
      day,
      reflection,
      timestamp: Date.now()
    };
    const updated = [...history.filter(h => h.day !== day), newEntry];
    setHistory(updated);
    localStorage.setItem(`qw_journal_${name}`, JSON.stringify(updated));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const currentEntry = history.find(h => h.day === day);

  return (
    <div className="glass-panel rounded-none overflow-hidden border-[#d4af37]/20 shadow-2xl">
      <div className="bg-[#d4af37]/10 p-4 border-b border-[#d4af37]/20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#d4af37]/20 rounded-none text-[#d4af37]">
            <PenTool size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Sovereign Journal</h3>
            <p className="text-[8px] text-muted uppercase tracking-widest">Daily Adherence Protocol</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-none ${currentEntry ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 animate-pulse'}`} />
           <span className="text-[8px] text-muted uppercase font-mono">{currentEntry ? 'SYNC_COMPLETE' : 'AWAITING_INPUT'}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
           <div className="p-4 bg-black/40 border border-white/5 rounded-none">
              <div className="text-[8px] text-[#d4af37] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Terminal size={10} /> Active Objective
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed italic">
                 "{task}"
              </p>
           </div>

           <div className="relative">
              <textarea 
                value={reflection || (currentEntry?.reflection || '')}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="LOG YOUR PROGRESS OR CHALLENGES..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-none p-4 text-[11px] text-white font-mono placeholder:text-muted/30 outline-none focus:border-[#d4af37]/30 transition-all resize-none"
              />
              <div className="absolute bottom-3 right-3 text-[7px] text-muted/40 uppercase font-mono">
                 Neural_Input_Active // Layer_7
              </div>
           </div>

           <button 
             onClick={saveEntry}
             disabled={isSaved}
             className={`w-full py-4 rounded-none text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
               isSaved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-[#d4af37] text-black hover:scale-[1.02] active:scale-95'
             }`}
           >
             {isSaved ? <CheckCircle2 size={14} /> : <Activity size={14} />}
             {isSaved ? 'Synchronization Successful' : 'Upload to Core Architecture'}
           </button>
        </div>

        {history.length > 0 && (
          <div className="pt-4 border-t border-white/5">
             <div className="text-[8px] text-muted font-bold uppercase tracking-widest mb-3">Sync History</div>
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {history.sort((a, b) => b.day - a.day).slice(0, 5).map(entry => (
                   <div key={entry.day} className="flex-shrink-0 p-2 bg-white/2 border border-white/5 rounded-none flex items-center gap-2 min-w-[60px] justify-center opacity-60 hover:opacity-100 transition-opacity">
                      <span className="text-[8px] text-[#d4af37] font-bold">D{entry.day}</span>
                      <CheckCircle2 size={10} className="text-green-500" />
                   </div>
                ))}
                {history.length > 5 && <div className="p-2 flex items-center"><ChevronRight size={12} className="text-muted" /></div>}
             </div>
          </div>
        )}
      </div>

      <div className="bg-[#d4af37]/5 p-3 px-6 text-[8px] text-[#d4af37]/40 uppercase tracking-[0.3em] italic">
        * "Thought without action is a leak. Action without thought is noise."
      </div>
    </div>
  );
};
