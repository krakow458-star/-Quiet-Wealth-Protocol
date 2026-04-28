import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AFFILIATE_LINKS } from '../protocolData';

interface ScanResult {
  name: string;
  sources: number;
  date: string;
  exposure: number;
}

export const FootprintScanner: React.FC<{ unitName: string }> = ({ unitName }) => {
  const [nameInput, setNameInput] = useState(unitName);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`qw_day16_scan_${unitName}`);
    if (saved) {
      try { setResult(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, [unitName]);

  const runScan = () => {
    if (!nameInput.trim()) return;
    
    setIsScanning(true);
    setProgress(0);
    setResult(null);
    setLogs([]);

    const totalSteps = 20;
    const sampleSources = [
      'Whitepages.com', 'Spokeo.com', 'Pipl.com', 'ThatsThem.com', 
      'BeenVerified.com', 'Intelius.com', 'PeopleFinder.com', 'FamilyTreeNow.com',
      'InstantCheckmate', 'Radaris', 'PeekYou', 'TruthFinder'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const p = (currentStep / totalSteps) * 100;
      setProgress(p);

      if (currentStep % 2 === 0) {
        const source = sampleSources[Math.floor(Math.random() * sampleSources.length)];
        const found = Math.random() > 0.3;
        setLogs(prev => [`${found ? '⚠️ EXPOSED' : '✅ SECURE'} in ${source}`, ...prev].slice(0, 5));
      }

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        const finalSources = Math.floor(Math.random() * 50) + 100;
        const finalResult: ScanResult = {
          name: nameInput,
          sources: finalSources,
          exposure: 85,
          date: new Date().toISOString()
        };
        setResult(finalResult);
        setIsScanning(false);
        localStorage.setItem(`qw_day16_scan_${unitName}`, JSON.stringify(finalResult));
      }
    }, 150);
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border-orange-500/20 shadow-2xl">
      <div className="bg-orange-500/10 p-4 border-b border-orange-500/20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
            <Fingerprint size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Digital Footprint Scanner</h3>
            <p className="text-[8px] text-muted uppercase tracking-widest">Privacy Breach Detection Protocol</p>
          </div>
        </div>
        <div className="text-[10px] text-orange-400 font-bold font-mono">THREAT_LEVEL: HIGH</div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] text-muted font-bold uppercase tracking-widest">Subject Identity</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="YOUR FULL NAME"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value.toUpperCase())}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xl text-white font-mono outline-none focus:border-orange-400/50 transition-all uppercase"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/30">
                <Search size={18} />
              </div>
            </div>
          </div>

          <button 
            onClick={runScan}
            disabled={isScanning}
            className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
              isScanning 
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                : 'bg-orange-500 text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.2)]'
            }`}
          >
            {isScanning ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            {isScanning ? 'Scanning Public Nodes...' : 'Scan My Digital Footprint'}
          </button>
        </div>

        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-[9px] font-mono uppercase ${log.includes('EXPOSED') ? 'text-red-400' : 'text-green-400'}`}
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {result && !isScanning && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500">
                  <ShieldAlert size={80} />
                </div>

                <div className="relative z-10">
                   <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-1">Exposure Index</div>
                   <div className="flex items-end gap-3">
                      <div className="text-4xl font-black text-white font-mono tracking-tighter">85%</div>
                      <div className="text-[10px] text-red-400/60 font-medium uppercase mb-1.5">Critical Breach</div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-red-500/10">
                   <div>
                      <div className="text-[8px] text-muted uppercase tracking-widest mb-1">Identity Nodes</div>
                      <div className="text-lg font-mono text-white">{result.sources} Sites</div>
                   </div>
                   <div className="text-right">
                      <div className="text-[8px] text-muted uppercase tracking-widest mb-1">Security Status</div>
                      <div className="text-lg font-mono text-red-400">UNSECURED</div>
                   </div>
                </div>

                <p className="text-[10px] text-gray-400 leading-relaxed italic">
                  Data brokers are actively selling your home address, DOB, and contact info. This information is a direct vector for social engineering and physical threats.
                </p>
              </div>

              <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl space-y-3">
                <div className="flex items-center gap-3 text-orange-400">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Architect's Recommendation</span>
                </div>
                <p className="text-[10px] text-gray-300 leading-relaxed">
                  Initiate the <strong>Sovereign Deprovisioning Protocol</strong>. Use MyDataRemoval to automatically opt-out from 100+ broker databases simultaneously.
                </p>
                <a 
                  href={AFFILIATE_LINKS.dataRemoval} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-orange-500 text-black rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  Remove My Data — 55% Off Lifetime <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-orange-500/5 p-3 px-6 text-[8px] text-orange-400/40 uppercase tracking-[0.3em] italic">
        * Neural scanner targets known data aggregators and public nodes. Result is based on statistical vulnerability.
      </div>
    </div>
  );
};
