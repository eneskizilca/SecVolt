import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  ShieldAlert, Activity, Zap, Lock, LogOut, RefreshCw,
  LayoutDashboard, Network, FileJson, Settings, ShieldCheck,
  Server, AlertTriangle, BatteryCharging, CheckCircle
} from 'lucide-react';

// API Configuration
const API_URL = "http://localhost:8000/api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // App State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [liveData, setLiveData] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [alert, setAlert] = useState(null);

  // Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '1234') {
      setIsAuthenticated(true);
    } else {
      setError('Invalid Credentials');
    }
  };

  // Data Fetching Loop
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/live-data`);
        const data = response.data;

        setCurrentStatus(data);

        // Update Chart Data (Keep last 20 points)
        setLiveData(prev => {
          const newData = [...prev, {
            time: data.timestamp.split('T')[1]?.split('.')[0] || data.timestamp,
            voltage: data.voltage,
            current: data.current,
            power: data.power
          }];
          return newData.slice(-20);
        });

        // Check Anomaly
        if (data.anomaly) {
          setAlert(data.anomaly);
        } else {
          setAlert(null);
        }
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    const interval = setInterval(fetchData, 1000); // 1 sec poll
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Fetch Logs when entering logs tab
  useEffect(() => {
    if (activeTab === 'logs') {
      axios.get(`${API_URL}/logs`)
        .then(res => setLogs(res.data))
        .catch(err => console.error(err));
    }
  }, [activeTab]);

  // --- Attack Handlers ---
  const triggerAttack = async (type) => {
    try {
      await axios.post(`${API_URL}/inject-attack`, { type: type });
      // Force refresh logs
      if (activeTab === 'logs') {
        const res = await axios.get(`${API_URL}/logs`);
        setLogs(res.data);
      }
    } catch (err) {
      console.error("Attack Failed", err);
    }
  };

  const resetSimulation = async () => {
    await axios.post(`${API_URL}/reset`);
    setAlert(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0"></div>
        <div className="glass-panel p-8 rounded-2xl w-full max-w-md z-10 relative border-t border-slate-800 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600/10 p-4 rounded-full mb-4 border border-blue-500/30">
              <img src="/secvolt-logo.png" alt="SecVolt" className="w-16 h-16 object-contain" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">SecVolt</h1>
            <p className="text-slate-400 text-sm font-mono tracking-wider">ENTERPRISE SECURITY GATEWAY</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Identity</label>
              <input
                type="text"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 mt-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-slate-200 transition-all font-mono"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Passkey</label>
              <input
                type="password"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 mt-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-slate-200 transition-all font-mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg shadow-blue-900/20 mt-4 uppercase tracking-widest text-sm"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col z-20 backdrop-blur-xl">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800/50">
          <img src="/secvolt-logo.png" alt="Logo" className="w-8 h-8" />
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white">SecVolt</h1>
            <p className="text-[10px] text-blue-400 font-mono">GUARD V2.1</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Security Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<Network size={20} />} label="SteVe Network Map" active={activeTab === 'network'} onClick={() => setActiveTab('network')} />
          <SidebarItem icon={<FileJson size={20} />} label="Blockchain Audit" active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
          <SidebarItem icon={<Settings size={20} />} label="Simulation Control" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-slate-400 font-mono">SYSTEM: ONLINE</span>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center space-x-2 text-slate-400 hover:text-white w-full px-2 py-2 rounded hover:bg-slate-800 transition-colors">
            <LogOut size={16} />
            <span className="text-sm">Disconnect</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-auto">

        {/* TOP ALERT BANNER */}
        {alert && (
          <div className="bg-red-950/90 border-b border-red-600 text-white px-6 py-3 flex items-center justify-between animate-pulse sticky top-0 z-50">
            <div className="flex items-center space-x-3">
              <ShieldAlert className="w-6 h-6 animate-bounce text-red-500" />
              <span className="font-bold tracking-wider font-mono">INTRUSION DETECTED: {alert}</span>
            </div>
            <button onClick={resetSimulation} className="text-xs bg-white text-red-900 font-bold px-3 py-1 rounded hover:bg-gray-200">
              INITIATE COUNTERMEASURES (RESET)
            </button>
          </div>
        )}

        <div className="p-8 max-w-7xl mx-auto w-full">

          {/* VIEW: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <header className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-1">Live Threat Monitor</h2>
                <p className="text-slate-400 text-sm">Real-time telemetry analysis of EVSE CP-001</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatusCard title="Voltage" value={`${currentStatus?.voltage?.toFixed(1) || '--'} V`} icon={<Activity />} status={alert ? 'danger' : 'normal'} />
                <StatusCard title="Current" value={`${currentStatus?.current?.toFixed(2) || '--'} A`} icon={<Zap />} status={alert === 'OVERCURRENT_DOS' ? 'danger' : 'normal'} />
                <StatusCard title="Power" value={`${currentStatus?.power?.toFixed(2) || '--'} kW`} icon={<BatteryCharging />} status={alert ? 'warning' : 'normal'} />
                <StatusCard title="Status" value={alert ? 'COMPROMISED' : 'SECURE'} icon={<ShieldCheck />} status={alert ? 'critical' : 'success'} />
              </div>

              <div className="glass-panel p-6 rounded-xl border border-slate-800 bg-slate-900/40">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-slate-200 flex items-center"><Activity className="w-5 h-5 mr-2 text-blue-500" /> Signal Analysis</h3>
                  <div className="flex space-x-4 text-xs font-mono">
                    <span className="text-blue-400">● Voltage</span>
                    <span className="text-yellow-400">● Current</span>
                  </div>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={liveData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="time" stroke="#475569" fontSize={12} />
                      <YAxis yAxisId="left" stroke="#475569" fontSize={12} domain={[180, 260]} />
                      <YAxis yAxisId="right" orientation="right" stroke="#475569" fontSize={12} domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b' }} />
                      <Line yAxisId="left" type="monotone" dataKey="voltage" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="current" stroke="#eab308" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: NETWORK MAP (STEVE) */}
          {activeTab === 'network' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <header className="mb-8 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">SteVe CSMS Grid</h2>
                  <p className="text-slate-400 text-sm">Station Status & Network Integrity Map</p>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono bg-slate-900 px-3 py-1 rounded border border-slate-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>OCPP 1.6J CONNECTED</span>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* CP-001: The Simulation */}
                <StationCard
                  id="CP-001"
                  location="Main Gate A"
                  status={alert ? "BLOCKED" : "CHARGING"}
                  power={`${currentStatus?.power?.toFixed(1) || 0} kW`}
                  isAlert={!!alert}
                  alertMsg={alert}
                />
                {/* CP-002: Static Safe */}
                <StationCard id="CP-002" location="Main Gate B" status="CHARGING" power="22.0 kW" />
                {/* CP-003: Static Available */}
                <StationCard id="CP-003" location="Parking L1" status="AVAILABLE" power="0 kW" type="idle" />
                {/* CP-004: Faulted */}
                <StationCard id="CP-004" location="Parking L2" status="FAULTED" power="0 kW" type="fault" />
                {/* CP-005: Generic */}
                <StationCard id="CP-005" location="Staff Lot" status="CHARGING" power="7.4 kW" />
                {/* CP-006: Generic */}
                <StationCard id="CP-006" location="VIP Zone" status="AVAILABLE" power="0 kW" type="idle" />
              </div>
            </div>
          )}

          {/* VIEW: LOGS & BLOCKCHAIN */}
          {activeTab === 'logs' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <header className="mb-8 flex justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Blockchain Audit Trail</h2>
                  <p className="text-slate-400 text-sm">Immutable SHA-256 Ledger</p>
                </div>
                <button onClick={() => window.open(`${API_URL}/export-logs`)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded flex items-center space-x-2 text-sm border border-slate-700">
                  <FileJson size={16} /> <span>Download Chain CSV</span>
                </button>
              </header>

              <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900 uppercase font-mono text-xs">
                      <tr>
                        <th className="px-6 py-4">Index</th>
                        <th className="px-6 py-4">Timestamp</th>
                        <th className="px-6 py-4">Event Type</th>
                        <th className="px-6 py-4">Details</th>
                        <th className="px-6 py-4">Current Hash</th>
                        <th className="px-6 py-4">Prev Hash</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {logs.map((log) => (
                        <tr key={log.index} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-white">#{log.index}</td>
                          <td className="px-6 py-4">{log.timestamp.split('T')[1].split('.')[0]}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${log.event_type.includes('ATTACK') ? 'bg-red-900/30 text-red-400' :
                                log.event_type === 'GENESIS' ? 'bg-blue-900/30 text-blue-400' : 'bg-slate-800 text-slate-300'
                              }`}>
                              {log.event_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-300">{log.details}</td>
                          <td className="px-6 py-4 font-mono text-[10px] text-slate-500 max-w-[100px] truncate" title={log.hash}>{log.hash.substring(0, 16)}...</td>
                          <td className="px-6 py-4 font-mono text-[10px] text-slate-500 max-w-[100px] truncate" title={log.previous_hash}>{log.previous_hash.substring(0, 16)}...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {logs.length === 0 && <div className="p-8 text-center text-slate-500">Wait for blockchain sync...</div>}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SETTINGS / CONTROL */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl">
              <header className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-1">Simulation Control</h2>
                <p className="text-slate-400 text-sm">Manually trigger scenarios for demonstration</p>
              </header>

              <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Attack Injection</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => triggerAttack('dos')} className="p-4 bg-slate-900 border border-red-900/50 hover:bg-red-950/30 hover:border-red-600 rounded-xl transition-all text-left group">
                      <AlertTriangle className="w-8 h-8 text-red-500 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="font-bold text-red-400">DoS Attack</div>
                      <div className="text-xs text-slate-500 mt-1">Inject 120A spike</div>
                    </button>
                    <button onClick={() => triggerAttack('theft')} className="p-4 bg-slate-900 border border-yellow-900/50 hover:bg-yellow-950/30 hover:border-yellow-600 rounded-xl transition-all text-left group">
                      <Zap className="w-8 h-8 text-yellow-500 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="font-bold text-yellow-400">Energy Theft</div>
                      <div className="text-xs text-slate-500 mt-1">Inject 0.1A reading</div>
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <h3 className="text-lg font-semibold text-white mb-4">System recovery</h3>
                  <button onClick={resetSimulation} className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-all">
                    <CheckCircle className="w-5 h-5" /> <span>Normalize Systems</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- Components ---

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

function StatusCard({ title, value, icon, status }) {
  const styles = {
    normal: 'bg-slate-900/50 border-slate-800 text-white',
    danger: 'bg-red-950/40 border-red-800 text-red-400',
    warning: 'bg-yellow-950/40 border-yellow-800 text-yellow-400',
    critical: 'bg-red-900 text-white animate-pulse',
    success: 'bg-green-950/40 border-green-800 text-green-400'
  };
  return (
    <div className={`p-5 rounded-xl border backdrop-blur-sm ${styles[status] || styles.normal}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs uppercase tracking-wider opacity-70">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold font-mono">{value}</div>
    </div>
  )
}

function StationCard({ id, location, status, power, type = "normal", isAlert, alertMsg }) {
  // Style logic based on status
  let statusColor = "text-green-400";
  let statusBg = "bg-green-500";
  let cardBorder = "border-slate-800";

  if (status === "BLOCKED" || isAlert) {
    statusColor = "text-red-400";
    statusBg = "bg-red-500";
    cardBorder = "border-red-600 ring-1 ring-red-600";
  } else if (status === "FAULTED") {
    statusColor = "text-slate-400";
    statusBg = "bg-slate-500";
  } else if (status === "AVAILABLE") {
    statusColor = "text-blue-400";
    statusBg = "bg-blue-500";
  }

  return (
    <div className={`glass-panel p-5 rounded-xl border ${cardBorder} relative overflow-hidden group`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status === 'BLOCKED' ? 'bg-red-900/50' : 'bg-slate-800'}`}>
            <Server className={`w-6 h-6 ${statusColor}`} />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-tight">{id}</h3>
            <p className="text-xs text-slate-500">{location}</p>
          </div>
        </div>
        <div className={`w-2 h-2 rounded-full ${statusBg} ${isAlert ? 'animate-ping' : ''}`}></div>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] text-slate-500 uppercase">Current Power</p>
          <p className="text-xl font-mono text-slate-200">{power}</p>
        </div>
        <div className={`text-xs font-bold px-2 py-1 rounded border ${status === 'BLOCKED' ? 'bg-red-900/20 border-red-800 text-red-500' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
          {status}
        </div>
      </div>

      {isAlert && (
        <div className="absolute inset-0 bg-red-900/80 backdrop-blur-sm flex items-center justify-center text-center p-4 animate-in fade-in cursor-not-allowed">
          <div>
            <ShieldAlert className="w-10 h-10 text-white mx-auto mb-2 animate-bounce" />
            <p className="font-bold text-white text-sm">SECURITY LOCKDOWN</p>
            <p className="text-xs text-red-200 mt-1">{alertMsg}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App;
