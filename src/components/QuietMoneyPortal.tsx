import React, { useRef, useState, useEffect } from 'react';

interface PortalProps {
  onUnlock: () => void;
  onInteract?: () => void;
}

export const QuietMoneyPortal: React.FC<PortalProps> = ({ onUnlock, onInteract }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsInteraction, setNeedsInteraction] = useState(true);

  const [videoErrorMsg, setVideoErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // We want the intro screen to always show up initially
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  const handleVideoEnded = () => {
    // Hide video and trigger the main terminal logic
    if (videoRef.current) {
        videoRef.current.style.display = 'none';
    }
    onUnlock();
  };

  const handleVideoError = (e?: any) => {
    let msg = "Video failed to play or load.";
    if (videoRef.current && videoRef.current.error) {
      msg += ` Error code: ${videoRef.current.error.code}, message: ${videoRef.current.error.message}`;
    }
    console.error(msg, e);
    setVideoErrorMsg(msg);
  };

  const handleInteraction = () => {
    if (onInteract) onInteract();
    if (videoErrorMsg) {
      onUnlock();
      return;
    }
    if (videoRef.current) {
      videoRef.current.muted = false;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Video play failed after interaction", error);
          setVideoErrorMsg(error.toString());
        });
      }
      setNeedsInteraction(false);
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-[#020202] overflow-hidden font-serif cursor-pointer"
      onClick={handleInteraction}
    >
      {/* Video Background */}
      <video 
        ref={videoRef}
        id="portal-video" 
        playsInline 
        preload="auto"
        onEnded={handleVideoEnded}
        onError={handleVideoError}
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/portal.mp4" type="video/mp4" />
      </video>
      
      {needsInteraction && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 transition-opacity backdrop-blur-md"
             style={{ backgroundImage: 'radial-gradient(circle at center, transparent 30%, black 100%), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 3px)'}}>
          <div className="w-px h-24 bg-gradient-to-t from-transparent to-[#d4af37]/50 mb-8" />
          
          <div className="text-[#d4af37] text-2xl md:text-5xl tracking-[0.4em] uppercase font-bold drop-shadow-[0_0_30px_rgba(212,175,55,0.6)] mb-4 text-center">
            QUIET MONEY PROTOCOL
          </div>
          
          <div className="text-white/60 text-sm md:text-md tracking-[0.4em] uppercase mb-16 animate-pulse text-center">
            SYSTEM STANDBY // AWAITING ACTIVATION
          </div>
          
          {videoErrorMsg && (
             <div className="text-red-500 text-xs max-w-lg mb-8 font-mono border border-red-500/50 p-4 bg-red-500/10">
                ERROR: {videoErrorMsg}
                <br/>
                CLICK TO BYPASS
             </div>
          )}
          
          <div className="px-10 py-4 bg-black/60 border border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-700 cursor-pointer flex items-center justify-center group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            <span className="text-[#d4af37] tracking-[0.5em] text-sm md:text-lg uppercase drop-shadow-[0_0_15px_rgba(212,175,55,1)] relative z-10 transition-transform duration-500 group-hover:scale-105">
              {videoErrorMsg ? "[ BYPASS ERROR ]" : "[ INITIATE SEQUENCE ]"}
            </span>
          </div>
          
          <div className="w-px h-24 bg-gradient-to-b from-transparent to-[#d4af37]/50 mt-16" />
        </div>
      )}
      
      {/* Fallback overlay in case video doesn't autoplay or is missing */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none z-10 mix-blend-overlay" />
    </div>
  );
};

