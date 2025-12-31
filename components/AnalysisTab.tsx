import React, { useState, useCallback } from 'react';
import { TabProps, AnalysisResult } from '../types';
import { analyzeStorePresence } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

function AnalysisTab({ addLog }: TabProps) {
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [gmbUrl, setGmbUrl] = useState('');
    const [facebookUrl, setFacebookUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<AnalysisResult | null>(null);

    const handleAnalysis = useCallback(async function() {
        if (!websiteUrl || !gmbUrl || !facebookUrl) {
            setError('Please fill in all URL fields to start the analysis.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResults(null);
        try {
            const analysisResults = await analyzeStorePresence(websiteUrl, gmbUrl, facebookUrl);
            setResults(analysisResults);
            addLog('Store Dev Analysis', { websiteUrl, gmbUrl, facebookUrl }, 'Success');
        } catch (err: any) {
            const errorMessage = err.message || 'An unknown error occurred during analysis.';
            setError(errorMessage);
            addLog('Store Dev Analysis', { websiteUrl, gmbUrl, facebookUrl }, "Error: " + errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [websiteUrl, gmbUrl, facebookUrl, addLog]);

    const copyToClipboard = function(text: string) {
        navigator.clipboard.writeText(text);
        alert('Email draft copied to clipboard!');
    };

    const renderQualitativeAssessment = function(assessment: string) {
        const parts = assessment.split('---TH---');
        const englishPart = parts[0] ? parts[0].trim() : '';
        const thaiPart = parts[1] ? parts[1].trim() : '';

        return (
            <div>
                {englishPart !== '' && (
                    <div>
                        <p className={"text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1"}>{"English"}</p>
                        <pre className={"whitespace-pre-wrap text-sm font-sans bg-transparent p-0"}>{englishPart}</pre>
                    </div>
                )}
                {thaiPart !== '' && (
                    <div className={"mt-4 border-t border-blue-200 pt-3"}>
                        <p className={"text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1"}>{"Thai Translation"}</p>
                        <pre className={"whitespace-pre-wrap text-sm font-sans bg-transparent p-0"}>{thaiPart}</pre>
                    </div>
                )}
            </div>
        );
    };

    return (
        <section id={"analysis"}>
            <h2 className={"text-2xl font-bold text-gray-800 mb-4"}>{"Store Development Analysis (AI Driven)"}</h2>
            <p className={"text-gray-600 mb-6"}>{"Analyze a store's online presence (Website, GMB, Facebook) and perform automated web checks for delivery, marketing, and recurring customer feedback."}</p>

            <div className={"space-y-4 mb-6"}>
                <div>
                    <label htmlFor={"website-url"} className={"block text-sm font-medium text-gray-700"}>{"Store Website URL"}</label>
                    <input type={"url"} id={"website-url"} value={websiteUrl} onChange={function(e) { setWebsiteUrl(e.target.value); }} placeholder={"e.g., https://www.restaurant-name.com"} className={"mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"} />
                </div>
                <div>
                    <label htmlFor={"gmb-url"} className={"block text-sm font-medium text-gray-700"}>{"Google My Business URL"}</label>
                    <input type={"url"} id={"gmb-url"} value={gmbUrl} onChange={function(e) { setGmbUrl(e.target.value); }} placeholder={"e.g., https://g.page/restaurant-gmb-link (AI will check reviews from here)"} className={"mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"} />
                </div>
                <div>
                    <label htmlFor={"facebook-url"} className={"block text-sm font-medium text-gray-700"}>{"Facebook Page URL"}</label>
                    <input type={"url"} id={"facebook-url"} value={facebookUrl} onChange={function(e) { setFacebookUrl(e.target.value); }} placeholder={"e.g., https://www.facebook.com/restaurant-page (AI will check marketing activity)"} className={"mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"} />
                </div>
            </div>

            <button
                onClick={handleAnalysis}
                disabled={isLoading}
                className={"w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"}>
                {isLoading && <LoadingSpinner />}
                {isLoading ? 'Analyzing...' : 'Start Analysis'}
            </button>

            {error && <div className={"mt-4 text-center text-red-600 bg-red-100 p-3 rounded-md"}>{error}</div>}

            {results && (
                <div className={"mt-8 border-t pt-6"}>
                    <h3 className={"text-xl font-semibold mb-4 text-gray-800"}>{"AI Analysis Results"}</h3>
                    <div className={"bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg"}>
                        <p className={"font-bold mb-2"}>{"\uD83D\uDEA8 Key Findings & Missing Data:"}</p>
                        <pre className={"whitespace-pre-wrap text-sm font-sans"}>{results.keyFindings}</pre>
                    </div>
                    <div className={"bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-lg"}>
                        <p className={"font-bold mb-2"}>{"\uD83D\uDCC8 Qualitative Assessment (AI Sentiment Analysis):"}</p>
                        {renderQualitativeAssessment(results.qualitativeAssessment)}
                    </div>
                    <div className={"bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg"}>
                        <p className={"font-bold mb-2"}>{"\uD83D\uDCE7 Action Email Draft Generator:"}</p>
                        <textarea id={"email-draft-output"} rows={10} value={results.emailDraft} readOnly className={"mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-800 text-sm bg-white font-sans"}></textarea>
                        <button onClick={function() { copyToClipboard(results.emailDraft); }} className={"mt-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-200"}>
                            {"Copy Email Draft"}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AnalysisTab;