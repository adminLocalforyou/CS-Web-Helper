
import React, { useState, useCallback } from 'react';
import { Tab, LogEntry } from './types';
import Header from './components/Header';
import AnalysisTab from './components/AnalysisTab';
import DeliverySolutionTab from './components/DeliverySolutionTab';
import AuditSupportTab from './components/AuditSupportTab';
import MenuCheckTab from './components/MenuCheckTab';
import ExtractionTab from './components/ExtractionTab';
import EmailAssistantTab from './components/EmailAssistantTab';
import LogsTab from './components/LogsTab';

const App: React.FC = () => {
    // Set default active tab to 'IHD Solution' (Tab.Delivery)
    const [activeTab, setActiveTab] = useState<Tab>(Tab.Delivery);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const addLog = useCallback((tool: string, input: any, output: string) => {
        setLogs(prevLogs => [
            { timestamp: new Date(), tool, input, output, userId: 'currentUser' },
            ...prevLogs
        ]);
    }, []);

    const renderTabContent = useCallback(() => {
        switch (activeTab) {
            case Tab.Analysis:
                return <AnalysisTab addLog={addLog} />;
            case Tab.Delivery:
                return <DeliverySolutionTab addLog={addLog} />;
            case Tab.Audit:
                return <AuditSupportTab addLog={addLog} />;
            case Tab.Menu:
                return <MenuCheckTab addLog={addLog} />;
            case Tab.Extraction:
                return <ExtractionTab addLog={addLog} />;
            case Tab.EmailAssistant:
                return <EmailAssistantTab addLog={addLog} />;
            case Tab.Log:
                return <LogsTab logs={logs} />;
            default:
                return null;
        }
    }, [activeTab, addLog, logs]);

    // Updated tab order based on user request
    const tabs = [
        { id: Tab.Delivery, label: 'IHD Solution' },
        { id: Tab.Menu, label: 'Menu Cross-Check' },
        { id: Tab.Extraction, label: 'AI Scan Text' },
        { id: Tab.Analysis, label: 'Store Development Analysis' },
        { id: Tab.Audit, label: 'Audit Support' },
        { id: Tab.EmailAssistant, label: 'AI Email Assistant' },
        { id: Tab.Log, label: 'Summary & Logs' },
    ];

    return (
        <div className="p-4 sm:p-8 bg-slate-50 min-h-screen">
            <Header />
            <main className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl p-4 sm:p-8">
                <div className="flex flex-wrap border-b border-gray-200 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 text-sm font-semibold border-b-2 transition duration-150 ${
                                activeTab === tab.id 
                                ? 'border-indigo-600 text-indigo-600 bg-indigo-50' 
                                : 'border-transparent text-gray-600 hover:text-indigo-600 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div id="tab-content">
                    {renderTabContent()}
                </div>
            </main>
        </div>
    );
};

export default App;
