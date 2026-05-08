import React, { useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface StatsDashboardProps {
  gameState: {
    capital: number;
    focus: number;
    vitality: number;
    sovereignty: number;
    score: number;
    day: number;
    name: string;
  };
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ gameState }) => {
  const data = useMemo(() => [
    { subject: 'Capital', A: gameState.capital, fullMark: 100 },
    { subject: 'Focus', A: gameState.focus, fullMark: 100 },
    { subject: 'Sovereignty', A: gameState.sovereignty, fullMark: 100 },
    { subject: 'Vitality', A: gameState.vitality, fullMark: 100 },
  ], [gameState]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in font-mono">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Radar Chart */}
        <div className="glass-panel p-6 rounded-none border border-white/10 bg-black/40 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#d4af37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h3 className="text-[#d4af37] text-xs uppercase tracking-widest font-bold mb-6">Subject Attributes</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Subject" dataKey="A" stroke="#d4af37" fill="#d4af37" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Progress Metrics */}
        <div className="glass-panel p-6 rounded-none border border-white/10 bg-black/40 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-[#d4af37] text-xs uppercase tracking-widest font-bold mb-6">Network Trajectory</h3>
            <div className="space-y-6">
              {[
                { label: 'Cycle Progress', val: (gameState.day / 30) * 100, format: (v: number) => `${Math.round(v)}%` },
                { label: 'Composite Score', val: gameState.score, Math: Math.max },
                { label: 'Network Clearance', val: Math.min(100, gameState.day * 3.33), format: (v: number) => `LVL ${Math.min(30, gameState.day)}` }
              ].map((m, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                    <span className="text-muted">{m.label}</span>
                    <span className="text-white">{m.format ? m.format(m.val) : Math.round(m.val)}</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-none overflow-hidden">
                    <div 
                      className="h-full bg-[#d4af37] transition-all duration-1000 ease-out" 
                      style={{ width: `${Math.min(100, Math.max(0, m.val === gameState.score ? (m.val/1000)*100 : m.val))}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
            <div className="text-[10px] text-muted uppercase tracking-widest">Unit Access Hash</div>
            <div className="text-xs text-white/50 font-bold">0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</div>
          </div>
        </div>

      </div>

      {/* Warning Grid */}
      <div className="glass-panel p-6 rounded-none border border-red-500/20 bg-red-950/20 backdrop-blur-md">
         <h3 className="text-red-500 text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
           <span className="w-2 h-2 bg-red-500 rounded-none animate-pulse" />
           System Anomalies Detected
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-red-500/10 p-3 rounded bg-red-500/5">
              <div className="text-[10px] text-red-500/60 uppercase tracking-widest mb-1">Attention Deficit Risk</div>
              <div className="text-sm text-red-100 font-bold">{gameState.focus < 50 ? 'CRITICAL' : 'NOMINAL'}</div>
            </div>
            <div className="border border-red-500/10 p-3 rounded bg-red-500/5">
              <div className="text-[10px] text-red-500/60 uppercase tracking-widest mb-1">Exposure Vectors</div>
              <div className="text-sm text-red-100 font-bold">{gameState.sovereignty < 50 ? 'MULTIPLE' : 'SECURE'}</div>
            </div>
            <div className="border border-red-500/10 p-3 rounded bg-red-500/5">
              <div className="text-[10px] text-red-500/60 uppercase tracking-widest mb-1">Burnout Probability</div>
              <div className="text-sm text-red-100 font-bold">{gameState.vitality < 50 ? 'HIGH' : 'LOW'}</div>
            </div>
         </div>
      </div>
    </div>
  );
};
