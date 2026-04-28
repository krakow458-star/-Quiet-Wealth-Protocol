import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Cpu, 
  Zap, 
  Lock, 
  TrendingUp, 
  Brain, 
  Activity, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  Check, 
  Info,
  Map as MapIcon,
  MessageSquare,
  Globe,
  Award,
  Users,
  ExternalLink,
  Target,
  Trophy,
  Search,
  Table as TableIcon,
  ShieldCheck,
  Scissors,
  Settings,
  RefreshCcw,
  PenTool,
  X,
  Eye,
  Scan
} from 'lucide-react';
import { PROTOCOL_DAYS, ProtocolDay, AFFILIATE_LINKS, LOCALE_CONFIG } from './protocolData';
import { sounds } from './lib/audio';
import { getArchitectAdvice } from './lib/gemini';
import { IpLeakTest } from './components/IpLeakTest';
import { BgCanvas } from './components/BgCanvas';
import { ActivityFeed } from './components/ActivityFeed';
import { AuditTool } from './components/AuditTool';
import { HoldingCell } from './components/HoldingCell';
import { SubKiller } from './components/SubKiller';
import { SovereignJournal } from './components/SovereignJournal';
import { CryptoYieldCalculator } from './components/CryptoYieldCalculator';
import { FootprintScanner } from './components/FootprintScanner';
import { NeuralLink } from './components/NeuralLink';
import { SovereignMap } from './components/SovereignMap';
import { ShareAchievement } from './components/ShareAchievement';

interface GameState {
  name: string;
  avatar: string;
  day: number;
  capital: number;
  focus: number;
  vitality: number;
  sovereignty: number;
  score: number;
  stepsCompleted: number[];
  unlocked: number[];
  streak: number;
  lastActive: string | null;
}

const AVATARS = [
  { id: 'm1', label: 'PHANTOM_M', icon: '👤' },
  { id: 'f1', label: 'PHANTOM_F', icon: '👤' },
  { id: 'm2', label: 'CYBER_OPERATOR', icon: '🕵️' },
  { id: 'f2', label: 'NEURAL_ELITE', icon: '👩‍💻' },
  { id: 'm3', label: 'D_NOMAD', icon: '🕶️' },
  { id: 'f3', label: 'S_ARCHITECT', icon: '⚖️' },
];

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [screen, setScreen] = useState<'intro' | 'onboarding' | 'loading' | 'game' | 'reward'>('intro');
  const [isBooting, setIsBooting] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [registrationAvatar, setRegistrationAvatar] = useState('m1');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [assistantMsg, setAssistantMsg] = useState('');
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [viewMode, setViewMode] = useState<'mission' | 'roadmap'>('mission');
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasClickedLink, setHasClickedLink] = useState(() => {
    return localStorage.getItem('day5_link_clicked') === 'true';
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Helper for localized text
  const localizeText = useCallback((text: string) => {
    if (!text) return "";
    const config = (LOCALE_CONFIG as any).US;
    return text.replace(/{currency}/g, config.currency);
  }, []);

  // Load state based on normalized name
  const loadState = (name: string) => {
    const key = `qw_state_${name.trim().toUpperCase()}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const s = JSON.parse(saved);
        const today = new Date().toDateString();
        const last = s.lastActive ? new Date(s.lastActive).toDateString() : null;
        if (last && last !== today) {
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          if (last === yesterday) s.streak = (s.streak || 0) + 1;
          else s.streak = 1;
        }
        if (!s.unlocked) s.unlocked = [s.day || 1];
        if (!s.stepsCompleted) s.stepsCompleted = [];
        setGameState(s);
        setScreen('game');
        return true;
      } catch (e) {
        console.error("Migration error:", e);
      }
    }
    return false;
  };

  useEffect(() => {
    if (gameState) {
      const key = `qw_state_${gameState.name}`;
      localStorage.setItem(key, JSON.stringify({
        ...gameState,
        lastActive: new Date().toISOString()
      }));
    }
  }, [gameState]);

  const handleInteraction = () => {
    if (audioInitialized) return;
    setAudioInitialized(true);
    sounds.init();
    sounds.welcome();
    sounds.toggleAmbient(true); // Start ambient music immediately on interaction
  };

  const startBooting = () => {
    handleInteraction();
    setFlashActive(true);
    setIsBooting(true);
    sounds.boot();
    
    setTimeout(() => setFlashActive(false), 1500);

    const logs = [
      "CRACKING_NEURAL_ENVELOPE... 100%",
      "SOVEREIGN_OVERRIDE_ACTIVE",
      "BYPASSING_WORLD_BANK_GATES... OK",
      "ESTABLISHING_DIRTY_FIAT_LEAK... FOUND",
      "MOUNTING_PRIVATE_INFRASTRUCTURE...",
      "AUTHENTICATION_REQUIRED_FOR_UNIT"
    ];
    
    logs.forEach((log, i) => {
      setTimeout(() => {
        setBootLog(prev => [...prev, `> ${log}`]);
        sounds.step();
        if (i === 0) sounds.glitch();
      }, i * 300);
    });

    setTimeout(() => {
      setIsBooting(false);
    }, logs.length * 300 + 500);
  };

  const startProtocol = () => {
    if (!nameInput.trim()) return;
    sounds.success();
    
    const exists = loadState(nameInput);
    if (!exists) {
      setScreen('onboarding');
    }
  };

  const resetProtocol = () => {
    if (window.confirm("ARE YOU SURE? THIS WILL ERASE ALL SOVEREIGN PROGRESS FOR THIS UNIT.")) {
      const key = `qw_state_${nameInput.toUpperCase()}`;
      localStorage.removeItem(key);
      setGameState(null);
      setScreen('intro');
      window.location.reload();
    }
  };

  const confirmOnboarding = () => {
    setScreen('loading');
  };

  useEffect(() => {
    if (screen === 'loading') {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setGameState({
                name: nameInput.toUpperCase(),
                avatar: registrationAvatar,
                day: 1,
                capital: 0,
                focus: 10,
                vitality: 50,
                sovereignty: 0,
                score: 0,
                stepsCompleted: [],
                unlocked: [1],
                streak: 1,
                lastActive: new Date().toISOString()
              });
              setScreen('game');
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [screen, nameInput, registrationAvatar]);

  const toggleStep = (idx: number) => {
    if (!gameState) return;
    
    // Check if previous mission finished (if user somehow accessed a higher day UI)
    const currentDayData = PROTOCOL_DAYS.find(d => d.day === gameState.day);
    if (!currentDayData) return;

    sounds.step();
    setGameState(prev => {
      if (!prev) return null;
      const completed = prev.stepsCompleted.includes(idx)
        ? prev.stepsCompleted.filter(i => i !== idx)
        : [...prev.stepsCompleted, idx];
      return { ...prev, stepsCompleted: completed };
    });
  };

  const completeDay = () => {
    if (!gameState) return;
    const day = PROTOCOL_DAYS.find(d => d.day === gameState.day);
    if (!day) return;

    // Special Data Check for Day 1
    if (gameState.day === 1) {
      const auditData = localStorage.getItem(`qw_audit_${gameState.name}`);
      const parsedAudit = auditData ? JSON.parse(auditData) : [];
      // Require at least 5 meaningful entries for Day 1
      if (!Array.isArray(parsedAudit) || parsedAudit.length < 5) {
        sounds.glitch();
        alert("CRITICAL_ERROR: INSUFFICIENT_DATA. THE_SILENT_AUDIT_REQUIRES_AT_LEAST_5_ENTRIES_TO_MAP_LEAKS.");
        return;
      }
    }

    // Requirement: All steps must be checked
    if (day.steps.length > gameState.stepsCompleted.length) {
      sounds.glitch();
      alert("UNFINISHED_OBJECTIVES. STABILIZE_ALL_NODES_BEFORE_PROCEEDING.");
      return;
    }

    // Special Data Check for Day 5 (IP Scan)
    if (gameState.day === 5) {
      const ipResult = localStorage.getItem('day5_ip_result');
      if (!ipResult) {
        sounds.glitch();
        alert("CRITICAL_ERROR: PERIMETER_UNSCANNED. YOU_MUST_RUN_THE_IP_LEAK_TEST_BEFORE_PROCEEDING.\n\n(RU: Вам нужно запустить IP Leak Test в главном окне перед тем, как продолжить.)");
        return;
      }
    }

    if (day.verificationGate?.required) {
      setShowVerification(true);
    } else {
      finalizeDay();
    }
  };

  const finalizeDay = () => {
    setFlashActive(true);
    sounds.success();
    setScreen('reward');
    setTimeout(() => setFlashActive(false), 500);
  };

  const handleRewardConfirm = () => {
    if (!gameState) return;
    const day = PROTOCOL_DAYS.find(d => d.day === gameState.day);
    if (!day) return;

    sounds.achievement();
    setGameState(prev => {
      if (!prev) return null;
      const nextDayNum = prev.day + 1;
      return {
        ...prev,
        day: nextDayNum,
        capital: Math.min(100, (prev.capital || 0) + day.rewards.capital),
        focus: Math.min(100, (prev.focus || 0) + day.rewards.focus),
        vitality: Math.min(100, (prev.vitality || 0) + day.rewards.vitality),
        sovereignty: Math.min(100, (prev.sovereignty || 0) + day.rewards.sovereignty),
        score: (prev.score || 0) + day.day * 100,
        stepsCompleted: [],
        unlocked: prev.unlocked.includes(nextDayNum) ? prev.unlocked : [...prev.unlocked, nextDayNum]
      };
    });
    setScreen('game');
  };

  const askMentor = async () => {
    if (!gameState) return;
    setIsAssistantLoading(true);
    setShowAssistant(true);
    const day = PROTOCOL_DAYS.find(d => d.day === gameState.day);
    const advice = await getArchitectAdvice(day?.title || "Unknown", gameState);
    setAssistantMsg(advice);
    setIsAssistantLoading(false);
    sounds.hint();
  };

  const handleVerification = () => {
    if (!gameState) return;
    const day = PROTOCOL_DAYS.find(d => d.day === gameState.day);
    if (day?.verificationGate?.bonusReward) {
      const bonus = day.verificationGate.bonusReward;
      setGameState(prev => {
        if (!prev) return null;
        return {
          ...prev,
          capital: Math.min(100, (prev.capital || 0) + (bonus.capital || 0)),
          focus: Math.min(100, (prev.focus || 0) + (bonus.focus || 0)),
          sovereignty: Math.min(100, (prev.sovereignty || 0) + (bonus.sovereignty || 0)),
        };
      });
    }
    setShowVerification(false);
    setHasClickedLink(false);
    localStorage.removeItem('day5_link_clicked');
    finalizeDay();
  };

  const currentDay = useMemo(() => PROTOCOL_DAYS.find(d => d.day === (gameState?.day || 1)), [gameState?.day]);

  if (screen === 'intro') {
    if (!isBooting && bootLog.length === 0) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden cursor-pointer"
          onClick={handleInteraction}
        >
          {flashActive && <div className="fixed inset-0 z-[200] bg-white animate-whiteout" />}
          <div className="absolute inset-0 grid-background opacity-40" />
          
          {/* Floating Data Decorators */}
          <div className="absolute inset-0 pointer-events-none opacity-20 hidden md:block select-none">
            <div className="absolute top-[30%] left-[20%] font-mono text-[8px] text-gold space-y-1">
              <div>hexE8366</div>
              <div>hexE8556</div>
              <div className="mt-4">43</div>
              <div>75S</div>
              <div>09</div>
            </div>
            <div className="absolute top-[30%] left-[28%] font-mono text-[8px] text-white">
              <div className="bg-gold/40 px-2 py-0.5 rounded text-black font-bold mb-1">5004</div>
              <div>Hex68553</div>
              <div className="mt-4 text-gold/50">TUN_6890</div>
              <div className="text-gold/50">STH_H000</div>
              <div className="text-gold/50">SIW_F1_4UA</div>
            </div>
            <div className="absolute top-[30%] right-[32%] font-mono text-[8px] text-white text-right">
              <div className="text-gold/50">20003</div>
              <div className="text-gold font-bold border-b border-gold/40 inline-block mb-1">ST60S</div>
              <div className="mt-4 flex gap-2 justify-end">
                <span>00088</span>
                <span>2000</span>
                <span>00000</span>
              </div>
              <div className="flex gap-2 justify-end">
                <span>90028</span>
                <span>2537</span>
                <span>53850</span>
              </div>
              <div className="flex gap-2 justify-end">
                <span>86028</span>
                <span>2060</span>
                <span>52003</span>
              </div>
            </div>
          </div>

          <div className="vignette opacity-80" />
          <div className="crt-overlay" />
          <BgCanvas />

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              x: mousePos.x * 0.5,
              y: mousePos.y * 0.5
            }}
            className="text-center z-10"
          >
             <div className="mb-12 relative inline-block">
                <motion.div 
                  animate={{ 
                    rotate: 360,
                    x: mousePos.x * -0.2,
                    y: mousePos.y * -0.2
                  }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-full border-[1px] border-gold/20 shadow-[0_0_80px_rgba(212,175,55,0.1)] flex items-center justify-center relative bg-zinc-900/20 backdrop-blur-sm"
                >
                  <div className="absolute inset-2 border border-gold/5 rounded-full" />
                  <motion.div 
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-8 border border-gold/10 rounded-full" 
                  />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <motion.div 
                     animate={{ 
                       scale: [1, 1.1, 1],
                       boxShadow: ["0 0 20px rgba(212,175,55,0.3)", "0 0 50px rgba(212,175,55,0.6)", "0 0 20px rgba(212,175,55,0.3)"]
                     }}
                     transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                     className="p-5 md:p-8 bg-zinc-950 rounded-full border border-gold/40"
                   >
                     <Zap size={36} className="text-gold" fill="#d4af37" />
                   </motion.div>
                </div>
             </div>

             <motion.h1 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gold to-gold-dim tracking-[0.05em] mb-4 uppercase italic drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
             >
               QUIET_WEALTH
             </motion.h1>
             <div className="h-0.5 w-32 md:w-56 bg-gold/60 mx-auto -mt-2 mb-12 shadow-[0_0_20px_rgba(212,175,55,0.6)]" />

             <motion.button 
               whileHover={{ scale: 1.05, background: 'rgba(212,175,55,0.1)' }}
               whileTap={{ scale: 0.98 }}
               onClick={startBooting}
               onMouseEnter={() => sounds.hint()}
               className="group relative px-12 md:px-16 py-4 md:py-6 bg-zinc-900 border border-zinc-700/50 rounded-full overflow-hidden transition-all shadow-[0_30px_60px_rgba(0,0,0,0.6)] inline-flex items-center justify-center mx-auto"
             >
               <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <span className="relative z-10 text-[10px] md:text-[12px] font-black text-white tracking-[0.6em] uppercase">
                 Initiate Protocol
               </span>
             </motion.button>
          </motion.div>

          <div className="absolute bottom-10 left-10 text-[7px] text-muted tracking-[0.4em] uppercase opacity-40 font-mono hidden md:flex items-center gap-2">
            ARCHITECT_CORE_V4.2 // NEURAL_LINK_READY
          </div>
          
          <div className="absolute bottom-10 right-10 text-[7px] text-muted tracking-[0.4em] uppercase opacity-40 font-mono hidden md:flex items-center gap-2">
            SECURED_TERMINAL_001 // v1.3_STANDBY
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-20" />
        <BgCanvas />
        {flashActive && <div className="fixed inset-0 z-[200] bg-white animate-whiteout" />}
        <div className="vignette opacity-70" />
        <div className="crt-overlay" />
        
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="z-10 text-center mb-8 md:mb-12"
        >
             <div className="flex items-end justify-center h-12 mb-4">
               <motion.div 
                 animate={{ opacity: [0.4, 0.8, 0.4] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="flex items-end gap-1.5 px-6 py-3 border border-gold/10 rounded-full bg-gold/5 h-full"
               >
                  {[...Array(12)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      animate={{ height: [4, 16, 4] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                      className="w-1 bg-gold/40 shadow-[0_0_8px_rgba(212,175,55,0.2)] rounded-full" 
                    />
                  ))}
               </motion.div>
             </div>
             <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gold tracking-[0.15em] md:tracking-[0.25em] uppercase italic drop-shadow-[0_0_20px_rgba(212,175,55,0.3)] mb-4"
              >
                NEURAL ACCESS
              </motion.h1>
          <p className="text-gold/60 text-[8px] md:text-[10px] tracking-[0.5em] md:tracking-[0.8em] uppercase font-bold mt-4">
            CONNECTION_STABLE // READY_FOR_SYNC
          </p>
        </motion.div>

        <div className="z-10 relative w-full max-w-2xl flex flex-col items-center justify-center gap-12">
          {/* Quantum Core Assembly - Static and Calm */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: mousePos.x * 0.3,
              y: mousePos.y * 0.3  
            }}
            transition={{ delay: 0.2 }}
            className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center"
          >
            {/* Outer Rings - Slow, Smooth Rotation */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 40 + i * 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-gold/10 rounded-full"
                style={{ scale: 1 - i * 0.15 }}
              >
                {/* Orbital nodes around rings */}
                {i < 3 && (
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2 + i, repeat: Infinity }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_10px_#d4af37]"
                  />
                )}
              </motion.div>
            ))}

            {/* Neural Pulse Field - Very Subtle */}
            <div className="absolute inset-0 bg-gradient-to-tr from-gold/0 via-gold/5 to-gold/0 rounded-full blur-[120px]" />

            {/* Core Processor Element - Specialized Shield Design */}
            <div className="relative p-16 md:p-24 bg-black border border-gold/10 rounded-full shadow-[0_0_120px_rgba(212,175,55,0.1)] flex items-center justify-center overflow-hidden">
               {/* Inner spinning data arc */}
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-4 border-2 border-gold/40 border-dashed rounded-full pointer-events-none"
               />
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-10 border border-white/5 border-dotted rounded-full pointer-events-none"
               />
               
               <motion.div
                animate={{ 
                  scale: [1, 1.02, 1],
                  filter: ["brightness(1) contrast(1)", "brightness(1.2) contrast(1.1)", "brightness(1) contrast(1)"] 
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center justify-center relative z-10"
              >
                <div className="relative">
                  <Shield size={90} className="text-gold/60" strokeWidth={0.5} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Lock size={28} className="text-gold mt-1" strokeWidth={1} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Background scanning line inside the core */}
              <motion.div 
                animate={{ top: ['-50%', '150%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[2px] bg-gold/20 blur-sm shadow-[0_0_20px_#d4af37]"
              />
            </div>
            
            {/* Geometric Accents */}
            <div className="absolute -top-10 -left-10 w-20 h-20 border-t-2 border-l-2 border-gold/10 rounded-tl-3xl" />
            <div className="absolute -bottom-10 -right-10 w-20 h-20 border-b-2 border-r-2 border-gold/10 rounded-br-3xl" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center space-y-10 w-full max-w-lg mt-4"
          >
            <p className="text-gray-400 italic text-[11px] md:text-[14px] leading-relaxed tracking-wide">
              "We are the <span className="text-gold font-bold">Silence.</span> To join us, you must leave the <span className="text-gold font-bold">Noise.</span>"
            </p>

            <AnimatePresence mode="wait">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="relative group max-w-sm mx-auto">
                  <div className="absolute -top-6 left-0 right-0 text-[7px] text-gold/30 tracking-[0.5em] uppercase text-center font-mono">
                    AWAITING_ID_STRING
                  </div>
                  <input 
                    type="text" 
                    value={nameInput}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      if (val !== nameInput) sounds.step();
                      setNameInput(val);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && nameInput.trim() && startProtocol()}
                    placeholder="UNIT_IDENTIFIER" 
                    className="w-full bg-transparent border-b border-gold/10 p-5 font-mono text-xl md:text-2xl text-center text-white outline-none focus:border-gold/60 transition-all placeholder:text-gold/5 uppercase tracking-[0.2em]"
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gold shadow-[0_0_10px_#d4af37] origin-center scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700" />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startProtocol}
                  disabled={!nameInput.trim()}
                  className="group relative w-full max-w-sm mx-auto py-5 bg-zinc-900 border border-zinc-700/50 text-white font-black text-[10px] md:text-[12px] tracking-[0.6em] uppercase rounded-full overflow-hidden transition-all disabled:opacity-10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] flex items-center justify-center gap-3"
                >
                  <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Zap size={16} fill="white" className="relative z-10" />
                  <span className="relative z-10">Authorize Access</span>
                </motion.button>

                <button 
                  onClick={resetProtocol}
                  className="text-[8px] text-muted hover:text-red-400 transition-colors uppercase tracking-[0.5em] opacity-40 hover:opacity-100"
                >
                  Purge System Identity
                </button>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8 md:gap-16 text-[7px] text-gold/20 tracking-[0.5em] uppercase font-mono hidden md:flex pointer-events-none whitespace-nowrap">
          <span>ARCHITECT_CORE_V4.2</span>
          <span>//</span>
          <span>SECURED_TERMINAL_001</span>
        </div>
      </div>
    );
  }

  if (screen === 'onboarding') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg relative overflow-hidden">
         <BgCanvas />
         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full glass-panel p-8 rounded-3xl space-y-8 text-center relative z-10">
            <h2 className="text-xl font-bold text-white tracking-widest uppercase flex items-center justify-center gap-2">
              <Award className="text-gold" /> Select Your Archetype
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
               {AVATARS.map(av => (
                 <button 
                   key={av.id}
                   onClick={() => {
                     sounds.step();
                     setRegistrationAvatar(av.id);
                   }}
                   className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 ${registrationAvatar === av.id ? 'bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/20 opacity-60 hover:opacity-100'}`}
                 >
                    <div className="text-2xl">{av.icon}</div>
                    <div className="text-[7px] font-black uppercase tracking-widest text-white leading-tight">{av.label}</div>
                 </button>
               ))}
            </div>
            <div className="space-y-4">
               <div className="text-[10px] font-bold text-muted uppercase tracking-widest">NEURAL_DESYNC_STATUS</div>
               <div className="p-4 bg-gold/5 border border-gold/10 rounded-xl text-left">
                  <p className="text-[9px] text-muted uppercase italic tracking-widest leading-relaxed">
                    "Standard jurisdictions purged. Neural link isolated from state tracking."
                  </p>
               </div>
            </div>
            <button 
              onClick={confirmOnboarding}
              className="w-full py-4 bg-gold text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gold/20"
            >
              Confirm & Launch Protocol
            </button>
         </motion.div>
      </div>
    );
  }

  if (screen === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-bg relative overflow-hidden">
        <BgCanvas />
        <div className="crt-overlay" />
        
        <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
          <div className="text-8xl font-black text-gold animate-pulse drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">QW</div>
          <div className="w-full space-y-2">
            <div className="flex justify-between text-[8px] font-mono text-gold uppercase tracking-widest">
               <span>Loading System Modules</span>
               <span>{loadingProgress}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div className="h-full bg-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]" style={{ width: `${loadingProgress}%` }} />
            </div>
          </div>
          
          <div className="w-full glass-panel p-4 rounded-xl font-mono text-[7px] text-muted space-y-1 h-32 overflow-hidden relative">
             <div className="animate-pulse flex items-center gap-2 mb-2">
                <span className="w-1 h-1 bg-gold rounded-full" />
                <span className="text-gold">DIAGNOSTIC_IN_PROGRESS</span>
             </div>
             {loadingProgress > 10 && <div>{">"} MOUNTING_FILE_SYSTEM... OK</div>}
             {loadingProgress > 30 && <div>{">"} INITIALIZING_CIPHER_CORE... OK</div>}
             {loadingProgress > 50 && <div>{">"} CONNECTING_TO_SILENT_NET... OK</div>}
             {loadingProgress > 70 && <div>{">"} BYPASSING_CONSUMER_STATIC... OK</div>}
             {loadingProgress > 90 && <div>{">"} READY_FOR_SOVEREIGN_TAKEOVER...</div>}
             <div className="absolute bottom-2 left-4 opacity-30">HEX_ADDR: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</div>
          </div>
          
          <div className="text-[9px] text-muted tracking-[0.4em] uppercase animate-pulse">Establishing Sovereignty...</div>
        </div>
      </div>
    );
  }

  if (gameState && gameState.day > 30) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <BgCanvas />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-2xl z-10">
          <div className="text-8xl font-black text-gold">Ω</div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Protocol Complete</h2>
          <p className="text-gray-400 italic">"The noise is gone. You are now a Sovereign Architect. Go forth and build."</p>
          <div className="grid grid-cols-4 gap-4">
             {[
               { l: 'Capital', v: gameState.capital, c: 'text-gold' },
               { l: 'Focus', v: gameState.focus, c: 'text-blue-400' },
               { l: 'Vitality', v: gameState.vitality, c: 'text-red-400' },
               { l: 'Sovereignty', v: gameState.sovereignty, c: 'text-green-400' }
             ].map(s => (
               <div key={s.l} className="glass-panel p-4 rounded-xl">
                 <div className={`text-2xl font-mono ${s.c}`}>{s.v}</div>
                 <div className="text-[8px] uppercase tracking-widest text-muted">{s.l}</div>
               </div>
             ))}
          </div>
          <button onClick={resetProtocol} className="px-8 py-4 border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all rounded-lg">
            Restart Cycle
          </button>
        </motion.div>
      </div>
    );
  }

  const getClearanceLevel = () => {
    const day = gameState?.day || 1;
    if (day >= 25) return { color: 'text-red-500', name: 'Sovereign Architect', bg: 'bg-red-500/20' };
    if (day >= 15) return { color: 'text-purple-500', name: 'Ghost Node', bg: 'bg-purple-500/20' };
    if (day >= 7) return { color: 'text-blue-400', name: 'Network Unit', bg: 'bg-blue-400/20' };
    return { color: 'text-gold', name: 'Prospect', bg: 'bg-gold/20' };
  };

  const clearance = getClearanceLevel();

  return (
    <div className="min-h-screen bg-bg flex flex-col font-sans relative overflow-hidden">
      <NeuralLink currentDay={gameState?.day || 1} />
      {flashActive && <div className="fixed inset-0 z-[200] bg-white animate-whiteout" />}
      
      {/* Visual Effects Layer */}
      <div className="crt-overlay" />
      <div className="scanline" />
      <div className="vignette" />
      
      <BgCanvas />
      
      <header className="glass-panel sticky top-0 z-50 p-4 flex justify-between items-center px-6 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-6">
          <div 
            className="glitch-wrap px-3 py-1.5 bg-gold/10 border border-gold/30 rounded-lg group hover:border-gold transition-colors cursor-pointer" 
            onClick={() => setScreen('intro')}
          >
            <span className="text-[10px] font-black tracking-[0.2em] text-gold-gradient" data-text="QW_PROT">QW_PROT</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex gap-4 items-center">
            <div className="text-2xl bg-gold/10 w-10 h-10 flex items-center justify-center rounded-xl border border-gold/20">
              {AVATARS.find(a => a.id === gameState?.avatar)?.icon || '👤'}
            </div>
            <div className="flex flex-col">
              <div className="text-[8px] text-muted tracking-widest font-bold uppercase opacity-60">Sovereign unit</div>
              <div className="text-white font-mono font-bold text-xs tracking-tight">UNIT_{gameState?.name}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
             <div className={`px-2 py-1 rounded text-[7px] font-black uppercase tracking-widest ${clearance.bg} ${clearance.color} border border-current opacity-80`}>
                Lvl_{gameState?.day || 1} // {clearance.name}
             </div>
             <div className="h-4 w-px bg-white/10" />
             <div className="flex flex-col items-end">
               <div className="text-gold font-mono font-bold text-[10px]">{gameState?.streak}D STREAK</div>
               <div className="text-[7px] text-muted tracking-widest font-bold uppercase flex items-center gap-1">
                 <Zap size={8} className="text-green-400" /> Neural_Link: Active
               </div>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <button onClick={() => setAudioEnabled(sounds.toggleAudio())} className="p-2 rounded-lg bg-white/5 text-muted hover:text-white transition-colors border border-white/5">
               {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
             </button>
             <button onClick={() => setShowSettings(true)} className="p-2 rounded-lg bg-white/5 text-muted hover:text-gold transition-colors border border-white/5">
               <Settings size={14} />
             </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[190] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="max-w-sm w-full glass-panel p-6 rounded-3xl space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                   <h3 className="text-xs font-bold text-gold uppercase tracking-widest flex items-center gap-2">
                     <Settings size={14} /> System Configuration
                   </h3>
                   <button onClick={() => setShowSettings(false)} className="text-muted hover:text-white"><X size={16}/></button>
                </div>
                
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5">
                      <span className="text-[10px] text-white/70 uppercase font-bold tracking-widest">Audio Feedback</span>
                      <button onClick={() => setAudioEnabled(sounds.toggleAudio())} className={`w-10 h-5 rounded-full transition-all relative ${audioEnabled ? 'bg-gold' : 'bg-white/10'}`}>
                         <div className={`absolute top-1 w-3 h-3 rounded-full bg-black transition-all ${audioEnabled ? 'right-1' : 'left-1'}`} />
                      </button>
                   </div>
                   
                   <button 
                     onClick={resetProtocol}
                     className="w-full p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest"
                   >
                     <RefreshCcw size={14} /> Full Protocol Reset
                   </button>
                   
                   <p className="text-[7px] text-muted text-center uppercase tracking-widest">
                     Quiet Wealth Operating System // Unit {gameState?.name} // Session Hash: 7X-09
                   </p>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col md:grid md:grid-cols-[1fr_300px] gap-8 relative z-10">
        <div className="space-y-8">
          {/* Navigation Tabs */}
          <div className="flex gap-1 bg-black/40 p-1 rounded-2xl border border-white/5 w-fit">
            <button 
              onClick={() => setViewMode('mission')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'mission' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-muted hover:text-white'}`}
            >
              Protocol Mission
            </button>
            <button 
              onClick={() => setViewMode('roadmap')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'roadmap' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-muted hover:text-white'}`}
            >
              System Roadmap
            </button>
          </div>

          {viewMode === 'roadmap' ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <SovereignMap 
                currentDay={gameState?.day || 1} 
                unlockedDays={gameState?.unlocked || [1]}
                onSelectDay={(day) => {
                  if (gameState?.unlocked.includes(day)) {
                    setGameState(prev => prev ? { ...prev, day, stepsCompleted: prev.day === day ? prev.stepsCompleted : [] } : null);
                    setViewMode('mission');
                  } else {
                    sounds.glitch();
                    alert("ACCESS_DENIED. PROTOCOL_UNLOCKED_SEQUENTIALLY.");
                  }
                }} 
              />
            </motion.div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Capital', val: gameState?.capital, icon: <TrendingUp size={12}/>, color: 'text-gold' },
              { label: 'Focus', val: gameState?.focus, icon: <Brain size={12}/>, color: 'text-blue-400' },
              { label: 'Vitality', val: gameState?.vitality, icon: <Activity size={12}/>, color: 'text-red-400' },
              { label: 'Sovereignty', val: gameState?.sovereignty, icon: <Shield size={12}/>, color: 'text-green-400' }
            ].map(stat => (
              <div key={stat.label} className="glass-panel p-3 rounded-xl hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-bold text-muted uppercase tracking-widest flex items-center gap-1">
                    {stat.icon} {stat.label}
                  </span>
                  <span className={`text-xs font-mono font-bold ${stat.color}`}>{stat.val}</span>
                </div>
                <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className={`h-full ${stat.color.replace('text', 'bg')}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 overflow-hidden">
                <span className="text-6xl font-black text-gold/30 flex-shrink-0">{String(gameState?.day).padStart(2, '0')}</span>
                <div className="min-w-0">
                  <div className="text-gold text-[8px] font-bold tracking-[0.2em] uppercase truncate">Quiet Money Protocol</div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight truncate uppercase">{currentDay?.title}</h2>
                </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => setShowMap(true)} className="p-3 text-white/30 hover:text-white hover:bg-white/5 rounded-full transition-all">
                    <MapIcon size={20} />
                 </button>
                 <button onClick={askMentor} className="p-3 text-gold/50 hover:text-gold hover:bg-gold/10 rounded-full transition-all">
                    <MessageSquare size={20} />
                 </button>
              </div>
            </div>

            {showMap ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <button onClick={() => setShowMap(false)} className="text-[10px] text-gold uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform font-bold">
                  <ChevronRight className="rotate-180" size={12} /> Back to Entry Point
                </button>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                  {PROTOCOL_DAYS.map(d => (
                    <button 
                      key={d.day}
                      disabled={!gameState?.unlocked?.includes(d.day)}
                      onClick={() => { setGameState(prev => prev ? { ...prev, day: d.day, stepsCompleted: [] } : null); setShowMap(false); }}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-1 border transition-all ${
                        gameState?.day === d.day ? 'bg-gold/20 border-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]' :
                        gameState?.unlocked?.includes(d.day) ? 'bg-white/5 border-white/10 hover:border-white/20' : 'opacity-20 border-transparent grayscale'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold leading-none">{d.day}</span>
                      {d.day < (gameState?.day || 1) ? <Check size={8} className="text-green-400" /> : 
                       gameState?.day === d.day ? <Activity size={8} className="text-gold animate-pulse" /> : 
                       <Lock size={8} className="text-muted" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={gameState?.day} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="glass-panel p-5 rounded-xl border-l-[3px] border-l-gold shadow-lg shadow-black/50">
                    <div className="text-[8px] font-bold text-gold uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                       <Target size={10} className="text-gold animate-pulse" /> Mission Brief: Day {gameState?.day}
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed font-medium">
                      {localizeText(currentDay?.mission || "")}
                    </p>
                    {gameState?.day === 1 && (
                      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-[10px] text-blue-300 uppercase leading-relaxed font-bold">
                          Step 1: Open the Audit Tool below. <br/>
                          Step 2: Enter exactly 5 entries (Rent, Food, etc). <br/>
                          Step 3: Mark steps as completed in the Sidebar. <br/>
                          <span className="text-gold italic mt-1 block">Status: {(() => {
                            const auditData = localStorage.getItem(`qw_audit_${gameState.name}`);
                            const count = auditData ? JSON.parse(auditData).length : 0;
                            return `${count}/5 Entries Recorded`;
                          })()}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Interactive Instruments - Day Specific Content */}
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={gameState?.day}
                      initial={{ opacity: 0, filter: 'blur(10px)', x: 20 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
                      exit={{ opacity: 0, filter: 'blur(10px)', x: -20 }}
                      className="space-y-4"
                    >
                      {gameState?.day === 1 && (
                        <div className="space-y-4">
                          <div className="text-[10px] font-bold text-gold uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                            <TableIcon size={12} /> Unit Audit Terminal
                          </div>
                          <AuditTool name={gameState.name} />
                        </div>
                      )}

                      {gameState?.day === 2 && (
                        <div className="space-y-4">
                          <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                            <ShieldCheck size={12} /> Impulse Friction Node
                          </div>
                          <HoldingCell name={gameState.name} />
                        </div>
                      )}

                      {gameState?.day === 3 && (
                        <div className="space-y-4">
                          <div className="text-[10px] font-bold text-red-500 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                            <Scissors size={12} /> Parasite Search & Destroy
                          </div>
                          <SubKiller name={gameState.name} />
                        </div>
                      )}

                      {gameState?.day === 5 && <IpLeakTest />}

                      {gameState?.day === 16 && (
                        <div className="space-y-4">
                           <div className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                             <Search size={12} /> Privacy Breach Node
                           </div>
                           <FootprintScanner unitName={gameState.name} />
                        </div>
                      )}

                      {gameState?.day === 10 && (
                        <div className="space-y-4">
                           <div className="text-[10px] font-bold text-gold uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                             <Trophy size={12} /> Milestone: Stage 01 Clear
                           </div>
                           <ShareAchievement day={10} name={gameState.name} />
                        </div>
                      )}

                      {gameState?.day === 22 && (
                        <div className="space-y-4">
                           <div className="text-[10px] font-bold text-green-400 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                             <TrendingUp size={12} /> Asset Growth Module
                           </div>
                           <CryptoYieldCalculator name={gameState.name} />
                        </div>
                      )}

                      {/* Default Tool for all other days – ensures 100% "worked" instrument requirement */}
                      {![1, 2, 3, 5, 16, 22].includes(gameState?.day || 0) && (
                        <div className="space-y-4">
                           <div className="text-[10px] font-bold text-gold/60 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                             <PenTool size={12} /> System Adherence Module
                           </div>
                           <SovereignJournal 
                             day={gameState?.day || 1} 
                             name={gameState?.name || ""} 
                             task={currentDay?.steps[0]?.task || "Establish Silent Protocol"} 
                           />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="glass-panel p-5 rounded-xl border-l-[3px] border-l-blue-400/50">
                    <div className="text-[8px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-2">Architectural Theory</div>
                    <p className="text-xs text-gray-400 mb-4">{localizeText(currentDay?.theory || "")}</p>
                    <div className="bg-blue-400/5 p-3 rounded-lg border border-blue-400/10 text-xs text-blue-300 font-medium italic">
                      "{currentDay?.tip}"
                    </div>
                  </div>

                  <div className="space-y-2">
                    {currentDay?.steps.map((step, i) => (
                      <button
                        key={step.name} 
                        onClick={() => setActiveStepIdx(i)}
                        className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left group/step ${
                          gameState?.stepsCompleted.includes(i) ? 'bg-green-400/5 border-green-400/30 opacity-70' : 'bg-white/2 border-white/5 hover:border-gold/30'
                        }`}
                      >
                        <div className={`mt-1 font-mono font-bold text-xs ${gameState?.stepsCompleted.includes(i) ? 'text-green-400' : 'text-muted'}`}>
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                             <h4 className={`text-xs font-bold uppercase tracking-widest ${gameState?.stepsCompleted.includes(i) ? 'text-white' : 'text-white/60'}`}>{step.name}</h4>
                             {!gameState?.stepsCompleted.includes(i) && <span className="text-[7px] bg-gold/10 text-gold px-1 rounded opacity-0 group-hover/step:opacity-100 transition-opacity">STUDY</span>}
                          </div>
                          <p className="text-[10px] text-muted mt-1">{localizeText(step.desc)}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          gameState?.stepsCompleted.includes(i) ? 'border-green-400 bg-green-400 text-black' : 'border-white/20'
                        }`}> {gameState?.stepsCompleted.includes(i) && <Check size={12} />} </div>
                      </button>
                    ))}
                  </div>

                  <motion.button 
                    disabled={(() => {
                      if (!gameState || !currentDay) return true;
                      const stepsDone = gameState.stepsCompleted.length === currentDay.steps.length;
                      if (!stepsDone) return true;
                      
                      if (gameState.day === 1) {
                         const auditData = localStorage.getItem(`qw_audit_${gameState.name}`);
                         const count = auditData ? JSON.parse(auditData).length : 0;
                         return count < 5;
                      }
                      return false;
                    })()}
                    onClick={completeDay}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="w-full h-16 glass-panel border border-gold text-gold-light text-xs font-bold tracking-[0.4em] uppercase rounded-xl hover:bg-gold hover:text-black transition-all shadow-xl shadow-gold/20 disabled:opacity-10 group relative overflow-hidden"
                  >
                    <span className="relative z-10 group-hover:scale-105 transition-transform inline-block">Execute Command & Pulse</span>
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      )}
    </div>

    <aside className="hidden lg:flex flex-col gap-6 h-full">
          <div className="glass-panel p-5 rounded-2xl flex-1 flex flex-col shadow-lg">
            <div className="text-[8px] font-bold text-muted uppercase tracking-[0.4em] mb-6 border-b border-white/5 pb-2 flex items-center justify-between">
              Instruction Cycle <Cpu size={10} className="animate-spin-slow" />
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[400px] scrollbar-hide">
              {currentDay?.timeline.map((t, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="text-[10px] font-mono font-bold text-gold opacity-50 group-hover:opacity-100 transition-opacity whitespace-nowrap">{t.time}</div>
                  <div className="flex-1 text-[10px] text-muted leading-tight group-hover:text-white transition-colors">{t.action}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel p-5 rounded-2xl shadow-lg shadow-gold/5">
             <div className="text-[8px] font-bold text-muted uppercase tracking-[0.4em] mb-4 flex items-center justify-between">
                Live Signal <Globe size={10} className="text-blue-400 animate-pulse" />
             </div>
             <ActivityFeed />
          </div>
        </aside>
      </main>

      <footer className="glass-panel p-2 text-center text-[7px] text-muted uppercase tracking-[0.4em] z-10 bg-black/50">
         Quiet Wealth Protocol // Identification Hash: {gameState?.name || 'GHOST'} // Port 3000 Active
      </footer>

      {/* Verification Gate Modal */}
      <AnimatePresence>
        {showVerification && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full glass-panel p-8 rounded-3xl space-y-6 text-center border-gold/40">
              <div className="text-gold flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-4">
                <Shield size={16} /> {currentDay?.verificationGate?.title}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{currentDay?.verificationGate?.desc}</p>
              <div className="bg-white/2 border border-white/5 p-4 rounded-2xl space-y-2 text-left">
                {currentDay?.verificationGate?.checks.map((c, i) => (
                  <div key={i} className="text-[10px] text-muted flex items-center gap-2 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold/50" /> {c}
                  </div>
                ))}
              </div>
              <a 
                onClick={() => {
                  setHasClickedLink(true);
                  localStorage.setItem('day5_link_clicked', 'true');
                }}
                href={currentDay?.verificationGate?.cta.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 bg-green-400/10 border border-green-400/30 text-green-400 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-green-400/20 transition-all font-black"
              >
                {currentDay?.verificationGate?.cta.text} <ExternalLink size={14}/>
              </a>
              <button 
                onClick={handleVerification}
                disabled={currentDay?.day === 5 && !hasClickedLink}
                className={`w-full py-4 bg-gold text-black font-black rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-gold/20 ${
                  currentDay?.day === 5 && !hasClickedLink 
                  ? 'opacity-30 cursor-not-allowed grayscale' 
                  : 'hover:scale-105 active:scale-95'
                }`}
              >
                {currentDay?.verificationGate?.confirmText}
              </button>
              {currentDay?.day === 5 && !hasClickedLink && (
                <p className="text-[9px] text-red animate-pulse uppercase tracking-widest">
                  Authentication Link Required / (RU: Нужно нажать на ссылку для подтверждения)
                </p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAssistant && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="max-w-md w-full glass-panel p-8 rounded-3xl relative border-gold/20 shadow-2xl shadow-gold/10">
              <button onClick={() => setShowAssistant(false)} className="absolute top-4 right-4 text-muted hover:text-white transition-colors">✕</button>
              <div className="text-gold flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-4"><Shield size={16} /> Architect's Mentor</div>
              <div className="min-h-[100px] flex flex-col justify-center">
                {isAssistantLoading ? <div className="flex gap-2"><span className="w-2 h-2 bg-gold/50 rounded-full animate-bounce" /><span className="w-2 h-2 bg-gold/50 rounded-full animate-bounce [animation-delay:-0.15s]" /><span className="w-2 h-2 bg-gold/50 rounded-full animate-bounce [animation-delay:-0.3s]" /></div> :
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-medium">{assistantMsg || localizeText(currentDay?.assistantHint || "")}</p>}
              </div>
              <button onClick={() => setShowAssistant(false)} className="mt-8 w-full py-3 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-muted hover:text-white">Dismiss Frequency</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {screen === 'reward' && (
          <div className="fixed inset-0 z-[200] bg-bg flex flex-col items-center justify-center p-8 text-center bg-radial-[circle_at_50%_0%,rgba(212,175,55,0.08),transparent_60%]">
            <BgCanvas />
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-8 w-full max-w-2xl z-10">
              <div className="text-[120px] font-black text-gold/20 leading-none select-none drop-shadow-[0_0_30px_rgba(212,175,55,0.1)]">{String(gameState?.day).padStart(2, '0')}</div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{currentDay?.title}</h2>
                <p className="text-gold font-bold tracking-[0.3em] uppercase text-xs">Signal Stabilized / Evolution Active</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { l: 'Capital', v: currentDay?.rewards.capital, c: 'text-gold' },
                  { l: 'Focus', v: currentDay?.rewards.focus, c: 'text-blue-400' },
                  { l: 'Vitality', v: currentDay?.rewards.vitality, c: 'text-red-400' },
                  { l: 'Sovereignty', v: currentDay?.rewards.sovereignty, c: 'text-green-400' }
                ].map(r => (
                  <div key={r.l} className="glass-panel p-6 rounded-2xl hover:scale-105 transition-transform">
                     <div className={`text-4xl font-mono font-bold ${r.c}`}>+{r.v}</div>
                     <div className="text-[8px] font-bold text-muted uppercase tracking-widest mt-2">{r.l}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                 <div className="text-[8px] font-bold text-muted uppercase tracking-[0.4em]">Confirm Handshake</div>
                 <input 
                   type="text" 
                   autoFocus
                   placeholder="TYPE COMMAND..."
                   className="bg-transparent border-b border-gold/40 text-center font-mono text-2xl text-white outline-none w-64 uppercase tracking-[0.2em] focus:border-gold transition-all"
                   onChange={(e) => { 
                     if(e.target.value.trim().toUpperCase() === currentDay?.command) handleRewardConfirm(); 
                   }}
                 />
                 <div className="text-[7px] text-muted italic">Signal Required: "{currentDay?.command}" (RU: Введите "{currentDay?.command}")</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Step Study Modal */}
      <AnimatePresence>
        {activeStepIdx !== null && (
          <div className="fixed inset-0 z-[180] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-2xl w-full glass-panel overflow-hidden rounded-3xl flex flex-col max-h-[85vh]">
                <div className="bg-gold/10 p-6 flex justify-between items-center border-b border-gold/20">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-black/40 border border-gold/30 flex items-center justify-center text-gold font-mono font-bold">
                        {String(activeStepIdx + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <div className="text-[8px] font-bold text-gold uppercase tracking-[0.4em]">Sub-Protocol Instruction</div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">{currentDay?.steps[activeStepIdx]?.name}</h3>
                      </div>
                   </div>
                   <button onClick={() => setActiveStepIdx(null)} className="p-2 text-muted hover:text-white transition-colors">✕</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gold uppercase tracking-widest opacity-80">
                         <Cpu size={12} /> Architectural Theory
                      </div>
                      <div className="text-gray-300 leading-relaxed font-mono text-sm whitespace-pre-line border-l-2 border-gold/20 pl-6">
                         {localizeText(currentDay?.steps[activeStepIdx]?.studyContent || "")}
                      </div>
                   </div>

                   {currentDay?.steps[activeStepIdx]?.task && (
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                           <Zap size={12} /> Direct Tasking
                        </div>
                        <p className="text-sm text-white font-medium italic">
                           "{localizeText(currentDay?.steps[activeStepIdx]?.task || "")}"
                        </p>
                     </div>
                   )}

                   <div className="p-4 rounded-xl border border-gold/10 bg-gold/5 text-[10px] text-gold/60 italic flex gap-3">
                      <Info size={14} className="shrink-0" />
                      Physical execution is mandatory for signal stability. Marking this step as complete without action will desync your sovereignty metrics.
                   </div>
                </div>

                <div className="p-6 bg-black/40 border-t border-white/5 flex gap-4">
                   <button 
                     onClick={() => setActiveStepIdx(null)}
                     className="px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-muted hover:text-white hover:bg-white/5 transition-all"
                   >
                     Dismiss
                   </button>
                   <button 
                     onClick={() => {
                        toggleStep(activeStepIdx);
                        setActiveStepIdx(null);
                     }}
                     className={`flex-1 py-4 rounded-xl font-black text-xs tracking-[0.2em] uppercase transition-all shadow-lg ${
                       gameState?.stepsCompleted.includes(activeStepIdx) 
                       ? 'bg-red-500/20 border border-red-500/50 text-red-500 hover:bg-red-500/30' 
                       : 'bg-gold text-black shadow-gold/20 hover:scale-[1.02] active:scale-[0.98]'
                     }`}
                   >
                     {gameState?.stepsCompleted.includes(activeStepIdx) ? 'Re-Open Step' : 'Confirm Execution'}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
