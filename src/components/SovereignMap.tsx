import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Zap, Shield, Target, ChevronDown, CheckCircle2 } from 'lucide-react';
import { PROTOCOL_DAYS } from '../protocolData';

interface SovereignMapProps {
  currentDay: number;
  unlockedDays: number[];
  onSelectDay: (day: number) => void;
}

export const SovereignMap: React.FC<SovereignMapProps> = ({ currentDay, unlockedDays, onSelectDay }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(currentDay);

  const getDayStatus = (day: number) => {
    const maxUnlocked = Math.max(...unlockedDays);
    if (day < maxUnlocked) return 'COMPLETED';
    if (day === maxUnlocked) return 'ACTIVE_NODE';
    if (unlockedDays.includes(day)) return 'UNLOCKED';
    return 'ENCRYPTED';
  };

  return (
    <div className="glass-panel rounded-none border border-[#d4af37]/20 shadow-2xl relative overflow-hidden flex flex-col h-[80vh]">
      <div className="p-6 border-b border-white/5 bg-black/40 backdrop-blur-md shrink-0 z-10 relative">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Protocol_Roadmap</h3>
            <p className="text-[10px] text-[#d4af37] uppercase tracking-widest opacity-60 mt-1">Architectural Sequence: 30 Nodes</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#d4af37]/10 rounded-none border border-[#d4af37]/30 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <Target size={14} className="text-[#d4af37]" />
            <span className="text-[10px] font-mono font-bold text-[#d4af37]">{Math.round((unlockedDays.length / 30) * 100)}% DISCOVERY</span>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-6 space-y-4 custom-scrollbar relative">
        {/* Background line for timeline */}
        <div className="absolute left-10 top-0 bottom-0 w-px bg-white/5" />

        {PROTOCOL_DAYS.map((dayData, index) => {
          const day = dayData.day;
          const status = getDayStatus(day);
          const isUnlocked = unlockedDays.includes(day);
          const isExpanded = expandedDay === day;
          const isCompleted = status === 'COMPLETED';

          return (
            <div key={day} className="relative z-10 flex gap-6">
              {/* Timeline marker */}
              <div className="flex flex-col items-center shrink-0 w-8">
                <div 
                  className={`w-8 h-8 rounded-none border-2 flex items-center justify-center bg-black transition-all duration-300
                    ${status === 'ACTIVE_NODE' ? 'border-[#d4af37] text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.6)]' : ''}
                    ${isCompleted ? 'border-[#d4af37]/40 text-[#d4af37]/60' : ''}
                    ${!isUnlocked ? 'border-white/10 text-white/20' : ''}
                    ${isUnlocked && status !== 'ACTIVE_NODE' && !isCompleted ? 'border-white/40 text-white/80' : ''}
                  `}
                >
                  {isUnlocked ? (
                    <span className="text-[10px] font-mono font-bold">{day.toString().padStart(2, '0')}</span>
                  ) : (
                    <Lock size={12} className="opacity-50" />
                  )}
                </div>
                {/* Connecting line inside map, if you want it unbroken, we already have the absolute line, but this can overlay */}
                {index !== PROTOCOL_DAYS.length - 1 && (
                  <div className={`w-px h-full mt-2 transition-colors ${isCompleted ? 'bg-[#d4af37]/40' : 'bg-white/5'}`} />
                )}
              </div>

              {/* Card */}
              <div className="flex-1 pb-6">
                <div 
                  onClick={() => isUnlocked && setExpandedDay(isExpanded ? null : day)}
                  className={`
                    group rounded-none border transition-all duration-300 overflow-hidden
                    ${isUnlocked ? 'cursor-pointer hover:border-[#d4af37]/40 bg-zinc-900/50 hover:bg-zinc-900/80' : 'cursor-not-allowed bg-black/40 border-white/5 opacity-60'}
                    ${isExpanded ? 'border-[#d4af37]/50 shadow-[0_10px_30px_rgba(212,175,55,0.1)] bg-zinc-900/80' : 'border-white/10'}
                  `}
                >
                  {/* Card Header */}
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-[9px] font-mono font-bold tracking-widest uppercase ${status === 'ACTIVE_NODE' ? 'text-[#d4af37]' : 'text-muted'}`}>
                          Node_{day.toString().padStart(2, '0')}
                        </span>
                        {isCompleted && <CheckCircle2 size={12} className="text-[#d4af37]/60" />}
                      </div>
                      <h4 className={`text-sm md:text-base font-black uppercase tracking-wider ${isUnlocked ? 'text-white' : 'text-white/40'}`}>
                        {isUnlocked ? dayData.title : 'ENCRYPTED_DATA'}
                      </h4>
                    </div>
                    {isUnlocked && (
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-white/40 group-hover:text-[#d4af37]/60">
                         <ChevronDown size={20} />
                      </motion.div>
                    )}
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && isUnlocked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/5"
                      >
                        <div className="p-5 bg-black/40 space-y-6">
                          <div className="space-y-2">
                             <div className="text-[10px] text-muted uppercase tracking-widest font-bold">Mission Directive //</div>
                             <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-[#d4af37]/30 pl-3">
                               "{dayData.mission}"
                             </p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="p-3 bg-white/5 rounded-none border border-white/10">
                              <div className="text-[8px] text-muted uppercase tracking-widest mb-1">Capital Yield</div>
                              <div className="text-xs font-mono text-[#d4af37]">+{dayData.rewards.capital}</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-none border border-white/10">
                              <div className="text-[8px] text-muted uppercase tracking-widest mb-1">Focus Yield</div>
                              <div className="text-xs font-mono text-blue-400">+{dayData.rewards.focus}</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-none border border-white/10">
                              <div className="text-[8px] text-muted uppercase tracking-widest mb-1">Vitality Yield</div>
                              <div className="text-xs font-mono text-red-400">+{dayData.rewards.vitality}</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-none border border-white/10">
                              <div className="text-[8px] text-muted uppercase tracking-widest mb-1">Sovereignty</div>
                              <div className="text-xs font-mono text-purple-400">+{dayData.rewards.sovereignty}</div>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDay(day);
                            }}
                            className="w-full relative py-4 bg-[#d4af37]/10 border border-[#d4af37]/30 hover:bg-[#d4af37]/20 text-[#d4af37] font-black text-[10px] tracking-[0.4em] uppercase rounded-none overflow-hidden transition-all flex items-center justify-center gap-3"
                          >
                            <Zap size={14} className="animate-pulse" />
                            {status === 'COMPLETED' ? 'Review Protocol' : 'Execute Protocol'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

