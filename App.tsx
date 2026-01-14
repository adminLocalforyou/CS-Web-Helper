
import React, { useState, useCallback } from 'react';
import { Tab, LogEntry, TabProps } from './types';
import Header from './components/Header';
import AnalysisTab from './components/AnalysisTab';
import DeliverySolutionTab from './components/DeliverySolutionTab';
import AuditSupportTab from './components/AuditSupportTab';
import MenuCheckTab from './components/MenuCheckTab';
import ExtractionTab from './components/ExtractionTab';
import EmailAssistantTab from './components/EmailAssistantTab';
import ScopeOfHandlingTab from './components/ScopeOfHandlingTab';
import ProcedureTab from './components/ProcedureTab';
import LogsTab from './components/LogsTab';

function App() {
    // เปลี่ยนค่าเริ่มต้นเป็น Tab.Scope (Scope of Handling)
    const [activeTab, setActiveTab] = useState(Tab.Scope);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const addLog = useCallback(function(tool: string, input: any, output: string) {
        setLogs(function(prev: any) {
            const newEntry = { timestamp: new Date(), tool, input, output, userId: 'currentUser' };
            return [newEntry, ...prev];
        });
    }, []);

    const renderTabContent = function() {
        if (activeTab === Tab.Analysis) { return <AnalysisTab addLog={addLog} />; }
        if (activeTab === Tab.Delivery) { return <DeliverySolutionTab addLog={addLog} />; }
        if (activeTab === Tab.Audit) { return <AuditSupportTab addLog={addLog} />; }
        if (activeTab === Tab.Menu) { return <MenuCheckTab addLog={addLog} />; }
        if (activeTab === Tab.Extraction) { return <ExtractionTab addLog={addLog} />; }
        if (activeTab === Tab.EmailAssistant) { return <EmailAssistantTab addLog={addLog} />; }
        if (activeTab === Tab.Scope) { return <ScopeOfHandlingTab />; }
        if (activeTab === Tab.Procedure) { return <ProcedureTab />; }
        if (activeTab === Tab.Log) { return <LogsTab logs={logs} />; }
        return null;
    };

    const mainTabs = [
        { id: Tab.Delivery, label: 'IHD Solution', icon: '🚚' },
        { id: Tab.Menu, label: 'Menu Cross-Check', icon: '📋' },
        { id: Tab.Extraction, label: 'AI Scan Text', icon: '🔍' },
        { id: Tab.Analysis, label: 'Analysis', icon: '📈' },
        { id: Tab.Audit, label: 'Audit', icon: '⚖️' },
        { id: Tab.EmailAssistant, label: 'Emails', icon: '✉️' },
        { id: Tab.Log, label: 'Logs', icon: '📜' },
    ];

    return (
        <div className={"p-4 sm:p-8 bg-slate-50 min-h-screen"}>
            <Header />
            <main className={"max-w-7xl mx-auto bg-white rounded-xl shadow-2xl p-4 sm:p-8"}>
                
                {/* --- Tier 1: Resource Center (Top Row) --- */}
                <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveTab(Tab.Scope)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-black text-[12px] tracking-wide transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm active:scale-95 ${
                                activeTab === Tab.Scope 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200 shadow-lg' 
                                : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200 hover:bg-slate-50'
                            }`}
                        >
                            <span className={activeTab === Tab.Scope ? "filter brightness-0 invert" : ""}>🛡️</span>
                            <span>SCOPE OF HANDLING</span>
                        </button>
                        <button
                            onClick={() => setActiveTab(Tab.Procedure)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-black text-[12px] tracking-wide transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm active:scale-95 ${
                                activeTab === Tab.Procedure 
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-200 shadow-lg' 
                                : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-100 hover:bg-slate-50'
                            }`}
                        >
                            <span className={activeTab === Tab.Procedure ? "filter brightness-0 invert" : ""}>📋</span>
                            <span>CS PROCEDURE HUB</span>
                        </button>
                    </div>
                    
                    <div className="text-slate-300 font-black text-[11px] uppercase tracking-[0.2em] hidden md:block">
                        RESOURCE CENTER
                    </div>
                </div>

                {/* Divider Line */}
                <div className="h-px bg-slate-100 w-full mb-6"></div>

                {/* --- Tier 2: Operational Tabs & Performance Button --- */}
                <div className={"flex flex-wrap items-center border-b border-gray-100 mb-8 gap-2"}>
                    <div className={"flex flex-wrap flex-grow"}>
                        {mainTabs.map(function(tab) {
                            const isActive = (activeTab === tab.id);
                            return (
                                <button
                                    key={tab.id}
                                    onClick={function() { setActiveTab(tab.id); }}
                                    className={"flex items-center gap-2 px-5 py-4 text-[13px] font-bold border-b-2 transition duration-150 " + (
                                        isActive 
                                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' 
                                        : 'border-transparent text-slate-500 hover:text-indigo-600 hover:bg-slate-50/50'
                                    )}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    
                    <a 
                        href="https://cs-kpi-management.vercel.app/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-auto mb-2 sm:mb-0 bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-black py-2.5 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95 uppercase tracking-wider"
                    >
                        <span>📊</span>
                        <span>CS Performance</span>
                    </a>
                </div>
                
                <div id={"tab-content"}>
                    {renderTabContent()}
                </div>
            </main>
        </div>
    );
}

export default App;
