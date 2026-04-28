import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Download, 
  PieChart as PieChartIcon, 
  Table as TableIcon,
  TrendingDown,
  TrendingUp,
  Activity,
  AlertCircle,
  Calculator as CalcIcon,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';

interface Expense {
  id: string;
  date: string;
  desc: string;
  amount: number;
  category: 'survival' | 'growth' | 'noise';
}

const COLORS = {
  survival: '#00e676',
  growth: '#00b4d8',
  noise: '#ff4d4d'
};

export const AuditTool: React.FC<{ name: string }> = ({ name }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [view, setView] = useState<'table' | 'chart' | 'calc'>('table');

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(`qw_audit_${name}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setExpenses(parsed);
          return;
        }
      } catch (e) { console.error(e); }
    }
    
    // Initial sample nodes for new units
    setExpenses([
      { id: 'p1', date: new Date().toISOString().split('T')[0], desc: 'MONTHLY RENT/MORTGAGE', amount: 0, category: 'survival' },
      { id: 'p2', date: new Date().toISOString().split('T')[0], desc: 'SUBSCRIPTION NOISE', amount: 0, category: 'noise' },
      { id: 'p3', date: new Date().toISOString().split('T')[0], desc: 'INVESTMENT FEED', amount: 0, category: 'growth' }
    ]);
  }, [name]);

  // Save data
  useEffect(() => {
    localStorage.setItem(`qw_audit_${name}`, JSON.stringify(expenses));
  }, [expenses, name]);

  const addRow = () => {
    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      desc: '',
      amount: 0,
      category: 'survival'
    };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (id: string, field: keyof Expense, value: any) => {
    setExpenses(prev => {
      const next = prev.map(e => e.id === id ? { ...e, [field]: value } : e);
      return next;
    });
  };

  const deleteRow = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const totals = useMemo(() => {
    const res = { survival: 0, growth: 0, noise: 0 };
    expenses.forEach(curr => {
      const amt = parseFloat(curr.amount as any) || 0;
      if (curr.category in res) {
        res[curr.category] += amt;
      }
    });
    return res;
  }, [expenses]);

  // Calculator logic
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState(0);

  const performCalc = (val: string) => {
    setCalcInput(val);
    try {
      if (!val.trim()) { setCalcResult(0); return; }
      const clean = val.replace(/[^0-9+\-*/().]/g, '');
      const result = eval(clean);
      setCalcResult(Number(result) || 0);
    } catch (e) { /* ignore partial/invalid calc */ }
  };

  const addResultToExpenses = () => {
    if (calcResult <= 0) return;
    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      desc: 'CALCULATED_SUM',
      amount: calcResult,
      category: 'noise'
    };
    setExpenses([...expenses, newExpense]);
    setCalcInput('');
    setCalcResult(0);
    setView('table');
  };

  const chartData = useMemo(() => [
    { name: 'Survival', value: totals.survival, color: COLORS.survival },
    { name: 'Growth', value: totals.growth, color: COLORS.growth },
    { name: 'Noise', value: totals.noise, color: COLORS.noise }
  ].filter(d => d.value > 0), [totals]);

  const exportToCSV = () => {
    let csv = 'Date,Description,Amount,Category\n';
    expenses.forEach(e => {
      csv += `${e.date},${e.desc.replace(/,/g, '')},${e.amount},${e.category}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_${name}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border-gold/30 shadow-2xl">
      <div className="bg-gold/10 p-4 border-b border-gold/20 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold/20 rounded-lg">
            <Activity className="text-gold" size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Financial Audit & Calc</h3>
            <p className="text-[8px] text-muted uppercase tracking-widest">Architect Tool v1.1.0</p>
          </div>
        </div>
        
        <div className="flex gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => setView('table')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-[10px] uppercase font-bold transition-all ${view === 'table' ? 'bg-gold text-black' : 'text-muted hover:text-white'}`}
          >
            <TableIcon size={12} /> Table
          </button>
          <button 
            onClick={() => setView('calc')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-[10px] uppercase font-bold transition-all ${view === 'calc' ? 'bg-orange-500 text-black' : 'text-muted hover:text-white'}`}
          >
            <CalcIcon size={12} /> Calc
          </button>
          <button 
            onClick={() => setView('chart')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-[10px] uppercase font-bold transition-all ${view === 'chart' ? 'bg-blue-500 text-black' : 'text-muted hover:text-white'}`}
          >
            <PieChartIcon size={12} /> Analysis
          </button>
        </div>
      </div>

      <div className="p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          {view === 'table' && (
            <motion.div 
              key="table"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="text-[9px] uppercase tracking-widest text-muted border-b border-white/5">
                      <th className="pb-3 px-2 font-bold">Date</th>
                      <th className="pb-3 px-2 font-bold">Description</th>
                      <th className="pb-3 px-2 font-bold">Amount</th>
                      <th className="pb-3 px-2 font-bold">Vector</th>
                      <th className="pb-3 px-2 font-bold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {expenses.map((e) => (
                      <motion.tr 
                        layout
                        key={e.id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-2 px-2">
                          <input 
                            type="date" 
                            value={e.date}
                            onChange={(val) => updateExpense(e.id, 'date', val.target.value)}
                            className="bg-transparent border-none text-[10px] text-white focus:ring-0 w-full"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input 
                            type="text" 
                            placeholder="Node description..."
                            value={e.desc}
                            onChange={(val) => updateExpense(e.id, 'desc', val.target.value)}
                            className="bg-transparent border-none text-[10px] text-white/80 placeholder:text-muted/30 focus:ring-0 w-full font-mono"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-1">
                            <span className="text-muted text-[10px]">$</span>
                            <input 
                              type="number" 
                              step="0.01"
                              value={e.amount === 0 ? '' : e.amount}
                              onChange={(val) => updateExpense(e.id, 'amount', val.target.value === '' ? 0 : parseFloat(val.target.value))}
                              className="bg-transparent border-none text-[10px] text-gold font-bold focus:ring-0 w-24 px-0"
                            />
                          </div>
                        </td>
                        <td className="py-2 px-2">
                          <select 
                            value={e.category}
                            onChange={(val) => updateExpense(e.id, 'category', val.target.value as any)}
                            className="bg-black/50 border border-white/10 rounded px-2 py-1 text-[9px] uppercase font-bold text-muted focus:text-gold outline-none"
                          >
                            <option value="survival">Survival</option>
                            <option value="growth">Growth</option>
                            <option value="noise">Noise</option>
                          </select>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <button onClick={() => deleteRow(e.id)} className="p-1.5 text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-white/5">
                <button 
                  onClick={addRow}
                  className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Add Transaction
                </button>
                
                <button 
                  onClick={exportToCSV}
                  disabled={expenses.length === 0}
                  className="w-full sm:w-auto px-6 py-3 bg-gold/10 border border-gold/30 text-gold rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold/20 transition-all flex items-center justify-center gap-2 disabled:opacity-20"
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </motion.div>
          )}

          {view === 'calc' && (
            <motion.div 
              key="calc"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6 max-w-md mx-auto py-8"
            >
              <div className="text-center space-y-2">
                <div className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">Quick Summation Hub</div>
                <p className="text-[9px] text-muted uppercase leading-relaxed">Sum up multiple small expenses here before logging them to the main ledger.</p>
              </div>

              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6">
                <div className="space-y-2">
                  <label className="text-[8px] text-muted uppercase tracking-widest">Mathematical Input</label>
                  <input 
                    type="text" 
                    value={calcInput}
                    onChange={(e) => performCalc(e.target.value)}
                    placeholder="e.g. 5.99 + 12.50 + 3.00"
                    className="w-full bg-black/40 border border-white/10 p-4 font-mono text-xl text-gold outline-none focus:border-gold/30 transition-all rounded-xl"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gold/10 rounded-xl border border-gold/20">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Identified Pulse:</span>
                  <span className="text-2xl font-mono font-black text-white">${calcResult.toFixed(2)}</span>
                </div>

                <button 
                  onClick={addResultToExpenses}
                  disabled={calcResult <= 0}
                  className="w-full py-4 bg-gold text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20"
                >
                  Inject Sum into Ledger
                </button>
              </div>
            </motion.div>
          )}

          {view === 'chart' && (
            <motion.div 
              key="chart"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[300px]"
            >
              <div className="h-[250px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#050507', border: '1px solid rgba(212, 175, 55, 0.2)', fontSize: '10px' }}
                        itemStyle={{ color: '#fff', textTransform: 'uppercase' }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => <span className="text-[10px] uppercase font-bold text-muted pr-2">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted uppercase text-[10px] tracking-widest">
                    Insufficient Data for Mapping
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="text-[10px] font-bold text-muted uppercase tracking-[0.4em] mb-4">Static Summary</div>
                
                {[
                  { label: 'Survival Assets', val: totals.survival, color: 'text-green-400', icon: <TrendingUp size={12}/> },
                  { label: 'Growth Fuel', val: totals.growth, color: 'text-blue-400', icon: <TrendingUp size={12}/> },
                  { label: 'System Noise', val: totals.noise, color: 'text-red-400', icon: <TrendingDown size={12}/> }
                ].map((s) => (
                  <div key={s.label} className="p-4 rounded-xl bg-white/2 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-black/40 ${s.color}`}>
                        {s.icon}
                      </div>
                      <span className="text-[10px] font-bold uppercase text-white/70 tracking-widest">{s.label}</span>
                    </div>
                    <div className={`text-sm font-mono font-bold ${s.color}`}>
                      ${s.val.toFixed(2)}
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-white/5 flex justify-between items-center bg-gold/5 -mx-6 -mb-6 p-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold text-white/50">Cumulative Total Pulse</span>
                  <span className="text-xl font-mono font-bold text-gold">
                    ${(totals.survival + totals.growth + totals.noise).toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-black/50 p-3 px-6 text-[8px] text-muted uppercase tracking-[0.3em] flex justify-between items-center italic">
        <span>* Sovereignty increases as Noise ratio decreases</span>
        <span>Secured Node: Audit_V1.1_Calc_Stabilized</span>
      </div>
    </div>
  );
};
