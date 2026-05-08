import React, { useState, useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { sounds } from '../lib/audio';

export const NetworkTerminal: React.FC<{
  gameState: any;
}> = ({ gameState }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<string[]>(['> QWP_TERMINAL_v1.0 initialized', '> Type "help" for a list of available commands.']);
  const [hackMode, setHackMode] = useState<{ active: boolean; target: string; attempts: number }>({ active: false, target: '', attempts: 0 });
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isOpen]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sounds.step();
    const cmd = input.trim().toLowerCase();
    const newLogs = [...logs, `> ${input}`];

    if (hackMode.active) {
       if (cmd === hackMode.target) {
         newLogs.push('  ACCESS GRANTED. TRACE EVADED.');
         newLogs.push('  [+10 CAPTURED SOVEREIGNTY]');
         sounds.achievement();
         setHackMode({ active: false, target: '', attempts: 0 });
       } else {
         const newAttempts = hackMode.attempts + 1;
         if (newAttempts >= 3) {
           newLogs.push('  ACCESS DENIED. TRACE DETECTED.');
           newLogs.push('  CONNECTION TERMINATED.');
           sounds.glitch();
           setHackMode({ active: false, target: '', attempts: 0 });
         } else {
           newLogs.push(`  INVALID KEY. ATTEMPTS REMAINING: ${3 - newAttempts}.`);
           setHackMode(prev => ({ ...prev, attempts: newAttempts }));
         }
       }
       setLogs(newLogs.slice(-20));
       setInput('');
       return;
    }

    switch (cmd) {
      case 'help':
        newLogs.push('  AVAILABLE COMMANDS:');
        newLogs.push('    help   - display this message');
        newLogs.push('    status - display unit core metrics');
        newLogs.push('    clear  - clear terminal output');
        newLogs.push('    ping   - check network latency');
        newLogs.push('    whoami - display unit identity');
        newLogs.push('    hack   - infiltrate secured subnet (MINI-GAME)');
        break;
      case 'hack':
        const keys = ['alpha', 'omega', 'cipher', 'neural', 'ghost', 'matrix'];
        const target = keys[Math.floor(Math.random() * keys.length)];
        newLogs.push('  INITIATING BRUTE FORCE SEQUENCE...');
        newLogs.push(`  TARGET HASH SPOTTED. CRACK THE ENCRYPTION PASSPHRASE.`);
        newLogs.push(`  HINT: Possible keys: [${keys.join(', ')}]`);
        setHackMode({ active: true, target, attempts: 0 });
        break;
      case 'status':
        newLogs.push(`  UNIT: ${gameState.name}`);
        newLogs.push(`  DAY: ${gameState.day} / 30`);
        newLogs.push(`  SCORE: ${gameState.score}`);
        break;
      case 'clear':
        setLogs(['> Terminal cleared.']);
        setInput('');
        return;
      case 'ping':
        newLogs.push(`  Pinging QWP servers...`);
        newLogs.push(`  Reply from 104.22.45.1: time=${Math.floor(Math.random() * 20 + 5)}ms`);
        break;
      case 'whoami':
        newLogs.push(`  IDENTITY_HASH: 0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`);
        newLogs.push(`  CLEARANCE TRACE: Active`);
        break;
      default:
        newLogs.push(`  ERROR: Command '${cmd}' not recognized.`);
    }

    setLogs(newLogs.slice(-20)); // Keep last 20 logs
    setInput('');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 p-3 bg-black border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all z-[100] hover:border-[#d4af37] rounded-none shadow-lg"
      >
        <Terminal size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 w-80 h-96 bg-[#020202] border border-[#d4af37]/20 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col z-[100] font-mono overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#d4af37]/50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#d4af37]/50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#d4af37]/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#d4af37]/50" />

      <div className="flex justify-between items-center p-3 border-b border-[#d4af37]/10 bg-[#d4af37]/5 relative z-10">
        <div className="text-[10px] text-[#d4af37]/70 uppercase tracking-widest font-bold flex items-center gap-2">
          <Terminal size={12} className="text-[#d4af37]" />
          SYS_TERMINAL
        </div>
        <button onClick={() => setIsOpen(false)} className="text-[#d4af37]/30 hover:text-[#d4af37] transition-colors">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs scrollbar-hide relative z-10">
        {logs.map((log, i) => (
          <div key={i} className={log.startsWith('  ERROR') || log.startsWith('  ACCESS DENIED') ? 'text-red-500 font-bold' : log.startsWith('  ACCESS GRANTED') ? 'text-green-500 font-bold' : 'text-[#d4af37]/80 leading-tight'}>{log}</div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleCommand} className="p-3 border-t border-[#d4af37]/10 flex bg-black relative z-10 group">
        <span className="text-[#d4af37] mr-2 ml-1">{'>'}</span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[#d4af37] text-xs placeholder-[#d4af37]/30 uppercase"
          placeholder="ENTER COMMAND..."
          autoFocus
          spellCheck={false}
        />
        <div className="absolute bottom-0 left-0 h-[1px] bg-[#d4af37] origin-left scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 w-full" />
      </form>
    </div>
  );
};
