
import React, { useState, useEffect, useRef } from 'react';
import { ProcessStatus, LogEntry } from './types';
import { obfuscate } from './services/obfuscatorEngine';
import { 
  Terminal, 
  Code2, 
  Cpu, 
  Zap, 
  Copy, 
  Download, 
  RefreshCw, 
  ShieldAlert, 
  Box,
  Layers,
  Database,
  Hash,
  Activity,
  ChevronRight,
  Settings as SettingsIcon,
  Monitor
} from 'lucide-react';

type Tab = 'EDITOR' | 'PIPELINE' | 'SETTINGS' | 'CONSOLE';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('EDITOR');
  const [inputName, setInputName] = useState<string>('xf_module');
  const [sourceCode, setSourceCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [obfLevel, setObfLevel] = useState<number>(5);
  const [status, setStatus] = useState<ProcessStatus>(ProcessStatus.IDLE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [counter, setCounter] = useState<number>(() => {
    const saved = localStorage.getItem('xf_counter');
    return saved ? parseInt(saved, 10) : 1;
  });

  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('xf_counter', counter.toString());
  }, [counter]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, { message: msg, timestamp: new Date().toLocaleTimeString() }]);
  };

  const handleObfuscate = async () => {
    if (!sourceCode.trim()) return;

    setStatus(ProcessStatus.PROCESSING);
    setActiveTab('PIPELINE');
    setLogs([]);
    setOutputCode('');

    const steps = [
      '[SYS] Initializing virtualization kernel',
      '[SYS] Scanning static reference pointers',
      '[SYS] Applying control flow flattening',
      '[SYS] Injecting metamorphic noise',
      `[SYS] Level ${obfLevel} intensity verified`,
      '[SYS] Compiling polymorphic instruction set',
      '[SYS] Encoding literals with dynamic seeds',
      '[OK] Binary build successful'
    ];

    for (const step of steps) {
      addLog(step);
      await new Promise(r => setTimeout(r, 60 + Math.random() * 120));
    }

    try {
      const result = obfuscate(sourceCode, inputName, counter, obfLevel);
      setOutputCode(result);
      setCounter(prev => prev + 1);
      setStatus(ProcessStatus.COMPLETED);
      addLog(`[BUILD] ${inputName}_${counter}.lua finalized.`);
    } catch (e) {
      setStatus(ProcessStatus.ERROR);
      addLog('[CRIT] Engine fault: transformation cycle failed');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputCode);
    addLog('[IO] Buffer copied');
  };

  const downloadFile = () => {
    const blob = new Blob([outputCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inputName}_v${counter - 1}.lua`;
    a.click();
    URL.revokeObjectURL(url);
    addLog(`[IO] Binary file exported`);
  };

  const reset = () => {
    setSourceCode('');
    setOutputCode('');
    setStatus(ProcessStatus.IDLE);
    setLogs([]);
    setActiveTab('EDITOR');
    addLog('[SYS] Environment flushed');
  };

  const NavItem = ({ tab, icon: Icon, label, badge }: { tab: Tab, icon: any, label: string, badge?: string }) => {
    const isActive = activeTab === tab;
    return (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`w-full flex items-center justify-between px-6 py-4 transition-all group ${
          isActive 
            ? 'sidebar-item-active text-zinc-100' 
            : 'text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.01]'
        }`}
      >
        <div className="flex items-center space-x-4">
          <Icon size={18} className={`${isActive ? 'neon-purple' : 'group-hover:text-purple-500'} transition-colors`} />
          <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
        </div>
        {badge && (
          <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-bold ${isActive ? 'bg-purple-950 text-purple-400' : 'bg-zinc-900 text-zinc-700'}`}>
            {badge}
          </span>
        )}
      </button>
    );
  };

  const MobileNavItem = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => {
    const isActive = activeTab === tab;
    return (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`flex-1 flex flex-col items-center justify-center py-2 transition-all ${
          isActive ? 'mobile-item-active' : 'text-zinc-700'
        }`}
      >
        <Icon size={18} />
        <span className="text-[8px] mt-1 font-bold uppercase tracking-tighter">{label}</span>
      </button>
    );
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#050505] overflow-hidden">
      
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden md:flex w-72 flex-col bg-[#020202] border-r border-zinc-900/50 z-50">
        <div className="p-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-zinc-950 flex items-center justify-center border border-zinc-800 rounded shadow-2xl overflow-hidden p-1">
              <img src="https://files.catbox.moe/gzdxrq.png" alt="XF Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-black text-zinc-100 tracking-tighter uppercase leading-none">XF OBFUSCATION</h1>
              <span className="text-[9px] font-bold text-zinc-700 tracking-widest uppercase">Kernel Utility</span>
            </div>
          </div>
        </div>

        <nav className="flex-grow py-4">
          <div className="px-6 mb-6">
            <span className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em]">Operations</span>
          </div>
          <NavItem tab="EDITOR" icon={Code2} label="Editor" />
          <NavItem tab="PIPELINE" icon={Layers} label="Pipeline" badge={outputCode ? 'READY' : ''} />
          <NavItem tab="SETTINGS" icon={SettingsIcon} label="Settings" />
          <NavItem tab="CONSOLE" icon={Terminal} label="Console" badge={logs.length > 0 ? logs.length.toString() : ''} />
        </nav>

        <div className="p-8 border-t border-zinc-900/50 bg-black/20">
          <div className="flex items-center justify-between text-[9px] font-black text-zinc-700 uppercase mb-4">
            <span>Kernel Status</span>
            <div className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mr-2 animate-pulse shadow-[0_0_8px_#7c3aed]"></span>
              Active
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[9px]">
              <span className="text-zinc-800">BUILD_ID</span>
              <span className="text-zinc-500 font-bold tracking-tighter">XF-{(counter * 1234).toString(16).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-[9px]">
              <span className="text-zinc-800">INTENSITY</span>
              <span className="text-purple-900 font-bold">LEVEL {obfLevel}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* HEADER - MOBILE */}
      <header className="md:hidden flex items-center justify-between px-6 h-16 border-b border-zinc-900/50 bg-[#020202] z-50">
        <div className="flex items-center space-x-3">
          <img src="https://files.catbox.moe/gzdxrq.png" alt="XF Logo" className="w-6 h-6 object-contain" />
          <h1 className="text-xs font-black text-zinc-100 uppercase tracking-tighter">XF OBFUSCATION</h1>
        </div>
        <div className="flex items-center">
          <div className="text-[9px] font-black text-zinc-700 bg-zinc-950 border border-zinc-900 px-3 py-1 rounded-sm uppercase tracking-widest">v1.3-POLY</div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow relative flex flex-col overflow-y-auto pb-24 md:pb-0 z-10">
        <div className="p-6 md:p-12 max-w-6xl mx-auto w-full flex-grow flex flex-col">
          
          {/* TAB: EDITOR */}
          {activeTab === 'EDITOR' && (
            <div className="flex flex-col flex-grow space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-3 flex flex-col min-h-[450px]">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-700">
                    <span className="flex items-center"><Hash size={12} className="mr-2 text-rose-900" /> Source_Buffer</span>
                    <span>{sourceCode.length} Char</span>
                  </div>
                  <div className="flex-grow bg-[#010101] border border-zinc-900 rounded-sm overflow-hidden relative group shadow-2xl">
                    <textarea
                      value={sourceCode}
                      onChange={(e) => setSourceCode(e.target.value)}
                      spellCheck={false}
                      className="w-full h-full p-8 bg-transparent text-sm font-mono leading-relaxed focus:outline-none text-zinc-400 placeholder-zinc-900 selection:bg-purple-900/40"
                      placeholder="-- Initialize input stream by pasting Lua content here..."
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-[#050505] border border-zinc-900/50 p-8 rounded-sm space-y-6 shadow-lg">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700 flex items-center">
                      <Box size={14} className="mr-3 text-purple-900" /> Module Definition
                    </label>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <span className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">Namespace</span>
                        <input
                          type="text"
                          value={inputName}
                          onChange={(e) => setInputName(e.target.value.replace(/[^a-z0-9_-]/gi, ''))}
                          className="w-full bg-black border border-zinc-900 p-3 text-xs font-black text-zinc-400 focus:border-purple-900 focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="p-4 bg-rose-950/5 border border-rose-900/10 rounded-sm">
                        <div className="flex items-start space-x-3 text-[10px] leading-tight text-rose-900 font-black uppercase tracking-tighter">
                          <ShieldAlert size={16} className="shrink-0" />
                          <span>Strict Anti-Dump enabled. Static analysis mitigation active.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleObfuscate}
                    disabled={status === ProcessStatus.PROCESSING || !sourceCode.trim()}
                    className={`w-full py-6 flex items-center justify-center space-x-4 text-xs font-black uppercase tracking-[0.3em] transition-all group relative overflow-hidden border-2 shadow-2xl ${
                      status === ProcessStatus.PROCESSING
                        ? 'bg-zinc-950 text-zinc-800 border-zinc-900 cursor-not-allowed'
                        : 'bg-zinc-100 text-black border-zinc-100 hover:bg-black hover:text-zinc-100 hover:border-zinc-800 active:scale-95'
                    }`}
                  >
                    {status === ProcessStatus.PROCESSING ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        <span>Processing_Bin</span>
                      </>
                    ) : (
                      <>
                        <Zap size={18} fill="currentColor" className="group-hover:neon-purple transition-colors" />
                        <span>Execute Transformation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PIPELINE */}
          {activeTab === 'PIPELINE' && (
            <div className="flex flex-col flex-grow space-y-8 animate-in fade-in duration-500">
              <div className="flex-grow flex flex-col space-y-3 min-h-[450px]">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-700">
                  <span className="flex items-center"><Database size={12} className="mr-2 text-emerald-950" /> Virtual_Image</span>
                  <span className="text-emerald-950">{outputCode.length || 0} Char</span>
                </div>
                <div className="flex-grow bg-[#010101] border border-zinc-900 rounded-sm overflow-hidden relative shadow-inner">
                  <textarea
                    readOnly
                    value={outputCode}
                    className="w-full h-full p-8 bg-transparent text-[10px] font-mono leading-tight text-zinc-600 break-all focus:outline-none selection:bg-rose-900/30"
                    placeholder="-- Buffer empty. Initialize assembly cycle."
                  />
                  {!outputCode && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-5 pointer-events-none">
                      <Box size={80} className="mb-6" />
                      <span className="text-2xl font-black uppercase italic tracking-tighter">Null Image</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={copyToClipboard}
                  disabled={!outputCode}
                  className="flex items-center justify-center space-x-3 py-5 text-[10px] font-black uppercase border border-zinc-900 bg-[#050505] hover:bg-zinc-950 hover:text-zinc-100 disabled:opacity-20 transition-all shadow-md"
                >
                  <Copy size={16} className="text-purple-900" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={downloadFile}
                  disabled={!outputCode}
                  className="flex items-center justify-center space-x-3 py-5 text-[10px] font-black uppercase border border-zinc-900 bg-[#050505] hover:bg-zinc-950 hover:text-zinc-100 disabled:opacity-20 transition-all shadow-md"
                >
                  <Download size={16} className="text-emerald-950" />
                  <span>Download</span>
                </button>
                <button
                  onClick={reset}
                  className="flex items-center justify-center space-x-3 py-5 text-[10px] font-black uppercase border border-zinc-900 bg-[#050505] hover:bg-zinc-950 hover:text-rose-900 transition-all shadow-md"
                >
                  <RefreshCw size={16} className="text-rose-950" />
                  <span>New Obfuscation</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'SETTINGS' && (
            <div className="flex flex-col flex-grow space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto w-full">
              <div className="flex items-center justify-between border-b border-zinc-900/50 pb-4">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center">
                  <SettingsIcon size={14} className="mr-3 text-purple-900" /> Obfuscation_Parameters
                </span>
              </div>
              
              <div className="bg-[#080808] border border-zinc-900 p-8 rounded-sm space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[11px] font-black uppercase tracking-widest text-zinc-100">Engine Intensity</label>
                    <span className="text-[14px] font-black text-purple-500 tabular-nums">{obfLevel === 1 ? 'LOWEST' : obfLevel === 10 ? 'MAXIMAL' : `LVL ${obfLevel}`}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={obfLevel}
                    onChange={(e) => setObfLevel(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                    <span>Low Noise</span>
                    <span>Max Virtualization</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-900">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Enabled Kernels</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Control Flow Flattening',
                      'Metamorphic Junk Injection',
                      'Polymorphic String Encoding',
                      'Virtual Machine ISA',
                      'Variable Symbol Pollution',
                      'Anti-Static Analysis'
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center space-x-3 bg-zinc-950/50 p-3 border border-zinc-900 rounded-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-900"></div>
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-purple-950/5 border border-purple-900/20 rounded-sm">
                   <p className="text-[10px] font-bold text-purple-900 uppercase leading-relaxed text-center">
                     All transformations are verified for stability.<br/>
                     Binary integrity preserved across all levels.
                   </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CONSOLE */}
          {activeTab === 'CONSOLE' && (
            <div className="flex flex-col flex-grow space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between border-b border-zinc-900/50 pb-4">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center">
                  <Terminal size={14} className="mr-3 text-zinc-800" /> Environment_Stdout
                </span>
                <span className="text-[9px] font-bold text-zinc-800">KERN: POLY_METAMORPHIC</span>
              </div>
              <div
                ref={logContainerRef}
                className="flex-grow bg-[#010101] border border-zinc-900 rounded-sm p-8 overflow-y-auto font-mono text-[11px] leading-relaxed min-h-[450px] shadow-inner"
              >
                {logs.length === 0 ? (
                  <div className="flex items-center space-x-3 text-zinc-900 font-bold select-none">
                    <ChevronRight size={14} />
                    <span>Awaiting system trigger...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log, i) => (
                      <div key={i} className={`flex space-x-6 border-b border-white/[0.01] pb-2 ${
                        log.message.includes('[CRIT]') ? 'text-rose-900 bg-rose-900/5' : 
                        log.message.includes('[OK]') ? 'text-emerald-900' : 
                        log.message.includes('[BUILD]') ? 'text-purple-900 font-black' : 'text-zinc-700'
                      }`}>
                        <span className="opacity-10 shrink-0 font-black tabular-nums tracking-widest text-[9px]">[{log.timestamp}]</span>
                        <span className="font-bold tracking-tight uppercase">{log.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* BOTTOM NAV - MOBILE */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#020202] border-t border-zinc-900/50 flex items-stretch z-50">
        <MobileNavItem tab="EDITOR" icon={Code2} label="Editor" />
        <MobileNavItem tab="PIPELINE" icon={Layers} label="Export" />
        <MobileNavItem tab="SETTINGS" icon={SettingsIcon} label="Level" />
        <MobileNavItem tab="CONSOLE" icon={Terminal} label="Logs" />
      </nav>

      {/* STATUS FOOTER - DESKTOP */}
      <footer className="hidden md:flex fixed bottom-0 right-0 left-72 bg-[#020202] border-t border-zinc-900/50 px-10 py-3.5 items-center justify-between text-[9px] font-black text-zinc-800 uppercase tracking-[0.3em] z-50">
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <Activity size={14} className="mr-3 text-rose-950" />
            <span>Cycle_{counter.toString().padStart(4, '0')}</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-950 mr-3"></span>
            <span>Kern: Metamorphic_1.3</span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-zinc-900 italic">XF OBFUSCATION</span>
          <span className="text-zinc-950">|</span>
          <span className="text-zinc-900 font-black uppercase tracking-tighter">Secure Assembly Active</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
