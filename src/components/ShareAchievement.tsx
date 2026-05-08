import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Share2, Trophy, ShieldCheck, Check } from 'lucide-react';

export const ShareAchievement: React.FC<{ day: number, name: string }> = ({ day, name }) => {
  const [toastMsg, setToastMsg] = useState('');

  const share = () => {
    const text = `UNIT_${name} has achieved level ${day} sovereignty in the Quiet Wealth protocol. System immunity increased by 42.8%. #QuietWealth #Sovereignty`;
    try {
      navigator.clipboard.writeText(text);
      setToastMsg('Transmission Copied');
      setTimeout(() => setToastMsg(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for some browsers in iframe
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setToastMsg('Transmission Copied');
      setTimeout(() => setToastMsg(''), 2000);
    }
  };

  const downloadReport = () => {
    const content = `
QUIET WEALTH PROTOCOL // PERFORMANCE REPORT
------------------------------------------
Unit Designation: ${name}
Sovereignty Level: Stage 01 Clear (Day ${day})
Immunity Index: 42.8%
Status: STABILIZED
------------------------------------------
This unit has successfully identified leaks, established impulse barriers, 
and mapped all primary assets. The neural link is secure.
------------------------------------------
TIMESTAMP: ${new Date().toLocaleString()}
SYSTEM_HASH: QW_X10_STABLE
    `;
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QW_REPORT_${name}_DAY10.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setToastMsg('Report Exported');
      setTimeout(() => setToastMsg(''), 2000);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download protocol failed. Grid restrictions might be active.');
    }
  };

  return (
    <div className="glass-panel p-8 rounded-none border-[#d4af37] shadow-[0_0_50px_rgba(212,175,55,0.15)] bg-gradient-to-br from-[#d4af37]/10 to-transparent relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <ShieldCheck size={120} />
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-[#d4af37] rounded-none text-black">
            <Trophy size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Milestone_Reached</h2>
            <p className="text-[#d4af37] font-mono text-[10px] uppercase tracking-[0.4em]">Node_10: Stabilization_Pulse</p>
          </div>
        </div>

        <div className="p-6 bg-black/40 border border-[#d4af37]/20 rounded-none">
          <div className="text-[8px] text-muted uppercase tracking-widest mb-4">Unit_Performance_Report</div>
          <div className="space-y-3">
             <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] text-white/60 uppercase font-mono">Designation:</span>
                <span className="text-[10px] text-[#d4af37] font-black uppercase font-mono">{name}</span>
             </div>
             <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] text-white/60 uppercase font-mono">Sovereignty_Lvl:</span>
                <span className="text-[10px] text-white font-black uppercase font-mono">Stage_01_Clear</span>
             </div>
             <div className="flex justify-between pb-2">
                <span className="text-[10px] text-white/60 uppercase font-mono">Immunity_Index:</span>
                <span className="text-[10px] text-green-400 font-black uppercase font-mono">42.8%</span>
             </div>
          </div>
        </div>

        <div className="flex gap-4 relative">
          <button 
            onClick={share}
            className="flex-1 py-4 bg-[#d4af37] text-black rounded-none text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Share2 size={16} /> Broadcast Achievement
          </button>
          <button 
            onClick={downloadReport}
            className="p-4 bg-white/5 border border-white/10 rounded-none text-white hover:bg-white/20 transition-all flex items-center justify-center"
            title="Download Performance Report"
          >
            <Download size={16} />
          </button>

          <AnimatePresence>
            {toastMsg && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute -top-12 left-0 right-0 flex justify-center pointer-events-none"
              >
                <div className="bg-green-500 text-black px-4 py-1.5 rounded-none text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg">
                  <Check size={12} /> {toastMsg}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
