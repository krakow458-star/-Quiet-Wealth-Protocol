import React from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, Database } from 'lucide-react';

interface DataVaultProps {
  gameState: any;
}

export const DataVault: React.FC<DataVaultProps> = ({ gameState }) => {
  const artifacts = [
    { day: 1, name: 'Genesis Block', desc: 'The initial commitment cryptographic signature.', icon: '⚛️' },
    { day: 3, name: 'Attention Filter', desc: 'Cognitive defense mechanism matrix.', icon: '👁️' },
    { day: 7, name: 'Sovereign Core', desc: 'The first week unchained from the system.', icon: '🔥' },
    { day: 14, name: 'Wealth Vault', desc: 'Proof of accumulated capital and resources.', icon: '💰' },
    { day: 21, name: 'Zenith Node', desc: 'High-frequency focus transmitter.', icon: '⛩️' },
    { day: 30, name: 'Apex Key', desc: 'Complete sovereign autonomy unlocked.', icon: '🗝️' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto font-mono">
      <div className="mb-8 p-6 glass-panel rounded-none border border-[#d4af37]/10 bg-black/40 backdrop-blur-md">
        <h2 className="text-xl font-bold text-[#d4af37] uppercase tracking-widest flex items-center gap-2">
          <Database size={24} /> System Artifact Vault
        </h2>
        <p className="text-xs text-muted mt-2">Secured cryptographic milestones representing neural achievements. Unfalsifiable proof of your sovereignty.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artifacts.map((art, idx) => {
          const unlocked = gameState.day > art.day || (gameState.day === art.day && gameState.unlocked.includes(art.day));
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative overflow-hidden rounded-none border p-6 ${unlocked ? 'bg-black/60 border-[#d4af37]/30 glass-panel hover:border-[#d4af37]/60 transition-all' : 'bg-black/20 border-white/5 opacity-50 grayscale'}`}
            >
              {unlocked ? (
                <div className="absolute top-4 right-4 text-[#d4af37]"><Unlock size={16} /></div>
              ) : (
                <div className="absolute top-4 right-4 text-white/30"><Lock size={16} /></div>
              )}
              
              <div className="text-4xl mb-4 grayscale filter hover:grayscale-0 transition-all">{art.icon}</div>
              
              <h3 className={`text-sm font-bold uppercase tracking-widest mb-2 ${unlocked ? 'text-white' : 'text-white/30'}`}>
                {art.name}
              </h3>
              
              <div className="text-[10px] uppercase text-[#d4af37]/60 tracking-widest mb-4">
                UNLOCK: PROTOCOL DAY {art.day}
              </div>
              
              <p className="text-xs text-muted leading-relaxed">
                {unlocked ? art.desc : 'ENCRYPTED DATA BLOCK. ACCESS DENIED.'}
              </p>

              {unlocked && (
                <div className="mt-4 pt-4 border-t border-white/10 text-[9px] text-white/40 font-mono flex justify-between">
                  <span>HASH VERIFIED</span>
                  <span>0x{Math.random().toString(16).slice(2, 8).toUpperCase()}...</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
