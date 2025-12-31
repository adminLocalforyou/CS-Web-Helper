import React, { useState, useCallback } from 'react';
import { TabProps } from '../types';
import { extractMenuData } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

function ExtractionTab({ addLog }: TabProps) {
    const [file, setFile] = useState<File | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [shopType, setShopType] = useState<'restaurant' | 'massage'>('restaurant');

    const handleFileChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = function() {
                const base64String = (reader.result as string) ? (reader.result as string).split(',')[1] : null;
                setImageBase64(base64String);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFile(null);
            setImageBase64(null);
            alert('Please select a valid image file (.jpg, .png)');
        }
    };

    const runExtraction = useCallback(async function() {
        if (!imageBase64 || !file) {
            setError('Please upload an image to start extraction.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const extractedData = await extractMenuData(imageBase64, file.type, shopType);
            setResult(extractedData);
            addLog('AI Scan Text', { fileName: file.name, shopType }, 'Success');
        } catch (err: any) {
            const errorMessage = err.message || 'An unknown error occurred.';
            setError(errorMessage);
            addLog('AI Scan Text', { fileName: file.name, shopType }, "Error: " + errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [imageBase64, file, shopType, addLog]);

    const copyToClipboard = function() {
        if (result) {
            navigator.clipboard.writeText(result);
            alert('Extracted data copied to clipboard!');
        }
    };

    const setRestaurant = function() { setShopType('restaurant'); };
    const setMassage = function() { setShopType('massage'); };

    return (
        <section id={"extraction"}>
            <h2 className={"text-2xl font-bold text-gray-800 mb-4"}>{"AI Scan Text"}</h2>
            <p className={"text-gray-600 mb-6"}>{"AI tool to scan and extract structured data (Menu Items or Services) from a local image file for quick entry."}</p>

            <div className={"mb-6"}>
                <label className={"block text-sm font-medium text-gray-700 mb-2"}>{"Select Shop Type"}</label>
                <div className={"flex space-x-2"}>
                    <button 
                        onClick={setRestaurant}
                        className={"flex-1 py-3 px-4 rounded-lg font-bold border transition " + (shopType === 'restaurant' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')}
                    >
                        {"\uD83C\uDF74 Restaurant Menu"}
                    </button>
                    <button 
                        onClick={setMassage}
                        className={"flex-1 py-3 px-4 rounded-lg font-bold border transition " + (shopType === 'massage' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')}
                    >
                        {"\uD83D\uDC86\u200D\u2642\uFE0F Massage Shop"}
                    </button>
                </div>
            </div>

            <div className={"space-y-4 mb-6"}>
                <div>
                    <label className={"block text-sm font-medium text-gray-700"}>{"Upload Image File"}</label>
                    <div className={"flex items-center space-x-2 mt-1"}>
                        <label className={"bg-indigo-200 hover:bg-indigo-300 text-indigo-800 font-semibold py-2 px-4 rounded-lg transition duration-200 flex-grow text-center cursor-pointer"}>
                            {"\uD83D\uDDBC\uFE0F Select Image (.jpg, .png)"}
                            <input type={"file"} onChange={handleFileChange} className={"hidden"} accept={"image/png, image/jpeg"} />
                        </label>
                        <span className={"text-xs text-gray-500 truncate"}>{file ? file.name : 'No file selected.'}</span>
                    </div>
                </div>
            </div>

            <button onClick={runExtraction} disabled={isLoading || !file} className={"w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md disabled:bg-green-400 disabled:cursor-not-allowed flex justify-center items-center"}>
                {isLoading && <LoadingSpinner />}
                {isLoading ? 'Extracting...' : "Start AI " + (shopType === 'restaurant' ? 'Menu' : 'Service') + " Extraction"}
            </button>

            {error && <div className={"mt-4 text-center text-red-600 bg-red-100 p-3 rounded-md"}>{error}</div>}

            {(isLoading || result) && (
                <div className={"mt-8 border-t pt-6"}>
                    <h3 className={"text-xl font-semibold mb-4 text-gray-800"}>{"Structured Data Output (Ready to Copy)"}</h3>
                    <div className={"bg-green-50 border-l-4 border-green-500 p-4 rounded-lg"}>
                        <p className={"font-bold mb-2 text-green-800"}>{"\u2705 Structured " + (shopType === 'restaurant' ? 'Menu' : 'Service') + " Data:"}</p>
                        <textarea value={isLoading ? 'AI is scanning the image and structuring data...' : result || ''} readOnly rows={15} className={"mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-800 text-sm bg-white font-sans"}></textarea>
                        {!isLoading && result && (
                            <button onClick={copyToClipboard} className={"mt-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-200"}>
                                {"Copy Extracted Data"}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

export default ExtractionTab;