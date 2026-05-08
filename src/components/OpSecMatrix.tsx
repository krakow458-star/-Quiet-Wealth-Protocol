import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ShieldAlert, MonitorCheck, Key, EyeOff, GlobeLock, Smartphone, HardDrive, Wifi, ServerCog } from 'lucide-react';
import { sounds } from '../lib/audio';

const OPSEC_ITEMS = [
  { id: 'passmgr', label: 'Offline Password Manager', desc: 'No browser built-in managers. Keepass or similar.', weight: 15, icon: <Key /> },
  { id: '2fakh', label: 'Hardware Security Key (Yubikey)', desc: 'SMS 2FA is compromised. Hardware keys are mandatory.', weight: 20, icon: <HardDrive /> },
  { id: 'vpn', label: 'No-Log VPN Routing', desc: 'Network traffic masked at hardware level.', weight: 10, icon: <Wifi /> },
  { id: 'dns', label: 'Encrypted DNS (DoH/DoT)', desc: 'ISP cannot monitor DNS requests.', weight: 10, icon: <ServerCog /> },
  { id: 'mail', label: 'Encrypted E2E Email', desc: 'ProtonMail, Tuta. No scanning of inbound/outbound.', weight: 15, icon: <GlobeLock /> },
  { id: 'browser', label: 'Hardened Browser', desc: 'Mullvad, Tor, or strict Librewolf configuration.', weight: 10, icon: <MonitorCheck /> },
  { id: 'os', label: 'Privacy-focused OS', desc: 'GrapheneOS on mobile, Linux on desktop.', weight: 20, icon: <Smartphone /> },
];

export const OpSecMatrix = ({ name }: { name: string }) => {
  const [activeItems, setActiveItems] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`qw_opsec_${name.toUpperCase()}`);
    if (saved) {
      try { setActiveItems(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, [name]);

  const toggleItem = (id: string) => {
    if (scanning) return;
    sounds.step();
    let next;
    if (activeItems.includes(id)) {
      next = activeItems.filter(i => i !== id);
    } else {
      next = [...activeItems, id];
    }
    setActiveItems(next);
    localStorage.setItem(`qw_opsec_${name.toUpperCase()}`, JSON.stringify(next));
  };

  const getScore = () => {
    return OPSEC_ITEMS.reduce((acc, item) => activeItems.includes(item.id) ? acc + item.weight : acc, 0);
  };

  const score = getScore();
  let rating = "CRITICAL EXPOSURE";
  let color = "text-red-500";
  if (score >= 40) { rating = "VULNERABLE"; color = "text-orange-400"; }
  if (score >= 70) { rating = "SECURE"; color = "text-blue-400"; }
  if (score >= 90) { rating = "GHOST"; color = "text-[#d4af37]"; }

  const runDiagnostics = () => {
    setScanning(true);
    sounds.glitch();
    setTimeout(() => {
      setScanning(false);
      sounds.success();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
           <motion.div 
             initial={{ width: 0 }} 
             animate={{ width: `${score}%` }} 
             className={`h-full ${color.replace('text-', 'bg-')}`} 
           />
        </div>
        
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-muted mb-1">Threat Model Score</h3>
            <div className={`text-3xl font-black font-mono tracking-widest ${color}`}>{score}%</div>
          </div>
          <div className="text-right">
             <div className="text-[8px] uppercase tracking-[0.4em] text-muted mb-1">Classification</div>
             <div className={`text-lg font-black uppercase tracking-widest ${color}`}>{rating}</div>
          </div>
        </div>

        <div className="space-y-2">
          {OPSEC_ITEMS.map((item, idx) => {
            const isActive = activeItems.includes(item.id);
            return (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`w-full flex items-center justify-between p-3 border rounded-none transition-all ${
                  isActive 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-black border-white/5 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                 <div className="flex items-center gap-4">
                    <div className={`${isActive ? 'text-green-400' : 'text-muted'}`}>
                      {React.cloneElement(item.icon as React.ReactElement, { size: 16 })}
                    </div>
                    <div className="text-left">
                       <div className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-gray-400'}`}>
                         {item.label}
                       </div>
                       <div className="text-[9px] text-muted tracking-wide mt-0.5">{item.desc}</div>
                    </div>
                 </div>
                 <div className={`text-xs font-mono font-bold ${isActive ? 'text-green-400' : 'text-muted'}`}>
                    +{item.weight}
                 </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <button 
        onClick={runDiagnostics}
        disabled={scanning}
        className="w-full py-4 glass-panel border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#d4af37]/10 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {scanning ? (
          <>
             <MonitorCheck size={14} className="animate-spin" /> RUNNING NODE DIAGNOSTICS...
          </>
        ) : (
          <>
             <ShieldAlert size={14} /> RE-EVALUATE THREAT MATRIX
          </>
        )}
      </button>
    </div>
  );
};
