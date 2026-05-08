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
  RefreshCcw,
  PenTool,
  X,
  Eye,
  Scan,
  Terminal,
  AlertTriangle
} from 'lucide-react';
import { PROTOCOL_DAYS, ProtocolDay, LOCALE_CONFIG } from './protocolData';
import { sounds } from './lib/audio';
import { IpLeakTest } from './components/IpLeakTest';
import { BgCanvas } from './components/BgCanvas';
import { ActivityFeed } from './components/ActivityFeed';
import { AuditTool } from './components/AuditTool';
import { HoldingCell } from './components/HoldingCell';
import { SubKiller } from './components/SubKiller';
import { SovereignJournal } from './components/SovereignJournal';
import { CryptoYieldCalculator } from './components/CryptoYieldCalculator';
import { FootprintScanner } from './components/FootprintScanner';
import { SovereignMap } from './components/SovereignMap';
import { ShareAchievement } from './components/ShareAchievement';
import { StatsDashboard } from './components/StatsDashboard';
import { NetworkTerminal } from './components/NetworkTerminal';
import { DataVault } from './components/DataVault';
import { QuietMoneyPortal } from './components/QuietMoneyPortal';
import { OpSecMatrix } from './components/OpSecMatrix';
import html2canvas from 'html2canvas';

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

import { requestNotificationPermission, sendLocalNotification } from './utils/notifications';

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
  const [showMap, setShowMap] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'mission' | 'roadmap' | 'dashboard' | 'vault'>('roadmap');
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [vfxEnabled, setVfxEnabled] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasClickedLink, setHasClickedLink] = useState(false);
  const [devClicks, setDevClicks] = useState(0);
  const [isDevMode, setIsDevMode] = useState(false);
  const [showDevAuth, setShowDevAuth] = useState(false);
  const [devPassword, setDevPassword] = useState("");

  const [showSettings, setShowSettings] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  
  useEffect(() => {
    if ('Notification' in window) {
      setPushEnabled(Notification.permission === 'granted');
    }
  }, []);
  
  const handleExportSave = () => {
    if (!gameState) return;
    const saveStr = btoa(JSON.stringify(gameState));
    navigator.clipboard.writeText(saveStr).then(() => {
      alert("NEURAL BACKUP COPIED TO CLIPBOARD.");
    });
  };

  const handleDownloadCertificate = async () => {
    const certNode = document.getElementById('certificate-node');
    if (!certNode) return;
    try {
      const canvas = await html2canvas(certNode, {
        backgroundColor: '#000',
        scale: 2, // High resolution
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Sovereignty_Certificate_${gameState?.name || 'Unit'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate certificate image:', err);
      alert('Failed to generate image.');
    }
  };

  const handleImportSave = () => {
    const backup = prompt("ENTER NEURAL BACKUP HASH:");
    if (!backup) return;
    try {
      const parsed = JSON.stringify(JSON.parse(atob(backup)));
      const stateObj = JSON.parse(parsed);
      if (stateObj.name && stateObj.day) {
         setGameState(stateObj);
         localStorage.setItem(`qw_save_${stateObj.name}`, parsed);
         localStorage.setItem('qw_currentUser', stateObj.name);
         alert("NEURAL BACKUP RESTORED SUCCESSFULLY.");
         window.location.reload();
      } else {
        alert("CORRUPTED BACKUP DATA.");
      }
    } catch(e) {
      alert("INVALID NEURAL BACKUP HASH.");
    }
  };

  const handleHardReset = () => {
    if (confirm("WARNING: OVERWRITING LOCAL STORAGE. THIS WILL DELETE ALL CAPTURED SOVEREIGNTY. PROCEED?")) {
      const keys = Object.keys(localStorage);
      keys.forEach(k => {
        if (k.startsWith('qw_')) localStorage.removeItem(k);
      });
      window.location.reload();
    }
  };

  const handleDevClick = () => {
    setDevClicks(prev => {
      if (prev + 1 >= 5 && !isDevMode) {
        setShowDevAuth(true);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleDevAuthSubmit = (e: any) => {
    e.preventDefault();
    const pwd = devPassword.trim().toLowerCase();
    if (pwd === "quiet" || pwd === "admin" || pwd === "dev" || pwd === "krakow") {
       setIsDevMode(true);
       setShowDevAuth(false);
       setDevPassword("");
       console.log("DEV MODE UNLOCKED");
       setGameState(gs => {
         if (!gs) return gs;
         return {
           ...gs,
           unlocked: PROTOCOL_DAYS.map(d => d.day)
         };
       });
    } else {
      setDevPassword("");
      setShowDevAuth(false);
    }
  };

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
        const lastTimestamp = s.lastActive ? new Date(s.lastActive).getTime() : 0;
        const last = s.lastActive ? new Date(s.lastActive).toDateString() : null;
        
        if (last && last !== today) {
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          if (last === yesterday) {
            s.streak = (s.streak || 0) + 1;
          } else {
            s.streak = 1;
            // Missed a day penalty
            if (lastTimestamp && Date.now() - lastTimestamp > 48 * 60 * 60 * 1000) {
              if (s.day > 1) {
                const prevDay = s.day - 1; // Basic fallback
                s.day = prevDay > 0 ? prevDay : 1;
                s.sovereignty = Math.max(0, (s.sovereignty || 0) - 10);
                s.focus = Math.max(0, (s.focus || 0) - 5);
                s.stepsCompleted = [];
                setTimeout(() => {
                  alert(`PROTOCOL BREACH. You failed to report within 48h.\n\nPenalty Applied:\n- Downgraded to Day ${s.day}\n- Lost 10 Sovereignty\n- Lost 5 Focus`);
                }, 1000);
              }
            }
          }
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
      sounds.setDay(gameState.day);
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

  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const requestReset = () => {
    setIsConfirmingReset(true);
  };

  const executeReset = () => {
    const targetName = gameState ? gameState.name : nameInput.trim().toUpperCase();
    const key = `qw_state_${targetName}`;
    localStorage.removeItem(key);
    // Let's also do a hard reset to be safe
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      if (k.startsWith(`qw_`) && k.includes(targetName)) localStorage.removeItem(k);
    });
    setGameState(null);
    setScreen('intro');
    setIsConfirmingReset(false);
    window.location.reload();
  };

  const cancelReset = () => {
    setIsConfirmingReset(false);
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
    if (gameState.day === 1 && !isDevMode) {
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
    if (day.steps.length > gameState.stepsCompleted.length && !isDevMode) {
      sounds.glitch();
      alert("UNFINISHED_OBJECTIVES. STABILIZE_ALL_NODES_BEFORE_PROCEEDING.");
      return;
    }

    // Special Data Check for Day 5 (IP Scan)
    if (gameState.day === 5 && !isDevMode) {
      const ipResult = localStorage.getItem('day5_ip_result');
      if (!ipResult) {
        sounds.glitch();
        alert("CRITICAL_ERROR: PERIMETER_UNSCANNED. YOU_MUST_RUN_THE_IP_LEAK_TEST_BEFORE_PROCEEDING.");
        return;
      }
    }

    if (day.verificationGate?.required) {
      setHasClickedLink(localStorage.getItem(`qw_link_clicked_${gameState.day}`) === 'true');
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
      
      // Attempt to schedule daily background reminder (if permissions granted)
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        // Here we'd send a request to our Push Service / Service Worker
        // For local-only, we immediately show it after 15s to demonstrate,
        // but typically this would hook into Web Push API or Local Notifications.
        /* sendLocalNotification(`День ${nextDayNum} Доступен`, `Протокол ждет. Продолжите развитие.`); */
      }
      
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
    if (gameState) {
      localStorage.removeItem(`qw_link_clicked_${gameState.day}`);
    }
    finalizeDay();
  };

  const currentDay = useMemo(() => PROTOCOL_DAYS.find(d => d.day === (gameState?.day || 1)), [gameState?.day]);

  const ConfirmResetModal = () => (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-panel p-8 border border-red-500/30 text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <h2 className="text-xl font-mono text-red-500 tracking-[0.3em] uppercase font-black">SYSTEM PURGE</h2>
        <p className="text-xs text-white/70 uppercase tracking-widest leading-relaxed font-mono">
          Are you sure? This will unconditionally erase all sovereign progress and identity data.
        </p>
        <div className="flex flex-col gap-3 pt-4">
          <button 
            onClick={executeReset}
            className="w-full py-4 bg-red-500/10 text-red-500 text-[10px] border border-red-500/30 hover:bg-red-500 hover:text-black transition-all uppercase tracking-[0.3em] font-black"
          >
            CONFIRM PURGE
          </button>
          <button 
            onClick={cancelReset}
            className="w-full py-4 text-[10px] text-white/40 border border-white/5 hover:bg-white/5 hover:text-white transition-colors uppercase tracking-[0.3em]"
          >
            ABORT
          </button>
        </div>
      </div>
    </div>
  );

  if (screen === 'intro') {
    if (!isBooting && bootLog.length === 0) {
      return (
        <QuietMoneyPortal onUnlock={startBooting} onInteract={handleInteraction} />
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-20" />
        <BgCanvas />
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
                 className="flex items-end gap-1.5 px-6 py-3 border border-[#d4af37]/10 rounded-none bg-[#d4af37]/5 h-full"
               >
                  {[...Array(12)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      animate={{ height: [4, 16, 4] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                      className="w-1 bg-[#d4af37]/40 shadow-[0_0_8px_rgba(212,175,55,0.2)] rounded-none" 
                    />
                  ))}
               </motion.div>
             </div>
             <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-7xl font-sans tracking-[0.2em] md:tracking-[0.3em] uppercase drop-shadow-[0_0_20px_rgba(212,175,55,0.3)] mb-4 text-[#d4af37]"
              >
                NEURAL ACCESS
              </motion.h1>
          <p className="text-[#d4af37]/60 text-[10px] md:text-[12px] tracking-[0.8em] md:tracking-[1em] uppercase mt-4 font-mono">
            CONNECTION_STABLE // READY_FOR_SYNC
          </p>
        </motion.div>

        <div className="z-10 relative w-full max-w-2xl flex flex-col items-center justify-center gap-12">
          {/* Quantum Core Assembly - Minimalized for strict terminal vibe */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: mousePos.x * 0.05,
              y: mousePos.y * 0.05  
            }}
            transition={{ delay: 0.2 }}
            className="relative w-72 h-72 flex items-center justify-center"
          >
            {/* Core Processor Element */}
            <div className="relative p-16 bg-black/60 border border-[#d4af37]/10 flex items-center justify-center overflow-hidden group">
               <div className="absolute inset-0 bg-[#d4af37]/5 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-in-out" />
               <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center justify-center relative z-10"
              >
                <div className="relative border border-[#d4af37]/20 p-8 rounded-none">
                  <Shield size={70} className="text-[#d4af37]/80" strokeWidth={0.5} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Lock size={20} className="text-[#d4af37] mt-1" strokeWidth={1} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Minimal Geometric Accents */}
            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-[#d4af37]/30" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-[#d4af37]/30" />
            <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-[#d4af37]/10" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-[#d4af37]/10" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center space-y-10 w-full max-w-lg mt-4"
          >
            <p className="text-gray-400 italic text-[11px] md:text-[14px] leading-relaxed tracking-wide">
              "We are the <span className="text-[#d4af37] font-bold">Silence.</span> To join us, you must leave the <span className="text-[#d4af37] font-bold">Noise.</span>"
            </p>

            <AnimatePresence mode="wait">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="relative group max-w-sm mx-auto">
                  <div className="absolute -top-8 left-0 right-0 text-[9px] text-[#d4af37]/40 tracking-[0.8em] uppercase text-center font-mono">
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
                    className="w-full bg-transparent border-b border-[#d4af37]/20 p-5 font-sans text-xl md:text-2xl text-center text-[#d4af37] outline-none focus:border-[#d4af37]/80 transition-all placeholder:text-[#d4af37]/10 uppercase tracking-[0.4em]"
                  />
                  <div className="absolute bottom-0 left-0 h-[2px] bg-[#d4af37] shadow-[0_0_15px_#d4af37] origin-center scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700" />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startProtocol}
                  disabled={!nameInput.trim()}
                  className="group relative w-full max-w-sm mx-auto py-6 bg-black border border-[#d4af37]/30 text-[#d4af37] font-sans text-[12px] md:text-[14px] tracking-[0.4em] uppercase overflow-hidden transition-all disabled:opacity-10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-center gap-4 hover:border-[#d4af37] hover:bg-[#d4af37]/5"
                >
                  <div className="absolute inset-0 bg-[#d4af37]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Zap size={18} className="relative z-10 text-[#d4af37]" />
                  <span className="relative z-10 drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]">Authorize Access</span>
                </motion.button>

                <button 
                  onClick={requestReset}
                  className="text-[8px] text-muted hover:text-red-400 transition-colors uppercase tracking-[0.5em] opacity-40 hover:opacity-100"
                >
                  Purge System Identity
                </button>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {isConfirmingReset && <ConfirmResetModal />}

        <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8 md:gap-16 text-[7px] text-[#d4af37]/20 tracking-[0.5em] uppercase font-mono hidden md:flex pointer-events-none whitespace-nowrap">
          <span>ARCHITECT_CORE_V4.2</span>
          <span>//</span>
          <span>SECURED_TERMINAL_001</span>
        </div>
      </div>
    );
  }

  if (screen === 'onboarding') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#020202] relative overflow-hidden font-sans">
         <BgCanvas />
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl w-full p-12 bg-black border border-[#d4af37]/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10">
            {/* Corner Decorators */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#d4af37]/30" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#d4af37]/30" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#d4af37]/30" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#d4af37]/30" />

            <div className="text-center space-y-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-sans text-[#d4af37] tracking-[0.3em] uppercase drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  SELECT ARCHETYPE
                </h2>
                <div className="w-16 h-px bg-[#d4af37]/40 mx-auto mt-6" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 {AVATARS.map(av => (
                   <button 
                     key={av.id}
                     onClick={() => {
                       sounds.step();
                       setRegistrationAvatar(av.id);
                     }}
                     className={`p-6 border transition-all duration-500 flex flex-col items-center justify-center gap-4 relative group overflow-hidden ${registrationAvatar === av.id ? 'bg-[#d4af37]/10 border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'bg-black border-[#d4af37]/10 hover:border-[#d4af37]/40 opacity-70 hover:opacity-100'}`}
                   >
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#d4af37]/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
                      <div className="text-4xl relative z-10 grayscale group-hover:grayscale-0">{av.icon}</div>
                      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d4af37] leading-tight relative z-10">{av.label}</div>
                   </button>
                 ))}
              </div>

              <div className="space-y-4">
                 <div className="text-[10px] text-[#d4af37]/50 uppercase tracking-[0.4em] font-mono">NEURAL_DESYNC_STATUS</div>
                 <div className="p-6 bg-black border border-[#d4af37]/10 text-center relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d4af37]/30" />
                    <p className="text-[11px] text-[#d4af37]/80 uppercase tracking-widest leading-relaxed font-sans">
                      Standard jurisdictions purged.<br/>Neural link isolated from state tracking.
                    </p>
                 </div>
              </div>

              <button 
                onClick={confirmOnboarding}
                className="w-full py-6 bg-transparent border border-[#d4af37]/40 hover:border-[#d4af37] text-[#d4af37] font-sans uppercase text-sm tracking-[0.4em] transition-all hover:bg-[#d4af37]/10 flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-[#d4af37]/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10 drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]">INITIALIZE NODE</span>
              </button>
            </div>
         </motion.div>
      </div>
    );
  }

  if (screen === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-[#020202] relative overflow-hidden">
        <BgCanvas />
        <div className="crt-overlay" />
        
        <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
          <div className="text-8xl font-black text-[#d4af37] animate-pulse drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">QW</div>
          <div className="w-full space-y-2">
            <div className="flex justify-between text-[8px] font-mono text-[#d4af37] uppercase tracking-widest">
               <span>Loading System Modules</span>
               <span>{loadingProgress}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-none overflow-hidden border border-white/5">
              <motion.div className="h-full bg-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.5)]" style={{ width: `${loadingProgress}%` }} />
            </div>
          </div>
          
          <div className="w-full glass-panel p-4 rounded-none font-mono text-[7px] text-muted space-y-1 h-32 overflow-hidden relative">
             <div className="animate-pulse flex items-center gap-2 mb-2">
                <span className="w-1 h-1 bg-[#d4af37] rounded-none" />
                <span className="text-[#d4af37]">DIAGNOSTIC_IN_PROGRESS</span>
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

  if (gameState && gameState.day >= 30) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center relative overflow-hidden font-mono">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2 }} className="max-w-3xl w-full z-10 flex flex-col items-center">
          
          {/* Certificate Container */}
          <div id="certificate-node" className="relative p-16 md:p-24 border border-white/20 bg-black w-full overflow-hidden shadow-2xl">
            {/* Minimalist Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/40" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/40" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/40" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/40" />
            
            <div className="space-y-16">
              <div className="flex flex-col items-center gap-4">
                 <div className="w-16 h-px bg-white/40" />
                 <div className="tracking-[0.5em] text-white/50 text-[10px] uppercase">Quiet Wealth Protocol</div>
                 <div className="w-16 h-px bg-white/40" />
              </div>

              <div className="space-y-4">
                 <div className="text-[10px] tracking-[0.4em] text-white/40 uppercase">Certificate of Access</div>
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase">{gameState.name}</h2>
                 <div className="text-[12px] tracking-[0.6em] text-[#d4af37] uppercase mt-2">Status: MASTER</div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
                 {[
                   { l: 'Capital', v: 'MASTER' },
                   { l: 'Focus', v: 'MAXIMUM' },
                   { l: 'Vitality', v: 'MAXIMUM' },
                   { l: 'Sovereignty', v: 'ABSOLUTE' }
                 ].map(s => (
                   <div key={s.l} className="flex flex-col items-center">
                     <div className="text-xl text-white block mb-1 font-bold tracking-widest">{s.v}</div>
                     <div className="text-[8px] uppercase tracking-widest text-white/40">{s.l}</div>
                   </div>
                 ))}
              </div>

              <div className="flex justify-between items-end pt-12">
                 <div className="text-left space-y-1">
                    <div className="text-[8px] text-white/30 uppercase tracking-widest">ID_HASH</div>
                    <div className="text-[10px] text-white/50 font-mono">0x{Math.random().toString(16).slice(2, 10).toUpperCase()}_{gameState.day}</div>
                 </div>
                 <div className="text-right space-y-1">
                    <div className="text-[8px] text-white/30 uppercase tracking-widest">Auth_Date</div>
                    <div className="text-[10px] text-white/50 font-mono">
                      {new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}-{String(new Date().getDate()).padStart(2, '0')}
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <button 
              onClick={handleDownloadCertificate} 
              className="text-[10px] uppercase tracking-widest text-[#d4af37]/80 hover:text-[#d4af37] transition-colors border-b border-[#d4af37]/20 hover:border-[#d4af37] pb-1"
            >
              Preserve Record 🖼️
            </button>
            <button 
              onClick={requestReset} 
              className="text-[10px] uppercase tracking-widest text-white/30 hover:text-red-400 transition-colors border-b border-transparent hover:border-red-400 pb-1"
            >
              Initialize New Cycle
            </button>
          </div>
        </motion.div>
        {isConfirmingReset && <ConfirmResetModal />}
      </div>
    );
  }

  const getClearanceLevel = () => {
    const day = gameState?.day || 1;
    if (day >= 25) return { color: 'text-white', name: 'Sovereign Architect', bg: 'bg-white/10' };
    if (day >= 15) return { color: 'text-white/80', name: 'Ghost Node', bg: 'bg-white/5' };
    if (day >= 7) return { color: 'text-white/60', name: 'Network Unit', bg: 'bg-white/5' };
    return { color: 'text-[#d4af37]', name: 'Prospect', bg: 'bg-[#d4af37]/10' };
  };

  const clearance = getClearanceLevel();

  const milestoneClass = gameState?.day === 10 ? 'bg-milestone-1' : 
                         gameState?.day === 20 ? 'bg-milestone-2' : 
                         gameState?.day === 30 ? 'bg-milestone-3' : 'bg-[#020202]';

  return (
    <div className={`min-h-screen flex flex-col font-sans relative overflow-hidden ${milestoneClass}`}>
      
      {/* Visual Effects Layer */}
      {vfxEnabled && (
        <>
          <div className="crt-overlay" />
          <div className="scanline" />
          <div className="vignette" />
        </>
      )}
      
      <BgCanvas />
      
      <header className="glass-panel sticky top-0 z-50 p-4 flex justify-between items-center px-6 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-6">
          <div 
            className="glitch-wrap px-3 py-1.5 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-none group hover:border-[#d4af37] transition-colors cursor-pointer" 
            onClick={() => setScreen('intro')}
          >
            <span className="text-[10px] font-black tracking-[0.2em] text-[#d4af37]-gradient" data-text="QW_PROT">QW_PROT</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex gap-4 items-center">
            <div className="text-2xl bg-[#d4af37]/10 w-10 h-10 flex items-center justify-center rounded-none border border-[#d4af37]/20">
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
                System Access Level: {clearance.name}
             </div>
             <div className="h-4 w-px bg-white/10" />
             <div className="flex flex-col items-end">
               <div className="text-[#d4af37] font-mono font-bold text-[10px]">{gameState?.streak}D STREAK</div>
               <div className="text-[7px] text-muted tracking-widest font-bold uppercase flex items-center gap-1">
                 <Zap size={8} className="text-green-400" /> Neural_Link: Active
               </div>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <button onClick={() => setShowSettings(true)} className="p-2 rounded-none bg-white/5 text-muted hover:text-white transition-colors border border-white/5">
                <Terminal size={14} />
             </button>
             <button onClick={() => setAudioEnabled(sounds.toggleAudio())} className="p-2 rounded-none bg-white/5 text-muted hover:text-white transition-colors border border-white/5">
               {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col lg:grid lg:grid-cols-[1fr_260px] gap-8 relative z-10">
        <div className="space-y-8">
          {/* Navigation Tabs */}
          <div className="flex gap-1 bg-black/40 p-1 rounded-none border border-white/5 w-fit">
            <button 
              onClick={() => setViewMode('roadmap')}
              className={`px-6 py-2 rounded-none text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'roadmap' ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20' : 'text-muted hover:text-white'}`}
            >
              System Roadmap
            </button>
            <button 
              onClick={() => setViewMode('mission')}
              className={`px-6 py-2 rounded-none text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'mission' ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20' : 'text-muted hover:text-white'}`}
            >
              Protocol Mission
            </button>
            <button 
              onClick={() => setViewMode('dashboard')}
              className={`px-6 py-2 rounded-none text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'dashboard' ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20' : 'text-muted hover:text-white'}`}
            >
              Analytics
            </button>
            <button 
              onClick={() => setViewMode('vault')}
              className={`px-6 py-2 rounded-none text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'vault' ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20' : 'text-muted hover:text-white'}`}
            >
              System Vault
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Capital', val: gameState?.capital, icon: <TrendingUp size={12}/>, color: 'text-[#d4af37]' },
              { label: 'Focus', val: gameState?.focus, icon: <Brain size={12}/>, color: 'text-blue-400' },
              { label: 'Vitality', val: gameState?.vitality, icon: <Activity size={12}/>, color: 'text-red-400' },
              { label: 'Sovereignty', val: gameState?.sovereignty, icon: <Shield size={12}/>, color: 'text-green-400' }
            ].map(stat => (
              <div key={stat.label} className="glass-panel p-3 rounded-none hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-bold text-muted uppercase tracking-widest flex items-center gap-1">
                    {stat.icon} {stat.label}
                  </span>
                  <span className={`text-xs font-mono font-bold ${stat.color}`}>{stat.val}</span>
                </div>
                <div className="h-0.5 bg-white/5 rounded-none overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className={`h-full ${stat.color.replace('text', 'bg')}`} />
                </div>
              </div>
            ))}
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
          ) : viewMode === 'dashboard' && gameState ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <StatsDashboard gameState={gameState} />
            </motion.div>
          ) : viewMode === 'vault' && gameState ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <DataVault gameState={gameState} />
            </motion.div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 overflow-hidden">
                <span className="text-6xl font-black text-[#d4af37]/30 flex-shrink-0">{String(gameState?.day).padStart(2, '0')}</span>
                <div className="min-w-0">
                  <div className="text-[#d4af37] text-[8px] font-bold tracking-[0.2em] uppercase truncate">Quiet Money Protocol</div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight truncate uppercase">{currentDay?.title}</h2>
                </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => setViewMode('roadmap')} className="p-3 text-white/30 hover:text-white hover:bg-white/5 rounded-none transition-all">
                    <MapIcon size={20} />
                 </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={gameState?.day} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="glass-panel p-5 rounded-none border-l-[3px] border-l-[#d4af37] shadow-lg shadow-black/50">
                    <div className="text-[8px] font-bold text-[#d4af37] uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                       <Target size={10} className="text-[#d4af37] animate-pulse" /> Mission Brief: Day {gameState?.day}
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed font-medium">
                      {localizeText(currentDay?.mission || "")}
                    </p>
                    {gameState?.day === 1 && (
                      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-none">
                        <p className="text-[10px] text-blue-300 uppercase leading-relaxed font-bold">
                          Step 1: Open the Audit Tool below. <br/>
                          Step 2: Enter exactly 5 entries (Rent, Food, etc). <br/>
                          Step 3: Mark steps as completed in the Sidebar. <br/>
                          <span className="text-[#d4af37] italic mt-1 block">Status: {(() => {
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
                          <div className="text-[10px] font-bold text-[#d4af37] uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
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

                      {gameState?.day === 11 && (
                        <div className="space-y-4">
                           <div className="text-[10px] font-bold text-[#d4af37] uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                             <Shield size={12} /> Threat Model Matrix
                           </div>
                           <OpSecMatrix name={gameState.name} />
                        </div>
                      )}

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
                           <div className="text-[10px] font-bold text-[#d4af37] uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
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
                      {![1, 2, 3, 5, 11, 16, 22].includes(gameState?.day || 0) && (
                        <div className="space-y-4">
                           <div className="text-[10px] font-bold text-[#d4af37]/60 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
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

                  <div className="glass-panel p-5 rounded-none border-l-[3px] border-l-blue-400/50">
                    <div className="text-[8px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-2">Architectural Theory</div>
                    <p className="text-xs text-gray-400 mb-4">{localizeText(currentDay?.theory || "")}</p>
                    <div className="bg-blue-400/5 p-3 rounded-none border border-blue-400/10 text-xs text-blue-300 font-medium italic">
                      "{currentDay?.tip}"
                    </div>
                  </div>

                  <div className="space-y-2">
                    {currentDay?.steps.map((step, i) => (
                      <button
                        key={step.name} 
                        onClick={() => setActiveStepIdx(i)}
                        className={`w-full flex items-start gap-4 p-4 rounded-none border transition-all text-left group/step ${
                          gameState?.stepsCompleted.includes(i) ? 'bg-green-400/5 border-green-400/30 opacity-70' : 'bg-white/2 border-white/5 hover:border-[#d4af37]/30'
                        }`}
                      >
                        <div className={`mt-1 font-mono font-bold text-xs ${gameState?.stepsCompleted.includes(i) ? 'text-green-400' : 'text-muted'}`}>
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                             <h4 className={`text-xs font-bold uppercase tracking-widest ${gameState?.stepsCompleted.includes(i) ? 'text-white' : 'text-white/60'}`}>{step.name}</h4>
                             {!gameState?.stepsCompleted.includes(i) && <span className="text-[7px] bg-[#d4af37]/10 text-[#d4af37] px-1 rounded opacity-0 group-hover/step:opacity-100 transition-opacity">STUDY</span>}
                          </div>
                          <p className="text-[10px] text-muted mt-1">{localizeText(step.desc)}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-none border flex items-center justify-center transition-all ${
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
                    className="w-full h-16 glass-panel border border-[#d4af37] text-[#d4af37]-light text-xs font-bold tracking-[0.4em] uppercase rounded-none hover:bg-[#d4af37] hover:text-black transition-all shadow-xl shadow-[#d4af37]/20 disabled:opacity-10 group relative overflow-hidden"
                  >
                    <span className="relative z-10 group-hover:scale-105 transition-transform inline-block">Execute Command & Pulse</span>
                  </motion.button>
                </motion.div>
              </AnimatePresence>
          </div>
        </div>
      )}
    </div>

    <aside className="hidden lg:flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-none flex flex-col shadow-lg">
            <div className="text-[8px] font-bold text-muted uppercase tracking-[0.4em] mb-4 border-b border-white/5 pb-2 flex items-center justify-between">
              Instruction Cycle <Cpu size={10} className="animate-spin-slow" />
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[250px] scrollbar-hide">
              {currentDay?.timeline.map((t, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="text-[10px] font-mono font-bold text-[#d4af37] opacity-50 group-hover:opacity-100 transition-opacity whitespace-nowrap">{t.time}</div>
                  <div className="flex-1 text-[10px] text-muted leading-tight group-hover:text-white transition-colors">{t.action}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel p-5 rounded-none shadow-lg shadow-[#d4af37]/5">
             <div className="text-[8px] font-bold text-muted uppercase tracking-[0.4em] mb-4 flex items-center justify-between">
                Live Signal <Globe size={10} className="text-blue-400 animate-pulse" />
             </div>
             <ActivityFeed />
          </div>
        </aside>
      </main>

      <footer 
        className="glass-panel p-2 text-center text-[7px] text-muted uppercase tracking-[0.4em] z-10 bg-black/50 cursor-pointer hover:text-white/30 transition-colors"
        onClick={handleDevClick}
      >
         Quiet Wealth Protocol // Identification Hash: {gameState?.name || 'GHOST'} // Port 3000 Active
         {isDevMode && <span className="text-[#d4af37] ml-2 font-bold">[DEV MODE]</span>}
      </footer>

      <AnimatePresence>
        {showDevAuth && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full glass-panel p-8 rounded-none space-y-6 flex flex-col items-center">
              <Terminal size={32} className="text-[#d4af37] mb-2" />
              <h2 className="text-xl font-bold text-white uppercase tracking-widest text-center">Protocol Override</h2>
              <p className="text-xs text-gray-400 text-center uppercase tracking-widest">Awaiting authentication sequence</p>
              
              <form onSubmit={handleDevAuthSubmit} className="w-full flex-col flex items-center space-y-4 w-64">
                <input 
                  autoFocus
                  type="password"
                  value={devPassword}
                  onChange={(e) => setDevPassword(e.target.value)}
                  className="bg-black/50 border border-white/20 text-center w-full px-4 py-3 rounded-none text-white text-sm font-mono tracking-[0.2em] focus:border-[#d4af37] outline-none transition-colors"
                  placeholder="********"
                />
                <div className="flex gap-4 w-full">
                  <button type="button" onClick={() => setShowDevAuth(false)} className="px-4 py-2 border border-white/10 rounded-none text-xs text-muted hover:bg-white/5 uppercase w-full">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#d4af37] text-black font-bold uppercase rounded-none text-xs tracking-widest hover:scale-105 transition-transform w-full">Verify</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Verification Gate Modal */}
      <AnimatePresence>
        {showVerification && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full glass-panel p-8 rounded-none space-y-6 text-center border-[#d4af37]/40">
              <div className="text-[#d4af37] flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-4">
                <Shield size={16} /> {currentDay?.verificationGate?.title}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{currentDay?.verificationGate?.desc}</p>
              <div className="bg-white/2 border border-white/5 p-4 rounded-none space-y-2 text-left">
                {currentDay?.verificationGate?.checks.map((c, i) => (
                  <div key={i} className="text-[10px] text-muted flex items-center gap-2 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-none bg-[#d4af37]/50" /> {c}
                  </div>
                ))}
              </div>
              
              {currentDay?.verificationGate?.cta && (
                <a 
                  onClick={() => {
                    setHasClickedLink(true);
                    if (gameState) {
                      localStorage.setItem(`qw_link_clicked_${gameState.day}`, 'true');
                    }
                  }}
                  href={currentDay?.verificationGate?.cta.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-none flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-purple-500/20 transition-all font-black"
                >
                  {currentDay?.verificationGate?.cta.text} <Terminal size={14}/>
                </a>
              )}

              <button 
                onClick={handleVerification}
                disabled={currentDay?.verificationGate?.cta ? (!hasClickedLink && !isDevMode) : false}
                className={`w-full py-4 bg-[#d4af37] text-black font-black rounded-none text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-[#d4af37]/20 ${
                  (currentDay?.verificationGate?.cta && !hasClickedLink && !isDevMode)
                  ? 'opacity-30 cursor-not-allowed grayscale' 
                  : 'hover:scale-105 active:scale-95'
                }`}
              >
                {currentDay?.verificationGate?.confirmText}
              </button>
              
              {!hasClickedLink && !isDevMode && (
                <p className="text-[9px] text-red animate-pulse uppercase tracking-widest">
                  Tool execution required to proceed
                </p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {screen === 'reward' && (
          <div className="fixed inset-0 z-[200] bg-[#020202] flex flex-col items-center justify-center p-8 text-center bg-radial-[circle_at_50%_0%,rgba(212,175,55,0.08),transparent_60%]">
            <BgCanvas />
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-8 w-full max-w-2xl z-10">
              <div className="text-[120px] font-black text-[#d4af37]/20 leading-none select-none drop-shadow-[0_0_30px_rgba(212,175,55,0.1)]">{String(gameState?.day).padStart(2, '0')}</div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{currentDay?.title}</h2>
                <p className="text-[#d4af37] font-bold tracking-[0.3em] uppercase text-xs">Signal Stabilized / Evolution Active</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { l: 'Capital', v: currentDay?.rewards.capital, c: 'text-[#d4af37]' },
                  { l: 'Focus', v: currentDay?.rewards.focus, c: 'text-blue-400' },
                  { l: 'Vitality', v: currentDay?.rewards.vitality, c: 'text-red-400' },
                  { l: 'Sovereignty', v: currentDay?.rewards.sovereignty, c: 'text-green-400' }
                ].map(r => (
                  <div key={r.l} className="glass-panel p-6 rounded-none hover:scale-105 transition-transform">
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
                   className="bg-transparent border-b border-[#d4af37]/40 text-center font-mono text-2xl text-white outline-none w-64 uppercase tracking-[0.2em] focus:border-[#d4af37] transition-all"
                   onChange={(e) => { 
                     if(e.target.value.trim().toUpperCase() === currentDay?.command) handleRewardConfirm(); 
                   }}
                 />
                 <div className="text-[7px] text-muted italic">Signal Required: "{currentDay?.command}"</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Step Study Modal */}
      <AnimatePresence>
        {activeStepIdx !== null && (
          <div className="fixed inset-0 z-[180] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-2xl w-full glass-panel overflow-hidden rounded-none flex flex-col max-h-[85vh]">
                <div className="bg-[#d4af37]/10 p-6 flex justify-between items-center border-b border-[#d4af37]/20">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-none bg-black/40 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] font-mono font-bold">
                        {String(activeStepIdx + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <div className="text-[8px] font-bold text-[#d4af37] uppercase tracking-[0.4em]">Sub-Protocol Instruction</div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">{currentDay?.steps[activeStepIdx]?.name}</h3>
                      </div>
                   </div>
                   <button onClick={() => setActiveStepIdx(null)} className="p-2 text-muted hover:text-white transition-colors">✕</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#d4af37] uppercase tracking-widest opacity-80">
                         <Cpu size={12} /> Architectural Theory
                      </div>
                      <div className="text-gray-300 leading-relaxed font-mono text-sm whitespace-pre-line border-l-2 border-[#d4af37]/20 pl-6">
                         {localizeText(currentDay?.steps[activeStepIdx]?.studyContent || "")}
                      </div>
                   </div>

                   {currentDay?.steps[activeStepIdx]?.task && (
                     <div className="p-6 bg-white/5 rounded-none border border-white/10 space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                           <Zap size={12} /> Direct Tasking
                        </div>
                        <p className="text-sm text-white font-medium italic">
                           "{localizeText(currentDay?.steps[activeStepIdx]?.task || "")}"
                        </p>
                     </div>
                   )}

                   <div className="p-4 rounded-none border border-[#d4af37]/10 bg-[#d4af37]/5 text-[10px] text-[#d4af37]/60 italic flex gap-3">
                      <Info size={14} className="shrink-0" />
                      Physical execution is mandatory for signal stability. Marking this step as complete without action will desync your sovereignty metrics.
                   </div>
                </div>

                <div className="p-6 bg-black/40 border-t border-white/5 flex gap-4">
                   <button 
                     onClick={() => setActiveStepIdx(null)}
                     className="px-6 py-4 rounded-none text-[10px] font-bold uppercase tracking-widest text-muted hover:text-white hover:bg-white/5 transition-all"
                   >
                     Dismiss
                   </button>
                   <button 
                     onClick={() => {
                        toggleStep(activeStepIdx);
                        setActiveStepIdx(null);
                     }}
                     className={`flex-1 py-4 rounded-none font-black text-xs tracking-[0.2em] uppercase transition-all shadow-lg ${
                       gameState?.stepsCompleted.includes(activeStepIdx) 
                       ? 'bg-red-500/20 border border-red-500/50 text-red-500 hover:bg-red-500/30' 
                       : 'bg-[#d4af37] text-black shadow-[#d4af37]/20 hover:scale-[1.02] active:scale-[0.98]'
                     }`}
                   >
                     {gameState?.stepsCompleted.includes(activeStepIdx) ? 'Re-Open Step' : 'Confirm Execution'}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm glass-panel p-6 rounded-none border-[#d4af37]/30">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-[12px] font-black text-[#d4af37] uppercase tracking-[0.2em]">System Controls</h3>
                   <button onClick={() => setShowSettings(false)} className="text-muted hover:text-white"><X size={16}/></button>
                </div>
                
                <div className="space-y-4">
                   <div className="p-4 bg-white/5 border border-white/10 rounded-none space-y-4">
                      <div className="text-[10px] font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Environment Controls</div>
                      <button 
                        onClick={() => setAudioEnabled(sounds.toggleAudio())}
                        className="w-full flex justify-between items-center py-1 text-xs text-muted hover:text-white transition-colors"
                      >
                         <span>Terminal Sounds</span>
                         <span className={audioEnabled ? "text-green-400 font-bold" : "text-red-400"}>{audioEnabled ? "ON" : "OFF"}</span>
                      </button>
                      <button 
                        onClick={() => setVfxEnabled(!vfxEnabled)}
                        className="w-full flex justify-between items-center py-1 text-xs text-muted hover:text-white transition-colors"
                      >
                         <span>CRT Visual Overlay</span>
                         <span className={vfxEnabled ? "text-green-400 font-bold" : "text-red-400"}>{vfxEnabled ? "ON" : "OFF"}</span>
                      </button>
                      <button 
                        onClick={async () => {
                          try {
                            const granted = await requestNotificationPermission();
                            setPushEnabled(granted);
                            if (granted) {
                              sendLocalNotification('PROTOCOL ACTIVE', 'System connected. Notifications enabled.');
                            } else {
                              alert("Вы не можете включить уведомления в окне предварительного просмотра (iframe). Нажмите кнопку «Открыть в новой вкладке» (Open in New Tab) в правом верхнем углу, чтобы разрешить уведомления, или проверьте настройки браузера.");
                            }
                          } catch (e) {
                            alert("Браузер блокирует запрос. Откройте приложение в новой вкладке.");
                          }
                        }}
                        className="w-full flex justify-between items-center py-1 text-xs text-muted hover:text-white transition-colors"
                      >
                         <span>Push Notifications</span>
                         <span className={pushEnabled ? "text-green-400 font-bold" : "text-red-400"}>{pushEnabled ? "ON" : "OFF"}</span>
                      </button>
                   </div>

                   <div className="p-4 bg-white/5 border border-white/10 rounded-none space-y-4">
                      <div className="text-[10px] font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Data Integrity</div>
                      <button 
                        onClick={handleExportSave}
                        className="w-full text-left py-1 text-xs text-[#d4af37]/80 hover:text-[#d4af37] transition-colors block"
                      >
                         &gt; Export Neural Backup
                      </button>
                      <button 
                        onClick={handleImportSave}
                        className="w-full text-left py-1 text-xs text-blue-400/80 hover:text-blue-400 transition-colors block"
                      >
                         &gt; Inject External Backup
                      </button>
                   </div>
                   
                   <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-none space-y-2">
                      <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle size={12} /> Danger Zone
                      </div>
                      <p className="text-[8px] text-red-500/80 uppercase">Warning: Erases all protocol progress and local sovereignty metrics.</p>
                      <button 
                        onClick={handleHardReset}
                        className="w-full py-3 bg-red-500/20 text-red-500 font-bold uppercase tracking-widest text-[9px] rounded-none border border-red-500/50 hover:bg-red-500 hover:text-black transition-all"
                      >
                         Factory Reset Protocol
                      </button>
                   </div>
                   
                   <div className="text-center pt-2">
                      <p className="text-[7px] text-muted uppercase tracking-[0.3em] font-mono">QW_PROT Kernel v3.1</p>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      {gameState && screen === 'game' && <NetworkTerminal gameState={gameState} />}
    </div>
  );
}
