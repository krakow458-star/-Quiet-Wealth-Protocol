import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const ACTIVITY_TEMPLATES = [
  { name: "MARCUS_V", actions: ["completed Day 28", "earned achievement: GHOST MODE", "+25 Sovereignty"], type: "success" },
  { name: "ALEXK", actions: ["completed Day 25", "+20 Capital", "killed 3 subscriptions"], type: "success" },
  { name: "IRON_WILL", actions: ["Day 22 — MOAT opened", "completed Hard Asset Drill", "+15 Sovereignty"], type: "info" },
  { name: "SILENT_OAK", actions: ["completed Day 19 — Tax Hygiene", "recovered $89 this month"], type: "info" },
  { name: "DARKFORT", actions: ["Day 17 — Market Detox", "deleted 4 financial apps"], type: "info" },
  { name: "ZERO_DB", actions: ["completed Day 15", "MOAT funded: $1,500"], type: "success" },
  { name: "FORTRESS_X", actions: ["Day 12 — Network mapped", "cut 2 drain contacts"], type: "info" },
  { name: "QUIET_ONE", actions: ["completed Day 9 — Clean Fuel", "saved $180/month"], type: "success" },
  { name: "ARCH_88", actions: ["Day 6 — Dead assets converted", "sold 5 items: +$340"], type: "info" },
  { name: "NEWBLOOD", actions: ["just started Protocol", "Day 1 — Silent Audit"], type: "new" }
];

export const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Initial batch
    const initial = Array.from({ length: 4 }).map(() => ({
      ...generateItem(),
      id: Math.random()
    }));
    setActivities(initial);

    const interval = setInterval(() => {
      setActivities(prev => [{ ...generateItem(), id: Math.random() }, ...prev].slice(0, 7));
    }, 4000 + Math.random() * 2500);

    return () => clearInterval(interval);
  }, []);

  const generateItem = () => {
    const template = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
    const action = template.actions[Math.floor(Math.random() * template.actions.length)];
    return {
      template,
      action,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {activities.map((item) => (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-start gap-4 border-b border-white/5 pb-3 group"
          >
            <div 
              className="w-7 h-7 rounded flex items-center justify-center text-[9px] font-bold border border-white/10 flex-shrink-0 bg-white/5 transition-colors group-hover:border-gold/40"
              style={{ 
                color: item.template.type === 'success' ? '#00e676' : item.template.type === 'info' ? '#00b4d8' : '#d4af37' 
              }}
            >
              {item.template.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="text-[10px] font-black text-white uppercase tracking-wider">{item.template.name}</div>
                <div className="text-[7px] text-muted/50 uppercase font-mono">{item.time}</div>
              </div>
              <div className="text-[9px] text-muted leading-tight mt-0.5 group-hover:text-gold-light transition-colors">{item.action}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
