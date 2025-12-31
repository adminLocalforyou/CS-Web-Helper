import React, { useState, useCallback } from 'react';
import { TabProps, MenuCheckResultItem } from '../types';
import { crossCheckMenu } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const ResultItemCard: React.FC<{ item: MenuCheckResultItem }> = function({ item }) {
    const statusStyles = {
        PASS: { card: 'border-green-500 bg-green-50', badge: 'bg-green-500' },
        FAIL: { card: 'border-red-500 bg-red-50', badge: 'bg-red-500', text: 'text-red-700' },
        WARN: { card: 'border-amber-500 bg-amber-50', badge: 'bg-amber-500', text: 'text-amber-700' }
    };
    const styles = statusStyles[item.status] || statusStyles.FAIL;
    const isPass = item.status === 'PASS';

    return (
        <div className={"p-4 rounded-lg shadow-md border-l-4 " + styles.card}>
            <div className="flex justify-between items-start">
                <h4 className="text-lg font-bold text-gray-800">{item.itemName}</h4>
                <span className={"px-3 py-1 text-xs font-bold text-white rounded-full " + styles.badge}>
                    {item.status}
                </span>
            </div>
            {!isPass && (
                <React.Fragment>
                    <p className={"mt-2 text-sm font-semibold " + (styles.text || '')}>{item.mismatchDetails}</p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">{"Website Data"}</p>
                            {item.webData ? (
                                <div className="text-xs text-gray-700 space-y-1">
                                    <p><span className="font-medium">{"Price:"}</span> {item.webData.price || 'N/A'}</p>
                                    <p><span className="font-medium">{"Description:"}</span> {item.webData.description || 'N/A'}</p>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500 italic">{"Item not found on website."}</p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">{"Image Data"}</p>
                            {item.imageData ? (
                                <div className="text-xs text-gray-700 space-y-1">
                                    <p><span className="font-medium">{"Price:"}</span> {item.imageData.price || 'N/A'}</p>
                                    <p><span className="font-medium">{"Description:"}</span> {item.imageData.description || 'N/A'}</p>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500 italic">{"Item not found in image."}</p>
                            )}
                        </div>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};

const MenuCheckTab: React.FC<TabProps> = function({ addLog }) {
    const [webMenuUrl, setWebMenuUrl] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<MenuCheckResultItem[] | null>(null);

    const handleFileChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = function() {
                const base64String = (reader.result as string)?.split(',')[1];
                setImageBase64(base64String);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFile(null);
            setImageBase64(null);
            alert('Please select a valid image file (.jpg, .png)');
        }
    };

    const runCrossCheck = useCallback(async function() {
        if (!webMenuUrl || !imageBase64 || !file) {
            setError('Please provide a URL and upload a menu image.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResults(null);
        try {
            const checkResult = await crossCheckMenu(webMenuUrl, imageBase64, file.type);
            setResults(checkResult);
            addLog('Menu Cross-Check', { webMenuUrl, fileName: file.name }, 'Success');
        } catch (err: any) {
            const errorMessage = err.message || 'An unknown error occurred.';
            setError(errorMessage);
            addLog('Menu Cross-Check', { webMenuUrl, fileName: file.name }, "Error: " + errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [webMenuUrl, imageBase64, file, addLog]);

    return (
        <section id="menu">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{"Menu Cross-Check"}</h2>
            <p className="text-gray-600 mb-6">{"AI tool to cross-reference menu data between the website link and a given image file data to check for human errors (Description, Pricing)."}</p>

            <div className="space-y-4 mb-6">
                <div>
                    <label htmlFor="web-menu-url" className="block text-sm font-medium text-gray-700">{"Website Menu Link"}</label>
                    <input type="url" id="web-menu-url" value={webMenuUrl} onChange={function(e) { setWebMenuUrl(e.target.value); }} placeholder="e.g., https://www.store.com/menu" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{"Upload Menu Image File for Cross-Check"}</label>
                    <div className="flex items-center space-x-2 mt-1">
                        <label className="bg-indigo-200 hover:bg-indigo-300 text-indigo-800 font-semibold py-2 px-4 rounded-lg transition duration-200 flex-grow text-center cursor-pointer">
                            {"\uD83D\uDDBC\uFE0F Select Menu Image (.jpg, .png)"}
                            <input type="file" onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg" />
                        </label>
                        <span className="text-xs text-gray-500 truncate">{file?.name || 'No file selected.'}</span>
                    </div>
                </div>
            </div>

            <button onClick={runCrossCheck} disabled={isLoading || !webMenuUrl || !file} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed flex justify-center items-center">
                {isLoading && <LoadingSpinner />}
                {isLoading ? 'Checking...' : 'Start Menu Cross-Check'}
            </button>

            {error && <div className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}

            {isLoading && (
                <div className="mt-8 border-t pt-6 text-center">
                    <svg className="animate-spin mx-auto h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="mt-2 text-gray-600">{"AI is analyzing the menu and website..."}</p>
                </div>
            )}

            {results && (
                <div className="mt-8 border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">{"AI Cross-Check Report"}</h3>
                    <div className="space-y-4">
                        {results.map(function(item, index) {
                            return <ResultItemCard key={index} item={item} />;
                        })}
                    </div>
                </div>
            )}
        </section>
    );
};

export default MenuCheckTab;