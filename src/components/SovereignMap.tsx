import React from 'react';
import { motion } from 'motion/react';
import { 
  Lock, 
  CheckCircle2, 
  Circle, 
  Trophy, 
  Zap, 
  Shield, 
  Target,
  ChevronRight
} from 'lucide-react';

interface SovereignMapProps {
  currentDay: number;
  unlockedDays: number[];
  onSelectDay: (day: number) => void;
}

export const SovereignMap: React.FC<SovereignMapProps> = ({ currentDay, unlockedDays, onSelectDay }) => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const getDayIcon = (day: number) => {
    if (day < currentDay || (unlockedDays.includes(day + 1) && day < currentDay)) return <CheckCircle2 size={14} className="text-green-400" />;
    if (day === currentDay) return <Zap size={14} className="text-gold animate-pulse" />;
    if (unlockedDays.includes(day)) return <Circle size={14} className="text-blue-400" />;
    if (day === 10 || day === 20 || day === 30) return <Trophy size={14} className="text-purple-400 opacity-40" />;
    return <Lock size={14} className="text-white/20" />;
  };

  const getDayStatus = (day: number) => {
    if (unlockedDays.includes(day + 1)) return 'COMPLETED';
    if (day === currentDay) return 'ACTIVE_NODE';
    if (unlockedDays.includes(day)) return 'UNLOCKED';
    return 'ENCRYPTED';
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border-gold/20 shadow-2xl overflow-hidden relative">
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Protocol_Roadmap</h3>
          <p className="text-[8px] text-gold uppercase tracking-widest opacity-60">Architectural Sequence: 30 Nodes</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-gold/10 rounded-full border border-gold/30">
          <Target size={12} className="text-gold" />
          <span className="text-[10px] font-mono font-bold text-gold">{Math.round((unlockedDays.length / 30) * 100)}% DISCOVERY</span>
        </div>
      </div>

      <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3">
        {days.map((day) => {
          const isActive = day === currentDay;
          const isUnlocked = unlockedDays.includes(day);
          const isCompleted = day < currentDay && unlockedDays.includes(day + 1);
          const isMilestone = day === 10 || day === 20 || day === 30;

          return (
            <motion.div
              key={day}
              whileHover={isUnlocked ? { scale: 1.05, y: -2 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
              onClick={() => isUnlocked && onSelectDay(day)}
              className={`
                relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer
                ${isActive ? 'bg-gold/20 border-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]' : ''}
                ${isCompleted ? 'bg-green-500/10 border-green-500/30' : ''}
                ${!isUnlocked ? 'bg-white/2 border-white/5 opacity-50 cursor-not-allowed' : ''}
                ${isUnlocked && !isActive && !isCompleted ? 'bg-white/5 border-white/20' : ''}
              `}
            >
              <div className="mb-2">{getDayIcon(day)}</div>
              <span className={`text-[10px] font-mono font-black ${isActive ? 'text-gold' : 'text-white/40'}`}>
                {day.toString().padStart(2, '0')}
              </span>
              
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full shadow-[0_0_10px_#d4af37]" 
                />
              )}
              
              {isMilestone && !isCompleted && (
                 <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1 bg-purple-500/20 text-purple-400 text-[6px] font-bold rounded border border-purple-500/30">
                   REWARD
                 </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 bg-white/2 rounded-xl border border-white/5">
          <Shield size={16} className="text-blue-400" />
          <div>
            <div className="text-[7px] text-muted uppercase font-bold tracking-widest">Security Status</div>
            <div className="text-[9px] text-white font-mono uppercase tracking-widest">Stable_Node</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white/2 rounded-xl border border-white/5">
          <Target size={16} className="text-red-400" />
          <div>
            <div className="text-[7px] text-muted uppercase font-bold tracking-widest">Target Objective</div>
            <div className="text-[9px] text-white font-mono uppercase tracking-widest">Invisibility_Achieved</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gold/5 rounded-xl border border-gold/20">
          <Zap size={16} className="text-gold animate-pulse" />
          <div>
            <div className="text-[7px] text-gold uppercase font-bold tracking-widest">Active Lesson</div>
            <div className="text-[9px] text-white font-mono uppercase tracking-widest">Node_{currentDay.toString().padStart(2, '0')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
