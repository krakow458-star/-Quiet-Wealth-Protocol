import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Cpu, 
  Terminal, 
  Loader2,
  Zap,
  Shield,
  Target,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { architectChat } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const Typewriter: React.FC<{ text: string; speed?: number }> = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

export const NeuralLink: React.FC<{ currentDay: number }> = ({ currentDay }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', parts: [{ text: `NEURAL_LINK_ESTABLISHED. UNIT_ID: RECOGNIZED. DAY_${currentDay}_PROTOCOL_INITIALIZED. HOW_CAN_I_ASSIST?` }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHintPulse, setShowHintPulse] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inactivityTimer = useRef<number | null>(null);

  // Proactive Advisor Logic
  useEffect(() => {
    // Reset timer on any interaction
    if (inactivityTimer.current) window.clearTimeout(inactivityTimer.current);

    inactivityTimer.current = window.setTimeout(() => {
      if (!isOpen) {
        setShowHintPulse(true);
      }
    }, 15000); // Pulse if stuck for 15 seconds

    return () => {
      if (inactivityTimer.current) window.clearTimeout(inactivityTimer.current);
    };
  }, [currentDay, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', parts: [{ text: textToSend }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setShowHintPulse(false);

    const history = messages.map(m => ({ role: m.role, parts: m.parts }));
    
    // Add context to the prompt
    const contextualMessage = `[CURRENT_DAY: ${currentDay}] ${textToSend}`;
    const response = await architectChat(contextualMessage, history);

    const modelMsg: Message = { role: 'model', parts: [{ text: response }] };
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const getHelp = () => {
    setIsOpen(true);
    handleSend(`PROTOCOL_ASSISTANCE: How do I complete Day ${currentDay}? Explain like a technical briefing.`);
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {showHintPulse && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-gold text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl mb-1"
            >
              Protocol stuck? Ask me.
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsOpen(true);
            setShowHintPulse(false);
          }}
          className={`p-4 rounded-full shadow-[0_0_30px_#d4af37] flex items-center justify-center transition-all ${
            showHintPulse ? 'bg-gold animate-bounce shadow-[0_0_50px_#d4af37]' : 'bg-gold text-black'
          }`}
        >
          {showHintPulse ? <Zap size={24} className="animate-pulse" /> : <Bot size={24} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-[350px] md:w-[400px] h-[580px] z-[100] glass-panel border-gold/30 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gold/10 p-4 border-b border-gold/20 flex justify-between items-center bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold">
                    <Cpu size={18} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Neural Advisor</h3>
                  <p className="text-[7px] text-gold uppercase font-mono tracking-widest opacity-60">System_Assistance_Active_Day_{currentDay}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-md transition-colors text-muted"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => getHelp()}
                className="flex-shrink-0 px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-[8px] font-bold text-gold uppercase tracking-widest hover:bg-gold/20 transition-all flex items-center gap-1"
              >
                <Target size={10} /> Current Mission
              </button>
              <button 
                onClick={() => handleSend("Explain sovereignty strategy.")}
                className="flex-shrink-0 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-1"
              >
                <Shield size={10} /> Strategy
              </button>
              <button 
                  onClick={() => handleSend("How to stay invisible?")}
                  className="flex-shrink-0 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-1"
                >
                  <Zap size={10} /> Invisibility
                </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gold/20 bg-black/20"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-xl text-[11px] font-mono leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-gold/10 border border-gold/20 text-gold-light' 
                      : 'bg-white/5 border border-white/10 text-white/90'
                  }`}>
                    {msg.role === 'model' ? (
                      <Typewriter text={msg.parts[0].text} />
                    ) : (
                      msg.parts[0].text
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                    <Loader2 size={14} className="text-gold animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/40 border-t border-gold/20">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/10 p-1 pr-2 group focus-within:border-gold/50 transition-all">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="TRANSMIT_COMMAND..."
                  className="flex-1 bg-transparent border-none outline-none p-3 text-[11px] text-white font-mono placeholder:text-muted/30"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-2.5 bg-gold text-black rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </div>
              <div className="mt-2 flex justify-between items-center px-1">
                 <span className="text-[7px] text-muted uppercase tracking-widest font-mono flex items-center gap-1">
                    <Zap size={8} /> Signal_Strength: 100%
                 </span>
                 <span className="text-[7px] text-muted uppercase tracking-widest font-mono flex items-center gap-1">
                    <ShieldCheck size={8} /> Secure_Handshake
                 </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
