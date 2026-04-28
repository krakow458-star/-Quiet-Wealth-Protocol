import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Shield, MapPin, Server, Search, AlertTriangle, ExternalLink } from 'lucide-react';

interface IpData {
  ip: string;
  city: string;
  country_name: string;
  org: string;
}

export const IpLeakTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IpData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('day5_ip_result');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData({
          ip: parsed.ip,
          city: parsed.location.split(', ')[0],
          country_name: parsed.location.split(', ')[1],
          org: parsed.isp || 'Unknown'
        });
      } catch (e) {
        console.error("Failed to parse saved IP result", e);
      }
    }
  }, []);

  const checkIP = async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Primary API failed');
        result = await response.json();
      } catch (innerErr) {
        console.warn("Primary IP API failed, trying fallback", innerErr);
        // Fallback to ipify for just the IP
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) throw new Error('Fallback API failed');
        const ipifyData = await response.json();
        result = {
          ip: ipifyData.ip,
          city: 'Unknown',
          country_name: 'Unknown',
          org: 'Unknown'
        };
      }
      
      const ipData: IpData = {
        ip: result.ip || '0.0.0.0',
        city: result.city || 'Hidden',
        country_name: result.country_name || 'Network',
        org: result.org || 'Encrypted Node'
      };

      setData(ipData);
      // Save result to localStorage as requested
      localStorage.setItem('day5_ip_result', JSON.stringify({
        ip: ipData.ip,
        location: `${ipData.city}, ${ipData.country_name}`,
        date: new Date().toISOString()
      }));
    } catch (err) {
      console.error('Error fetching IP:', err);
      setError('Signal synchronization failed. The grid might be blocking external pings.');
      
      // Allow user to proceed even if scan fails technically, but mark it as attempted
      localStorage.setItem('day5_ip_result', JSON.stringify({
        ip: 'SCAN_FAILED',
        location: 'UNKNOWN',
        date: new Date().toISOString()
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleManualPass = () => {
    const data = {
      ip: 'OVERRIDE_ENABLED',
      city: 'Secure',
      country_name: 'Protocol',
      org: 'Manual Shield'
    };
    localStorage.setItem('day5_ip_result', JSON.stringify({
      ip: data.ip,
      location: `${data.city}, ${data.country_name}`,
      date: new Date().toISOString()
    }));
    setData(data);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border-l-[3px] border-l-red bg-red/5 ip-leak-test">
      <div className="flex items-center gap-3 mb-4">
        <Globe size={20} className="text-red animate-pulse" />
        <h3 className="text-sm font-bold text-white tracking-[0.2em] uppercase italic">🌐 IP LEAK TEST</h3>
      </div>
      
      {(!data || error) && !loading && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            See if your digital footprint is visible to the world. <br/>
            <span className="text-[10px] text-gold/60 mt-1 block italic opacity-70">(Проверьте, виден ли ваш цифровой след всему миру.)</span>
          </p>

          <button 
            onClick={checkIP}
            id="ip-check-btn"
            className="bg-gold text-black px-6 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <Search size={14} /> 🔍 {error ? 'Force Ping Grid' : 'Check My IP Visibility'}
          </button>
          
          {error && (
            <div className="text-red text-[9px] bg-red/10 p-4 rounded border border-red/20 font-mono uppercase space-y-2">
               <p className="font-bold">⚠️ {error}</p>
               <p className="text-white/50 lowercase italic leading-relaxed">
                  System blocked the scan. If you can't see your IP, activate manual shield or use NordVPN to mask your signal. <br/>
                  (Система заблокировала сканирование. Если вы не видите свой IP, активируйте защиту вручную или используйте NordVPN.)
               </p>
               <div className="flex flex-wrap gap-2 pt-2">
                  <button onClick={handleManualPass} className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded text-[8px] border border-white/10 transition-colors">
                    Activate Manual Shield
                  </button>
                  <a 
                    href="https://nordvpn.sjv.io/9VezoE" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gold/20 border border-gold/40 text-gold py-2 px-3 rounded text-[8px] font-bold tracking-widest uppercase flex items-center gap-1 hover:bg-gold hover:text-black transition-all"
                  >
                    <Shield size={10} /> Get NordVPN Shield
                  </a>
               </div>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 text-gold">
          <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] font-bold tracking-widest uppercase">Scanning...</span>
        </div>
      )}

      {error && !loading && (
        <div className="text-red text-[10px] bg-red/10 p-3 rounded border border-red/20 mb-4">
          {error}
        </div>
      )}

      <AnimatePresence>
        {data && !loading && (
          <motion.div 
            id="ip-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-red/10 p-5 rounded-xl border-l-4 border-red space-y-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle size={16} />
                <span className="text-[10px] font-bold tracking-widest uppercase">⚠️ WARNING: Your IP address is currently VISIBLE.</span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col text-[10px]">
                  <span className="text-muted uppercase tracking-widest mb-1">IP ADDRESS</span>
                  <span id="user-ip" className="text-white font-mono text-lg font-black">{data.ip}</span>
                </div>
                <div className="flex flex-col text-[10px]">
                  <span className="text-muted uppercase tracking-widest mb-1">LOCATION</span>
                  <span id="user-location" className="text-white font-bold">{data.city}, {data.country_name}</span>
                </div>
                <div className="flex flex-col text-[10px]">
                  <span className="text-muted uppercase tracking-widest mb-1">ISP</span>
                  <span id="user-isp" className="text-white font-bold">{data.org}</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-muted-dim italic leading-relaxed">
              Anyone you visit online can see this information. It's time to go invisible.
            </p>

            <div className="flex flex-col gap-3">
              <a 
                href="https://nordvpn.sjv.io/9VezoE" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gold text-black py-4 px-6 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                <Shield size={16} /> 🔒 GET NORDVPN — HIDE YOUR IP NOW <ExternalLink size={14}/>
              </a>
              <button 
                onClick={checkIP}
                className="text-white/30 text-[8px] uppercase tracking-widest hover:text-white transition-colors"
              >
                🔍 Check Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
