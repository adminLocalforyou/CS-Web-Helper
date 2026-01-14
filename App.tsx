
import React, { useState, useCallback } from 'react';
import { Tab, LogEntry, TabProps } from './types';
import Header from './components/Header';
import AnalysisTab from './components/AnalysisTab';
import DeliverySolutionTab from './components/DeliverySolutionTab';
import AuditSupportTab from './components/AuditSupportTab';
import MenuCheckTab from './components/MenuCheckTab';
import ExtractionTab from './components/ExtractionTab';
import EmailAssistantTab from './components/EmailAssistantTab';
import LogsTab from './components/LogsTab';

function App() {
    const [activeTab, setActiveTab] = useState(Tab.Delivery);
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
        if (activeTab === Tab.Log) { return <LogsTab logs={logs} />; }
        return null;
    };

    const tabs = [
        { id: Tab.Delivery, label: 'IHD Solution' },
        { id: Tab.Menu, label: 'Menu Cross-Check' },
        { id: Tab.Extraction, label: 'AI Scan Text' },
        { id: Tab.Analysis, label: 'Analysis' },
        { id: Tab.Audit, label: 'Audit' },
        { id: Tab.EmailAssistant, label: 'Emails' },
        { id: Tab.Log, label: 'Logs' },
    ];

    return (
        <div className={"p-4 sm:p-8 bg-slate-50 min-h-screen"}>
            <Header />
            <main className={"max-w-7xl mx-auto bg-white rounded-xl shadow-2xl p-4 sm:p-8"}>
                <div className={"flex flex-wrap items-center border-b border-gray-200 mb-6 gap-2"}>
                    <div className={"flex flex-wrap flex-grow"}>
                        {tabs.map(function(tab) {
                            const isActive = (activeTab === tab.id);
                            return (
                                <button
                                    key={tab.id}
                                    onClick={function() { setActiveTab(tab.id); }}
                                    className={"px-4 py-3 text-sm font-semibold border-b-2 transition duration-150 " + (
                                        isActive 
                                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50' 
                                        : 'border-transparent text-gray-600 hover:text-indigo-600 hover:border-gray-300'
                                    )}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* ปุ่ม CS Performance ฝั่งขวา */}
                    <a 
                        href="https://cs-kpi-management.vercel.app/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-auto mb-2 sm:mb-0 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm font-bold py-2 px-4 rounded-lg shadow-md transition-all flex items-center gap-2 active:scale-95 border border-blue-400"
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
