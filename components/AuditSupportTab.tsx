import React, { useState, useCallback, useEffect } from 'react';
import { TabProps, AuditType, AuditResultItem } from '../types';
import { performAudit, generateRcaSummary } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const AuditResultCard: React.FC<{ item: AuditResultItem }> = ({ item }) => {
    const statusStyles = {
        PASS: 'border-green-500 bg-green-50',
        FAIL: 'border-red-500 bg-red-50',
        WARN: 'border-amber-500 bg-amber-50',
        SUSPICIOUS: 'border-amber-500 bg-amber-50'
    };
    const statusTextStyles = {
        PASS: 'bg-green-500 text-white',
        FAIL: 'bg-red-500 text-white',
        WARN: 'bg-amber-500 text-white',
        SUSPICIOUS: 'bg-amber-500 text-white'
    };
    return (
        <div className={`p-3 rounded-lg shadow-sm border-l-4 ${statusStyles[item.status]}`}>
            <span className={`float-right text-xs font-bold px-2 py-1 rounded-full ${statusTextStyles[item.status]}`}>{item.status}</span>
            <p className="font-bold text-gray-800">{item.title}</p>
            <p className="text-xs text-gray-700 mt-1">{item.detail}</p>
        </div>
    );
};

const AuditSupportTab: React.FC<TabProps> = ({ addLog }) => {
    const [activeAudit, setActiveAudit] = useState<AuditType>(AuditType.PostLive);
    const [inputs, setInputs] = useState({ website: '', gmb: '', facebook: '', otherData: '', bulkData: '' });
    const [fileName, setFileName] = useState('No file selected.');
    const [isLoading, setIsLoading] = useState(false);
    const [isRcaLoading, setIsRcaLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<AuditResultItem[] | null>(null);
    const [rca, setRca] = useState<string | null>(null);

    useEffect(() => {
        setResults(null);
        setError(null);
        setRca(null);
        setInputs({ website: '', gmb: '', facebook: '', otherData: '', bulkData: '' });
    }, [activeAudit]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setInputs(prev => ({ ...prev, bulkData: event.target?.result as string }));
                setFileName(file.name);
            };
            reader.readAsDataURL(file); // Corrected to use the file object directly
        } else {
            setInputs(prev => ({ ...prev, bulkData: '' }));
            setFileName('No file selected.');
        }
    };

    const runAudit = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setResults(null);
        setRca(null);

        let auditData: any;
        if (activeAudit === AuditType.PostLive) auditData = { website: inputs.website, gmb: inputs.gmb, facebook: inputs.facebook, other_data: inputs.otherData };
        else if (activeAudit === AuditType.Cancellation) auditData = { website: inputs.website, gmb: inputs.gmb };
        else if (activeAudit === AuditType.GmbBulk) auditData = inputs.bulkData;
        else return;

        try {
            const auditResults = await performAudit(activeAudit, auditData);
            setResults(auditResults);
            addLog(`${activeAudit} Audit`, auditData, 'Success');
        } catch (err: any) {
            const errorMessage = err.message || 'An unknown error occurred during audit.';
            setError(errorMessage);
            addLog(`${activeAudit} Audit`, auditData, `Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [activeAudit, inputs, addLog]);

    const generateRca = useCallback(async () => {
        if (!results) return;
        const failedItems = results.filter(r => r.status === 'FAIL' || r.status === 'SUSPICIOUS');
        if (failedItems.length === 0) return;

        setIsRcaLoading(true);
        setRca(null);
        try {
            const rcaSummary = await generateRcaSummary(failedItems);
            setRca(rcaSummary);
            addLog('RCA Generation', { failedItems }, 'Success');
        } catch (err: any) {
            const errorMessage = `Error generating RCA: ${err.message || String(err)}`;
            setRca(errorMessage);
            addLog('RCA Generation', { failedItems }, `Error: ${errorMessage}`);
        } finally {
            setIsRcaLoading(false);
        }
    }, [results, addLog]);
    
    const auditTabs = [
        { id: AuditType.PostLive, label: '1. POST LIVE Audit' },
        { id: AuditType.Cancellation, label: '2. Cancellation Audit' },
        { id: AuditType.GmbBulk, label: '3. GMB Link Audit' },
    ]

    return (
        <section id="audit">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Audit Support (AI Assisted)</h2>
            <p className="text-gray-600 mb-6">Tools to assist with monthly quality audits across various operational checks.</p>

            <div className="flex flex-wrap border-b border-gray-200 mb-6">
                 {auditTabs.map(tab => (
                     <button 
                        key={tab.id}
                        onClick={() => setActiveAudit(tab.id)} 
                        className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${
                            activeAudit === tab.id 
                            ? 'border-indigo-600 text-indigo-600 bg-indigo-50' 
                            : 'border-transparent text-gray-600 hover:border-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                 ))}
            </div>

            <div className="p-6 border rounded-lg shadow-md bg-white">
                {activeAudit === AuditType.PostLive && (
                     <>
                        <h3 className="text-xl font-semibold mb-4 text-indigo-600">1. POST LIVE Audit Checklist</h3>
                        <div className="space-y-3">
                            <input type="url" name="website" value={inputs.website} onChange={handleInputChange} placeholder="Website URL" className="block w-full rounded-md border-gray-300 p-2 border"/>
                            <input type="url" name="gmb" value={inputs.gmb} onChange={handleInputChange} placeholder="GMB Link" className="block w-full rounded-md border-gray-300 p-2 border"/>
                            <input type="url" name="facebook" value={inputs.facebook} onChange={handleInputChange} placeholder="Facebook Page URL" className="block w-full rounded-md border-gray-300 p-2 border"/>
                            <textarea name="otherData" value={inputs.otherData} onChange={handleInputChange} rows={3} placeholder="Other Data (e.g., Tax status, Delivery Zone)" className="block w-full rounded-md border-gray-300 p-2 border"></textarea>
                        </div>
                    </>
                )}
                {activeAudit === AuditType.Cancellation && (
                     <>
                        <h3 className="text-xl font-semibold mb-4 text-indigo-600">2. Cancellation Audit Checklist</h3>
                        <div className="space-y-3">
                            <input type="url" name="website" value={inputs.website} onChange={handleInputChange} placeholder="Website URL" className="block w-full rounded-md border-gray-300 p-2 border"/>
                            <input type="url" name="gmb" value={inputs.gmb} onChange={handleInputChange} placeholder="GMB Link" className="block w-full rounded-md border-gray-300 p-2 border"/>
                        </div>
                    </>
                )}
                {activeAudit === AuditType.GmbBulk && (
                    <>
                        <h3 className="text-xl font-semibold mb-4 text-indigo-600">3. GMB Link Audit</h3>
                        <div className="flex items-center space-x-2">
                                <label className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200 w-full flex-grow text-center cursor-pointer">
                                    📤 Upload CSV/Text File
                                <input type="file" onChange={handleFileChange} className="hidden" accept=".csv, .txt"/>
                            </label>
                            <span className="text-xs text-gray-500 truncate">{fileName}</span>
                        </div>
                        <textarea name="bulkData" value={inputs.bulkData} onChange={handleInputChange} rows={4} placeholder="Or paste data here (e.g., Store Name, GMB Link, Correct Website Link...)" className="mt-3 block w-full rounded-md border-gray-300 p-2 border"></textarea>
                    </>
                )}
                <button onClick={runAudit} disabled={isLoading} className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 w-full disabled:bg-indigo-300 flex justify-center items-center">
                    {isLoading && <LoadingSpinner/>}
                    {isLoading ? 'Running Check...' : `Run ${activeAudit.replace('-', ' ')} Check`}
                </button>
            </div>

            {error && <div className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}

            {results && (
                <div className="mt-8 pt-6 border-t">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Audit Result Summary</h3>
                    <div className="space-y-3">
                        {results.length !== 0 ? results.map((item, index) => <AuditResultCard key={index} item={item}/>) : <div className="p-3 rounded-lg bg-green-50 border-green-500 border-l-4">✅ All checks passed.</div>}
                    </div>

                    {activeAudit === AuditType.Cancellation && results.some(r => r.status === 'FAIL' || r.status === 'SUSPICIOUS') && (
                        <div className="mt-4">
                            <button onClick={generateRca} disabled={isRcaLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md disabled:bg-purple-400 flex justify-center items-center">
                                {isRcaLoading && <LoadingSpinner/>}
                                {isRcaLoading ? 'Generating...' : '✨ Generate Root Cause Analysis (RCA) Summary'}
                            </button>
                            {rca && (
                                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                                    <p className="font-bold text-red-700">📌 Root Cause Analysis (RCA) Summary</p>
                                    <p className="text-sm mt-1 text-gray-800 whitespace-pre-wrap">{rca}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default AuditSupportTab;