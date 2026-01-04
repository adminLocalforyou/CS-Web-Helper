import React, { useState, useCallback } from 'react';
import { TabProps, MenuCheckResultItem } from '../types';
import { crossCheckMenu } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface ResultItemCardProps {
    item: MenuCheckResultItem;
    key?: any;
}

function ResultItemCard({ item }: ResultItemCardProps) {
    const statusStyles = {
        PASS: { card: 'border-green-500 bg-green-50', badge: 'bg-green-500', text: '' },
        FAIL: { card: 'border-red-500 bg-red-50', badge: 'bg-red-500', text: 'text-red-700' },
        WARN: { card: 'border-amber-500 bg-amber-50', badge: 'bg-amber-500', text: 'text-amber-700' }
    };
    const styles = (statusStyles as any)[item.status] || statusStyles.FAIL;
    const isPass = item.status === 'PASS';

    return (
        <div className={"p-4 rounded-lg shadow-md border-l-4 " + styles.card}>
            <div className={"flex justify-between items-start"}>
                <h4 className={"text-lg font-bold text-gray-800"}>{item.itemName}</h4>
                <div className={"flex items-center space-x-2"}>
                   {!isPass && <span className="animate-pulse text-red-600 text-xs font-bold">{"⚠️ DISCREPANCY FOUND"}</span>}
                   <span className={"px-3 py-1 text-xs font-bold text-white rounded-full " + styles.badge}>
                        {item.status}
                    </span>
                </div>
            </div>
            {!isPass && (
                <React.Fragment>
                    <div className={"mt-2 p-3 bg-white/50 rounded border border-red-200 shadow-sm " + (styles.text || '')}>
                        <p className="text-xs font-bold text-red-800 mb-1">{"DETAILED DIFFERENCE:"}</p>
                        <p className="text-sm font-bold bg-white p-1 rounded border inline-block border-red-100">{item.mismatchDetails}</p>
                    </div>
                    <div className={"mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-3"}>
                        <div>
                            <p className={"text-xs font-bold text-gray-500 uppercase mb-1"}>{"Website (Live)"}</p>
                            {item.webData ? (
                                <div className={"text-xs text-gray-700 space-y-1 p-2 bg-white rounded border border-gray-100"}>
                                    <p><span className={"font-bold text-red-600"}>{"Price:"}</span> {item.webData.price || 'N/A'}</p>
                                    <p><span className={"font-medium text-gray-500"}>{"Info:"}</span> {item.webData.description || 'N/A'}</p>
                                </div>
                            ) : (
                                <p className={"text-xs text-red-500 italic p-2 bg-red-50 rounded border border-red-100"}>{"Item missing on URL"}</p>
                            )}
                        </div>
                        <div>
                            <p className={"text-xs font-bold text-gray-500 uppercase mb-1"}>{"Document (Scan)"}</p>
                            {item.fileData ? (
                                <div className={"text-xs text-gray-700 space-y-1 p-2 bg-white rounded border border-gray-100"}>
                                    <p><span className={"font-bold text-indigo-600"}>{"Price:"}</span> {item.fileData.price || 'N/A'}</p>
                                    <p><span className={"font-medium text-gray-500"}>{"Info:"}</span> {item.fileData.description || 'N/A'}</p>
                                </div>
                            ) : (
                                <p className={"text-xs text-gray-500 italic p-2 bg-gray-50 rounded border border-gray-200"}>{"Missing in file"}</p>
                            )}
                        </div>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
}

function MenuCheckTab({ addLog }: TabProps) {
    const [webMenuUrl, setWebMenuUrl] = useState('');
    const [file, setFile] = useState(null);
    const [fileBase64, setFileBase64] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);

    const handleFileChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile) {
            setFile(selectedFile as any);
            const reader = new FileReader();
            reader.onloadend = function() {
                const res = String(reader.result);
                const parts = res.split(',');
                if (parts.length > 1) {
                    setFileBase64(parts[1] as any);
                }
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFile(null);
            setFileBase64(null);
        }
    };

    const runCrossCheck = useCallback(async function() {
        if (!webMenuUrl || !fileBase64 || !file) {
            setError('Please provide a URL and upload a menu file.' as any);
            return;
        }
        setIsLoading(true);
        setError(null);
        setResults(null);
        try {
            const castFile = file as any;
            const checkResult = await crossCheckMenu(webMenuUrl, fileBase64, castFile.type);
            setResults(checkResult as any);
            addLog('Menu Cross-Check', { webMenuUrl, fileName: castFile.name }, 'Success');
        } catch (err: any) {
            setError(err.message as any);
            addLog('Menu Cross-Check', { webMenuUrl, fileName: (file as any).name }, "Error: " + err.message);
        } finally {
            setIsLoading(false);
        }
    }, [webMenuUrl, fileBase64, file, addLog]);

    const getFileIcon = () => {
        if (!file) return "📄";
        const type = (file as any).type;
        if (type.startsWith('image/')) return "🖼️";
        if (type === 'application/pdf') return "📕";
        return "📄";
    };

    const totalItems = results ? (results as any).length : 0;
    const failItems = results ? (results as any).filter((r: any) => r.status === 'FAIL' || r.status === 'WARN').length : 0;

    return (
        <section id={"menu"}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className={"text-2xl font-bold text-gray-800"}>{"Menu Forensic Audit (Strict Mode 3.2)"}</h2>
                    <p className={"text-gray-600 mt-1"}>{"AI is instructed to verify every single item character-by-character."}</p>
                </div>
            </div>

            <div className={"bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6 rounded-r-xl shadow-sm"}>
                <p className={"text-sm text-indigo-800 font-semibold"}>{"🛡️ Strict Comparison Protocol Active:"}</p>
                <ul className="text-xs text-indigo-700 mt-2 list-disc list-inside space-y-1 font-medium">
                    <li>{"Sequential Check: Document is scanned from start to finish without skipping."}</li>
                    <li>{"Zero Tolerance: Even a $0.50 or 1-character difference is flagged as FAIL."}</li>
                    <li>{"Deep Extraction: AI transcribes all items first before looking at the web."}</li>
                </ul>
            </div>

            <div className={"space-y-4 mb-6"}>
                <div>
                    <label htmlFor={"web-menu-url"} className={"block text-sm font-medium text-gray-700"}>{"Website Menu Link"}</label>
                    <input type={"url"} id={"web-menu-url"} value={webMenuUrl} onChange={function(e) { setWebMenuUrl(e.target.value); }} placeholder={"Paste URL here..."} className={"mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-indigo-500 focus:border-indigo-500"} />
                </div>
                <div>
                    <label className={"block text-sm font-medium text-gray-700"}>{"Menu Document (Will be scanned in full)"}</label>
                    <div className={"flex items-center space-x-2 mt-1"}>
                        <label className={"bg-white hover:bg-indigo-50 text-indigo-600 font-semibold py-4 px-4 rounded-xl transition duration-200 flex-grow text-center cursor-pointer border-2 border-indigo-200 border-dashed"}>
                            <span className="mr-2">{getFileIcon()}</span>
                            {"Upload Menu for Full Audit"}
                            <input type={"file"} onChange={handleFileChange} className={"hidden"} accept={"image/*,application/pdf"} />
                        </label>
                        <div className={"text-xs text-gray-500 max-w-[150px] truncate bg-gray-100 p-2 rounded"}>{(file as any)?.name || 'No file selected.'}</div>
                    </div>
                </div>
            </div>

            <button onClick={runCrossCheck} disabled={isLoading || !webMenuUrl || !file} className={"w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-xl transition duration-200 shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center"}>
                {isLoading && <LoadingSpinner />}
                {isLoading ? 'AI is scanning all items in the document... This may take a minute' : 'Start Exhaustive Audit'}
            </button>

            {error && (
                <div className={"mt-4 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200 shadow-sm"}>
                    <p className="font-bold">{"⚠️ Audit Error"}</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            )}

            {isLoading && (
                <div className={"mt-8 border-t pt-6 text-center animate-pulse"}>
                    <p className={"text-indigo-600 font-bold"}>{"Performing Item-by-Item Forensic Analysis..."}</p>
                    <p className={"text-gray-500 text-xs mt-2"}>{"Transcribing document data and verifying each price against live web source."}</p>
                </div>
            )}

            {results && (
                <div className={"mt-8 border-t pt-6"}>
                    <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                        <h3 className={"text-xl font-semibold text-gray-800"}>{"Full Audit Log"}</h3>
                        <div className="flex space-x-2">
                            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                {totalItems} {"Items Detected"}
                            </span>
                            <span className={`${failItems > 0 ? 'bg-red-500' : 'bg-green-500'} text-white px-3 py-1 rounded-full text-xs font-bold shadow-md`}>
                                {failItems} {"Discrepancies"}
                            </span>
                        </div>
                    </div>

                    <div className={"space-y-4"}>
                        {(results as any).length === 0 ? (
                            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center font-medium shadow-sm">
                                {"✅ All detected items match the website."}
                            </div>
                        ) : (results as any).map(function(item: any, index: number) {
                            return <ResultItemCard key={index} item={item} />;
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}

export default MenuCheckTab;
