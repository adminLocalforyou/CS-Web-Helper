
import React, { useState, useCallback } from 'react';
import { TabProps } from '../types';
import { generateEmailDraft } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const EmailAssistantTab: React.FC<TabProps> = ({ addLog }) => {
    const [scenario, setScenario] = useState('Responding to a technical issue');
    const [tone, setTone] = useState('Friendly & Empathetic');
    const [context, setContext] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [draft, setDraft] = useState<string | null>(null);

    const scenarios = [
        'Responding to a technical issue',
        'Following up on a customer complaint',
        'Informing a store about a new feature',
        'De-escalating an angry customer/store',
        'Requesting missing information from a store',
        'Explaining a payment discrepancy',
    ];

    const tones = [
        'Friendly & Empathetic',
        'Formal & Professional',
        'Direct & Concise',
    ];

    const handleGenerate = useCallback(async () => {
        if (!context.trim()) {
            setError('Please provide some key information and context.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setDraft(null);

        try {
            const result = await generateEmailDraft(scenario, context, tone);
            setDraft(result);
            addLog('AI Email Assistant', { scenario, context, tone }, 'Success');
        } catch (err: any) {
            const errorMessage = err.message || 'An unknown error occurred while generating the email.';
            setError(errorMessage);
            addLog('AI Email Assistant', { scenario, context, tone }, `Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [scenario, context, tone, addLog]);

    const copyToClipboard = () => {
        if (draft) {
            navigator.clipboard.writeText(draft);
            alert('Email draft copied to clipboard!');
        }
    };

    return (
        <section id="email-assistant">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Email Assistant</h2>
            <p className="text-gray-600 mb-6">Quickly draft professional emails for common support scenarios. Provide the context, choose a scenario and tone, and let AI do the writing.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="scenario" className="block text-sm font-medium text-gray-700">Email Scenario</label>
                    <select id="scenario" value={scenario} onChange={(e) => setScenario(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500">
                        {scenarios.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="tone" className="block text-sm font-medium text-gray-700">Tone of Voice</label>
                    <select id="tone" value={tone} onChange={(e) => setTone(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500">
                        {tones.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            <div className="mb-6">
                <label htmlFor="context" className="block text-sm font-medium text-gray-700">Key Information & Context</label>
                <textarea 
                    id="context" 
                    value={context} 
                    onChange={(e) => setContext(e.target.value)} 
                    rows={5}
                    placeholder="Provide bullet points or a brief description. e.g.,&#10;- Store: 'Baan Thai Restaurant'&#10;- Issue: Cannot log in to their order-taking app since yesterday.&#10;- Action: We have reset their password. Inform them of the new temporary password: 'NewPass123'"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500 font-sans" 
                />
            </div>

            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center">
                {isLoading && <LoadingSpinner />}
                {isLoading ? 'Generating...' : '✨ Generate Email Draft'}
            </button>

            {error && <div className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}

            {draft && (
                 <div className="mt-8 border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Generated Email Draft</h3>
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
                        <textarea 
                            value={draft} 
                            readOnly 
                            rows={15} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-800 text-sm bg-white font-sans whitespace-pre-wrap"
                        ></textarea>
                        <button onClick={copyToClipboard} className="mt-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-200">
                            Copy Email
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default EmailAssistantTab;
