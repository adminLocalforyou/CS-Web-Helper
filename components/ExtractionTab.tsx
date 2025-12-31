import React, { useState, useCallback } from 'react';
import { TabProps } from '../types';
import { extractMenuData } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

function ExtractionTab({ addLog }: TabProps) {
    const [file, setFile] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [shopType, setShopType] = useState('restaurant');

    const handleFileChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile) {
            setFile(selectedFile as any);
            const reader = new FileReader();
            reader.onloadend = function() {
                const res = String(reader.result);
                const parts = res.split(',');
                if (parts.length !== 1) {
                    setImageBase64(parts[1] as any);
                }
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const runExtraction = useCallback(async function() {
        if (!imageBase64 || !file) { 
            setError('Please select an image first.' as any);
            return; 
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const castFile = file as any;
            const extractedData = await extractMenuData(imageBase64, castFile.type, shopType as any);
            setResult(extractedData as any);
            addLog('AI Scan Text', { fileName: castFile.name, shopType }, 'Success');
        } catch (err: any) {
            setError((err.message || 'Error scanning image') as any);
        } finally {
            setIsLoading(false);
        }
    }, [imageBase64, file, shopType, addLog]);

    const setRestaurant = function() { setShopType('restaurant'); };
    const setMassage = function() { setShopType('massage'); };

    return (
        <section id={"extraction"}>
            <h2 className={"text-2xl font-bold text-gray-800 mb-4"}>{"AI Scan Text"}</h2>
            <p className={"text-gray-600 mb-6"}>{"AI tool to scan and extract structured data (Menu Items or Services) from a local image file."}</p>

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
                        {"\uD83D\uDC86 Massage Shop"}
                    </button>
                </div>
            </div>

            <div className={"space-y-4 mb-6"}>
                <div>
                    <label className={"block text-sm font-medium text-gray-700"}>{"Upload Image File"}</label>
                    <input 
                        type={"file"} 
                        onChange={handleFileChange} 
                        accept={"image/*"}
                        className={"mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"}
                    />
                </div>
                
                <button 
                    onClick={runExtraction} 
                    disabled={isLoading || !file} 
                    className={"w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md disabled:bg-green-400 disabled:cursor-not-allowed flex justify-center items-center"}
                >
                    {isLoading && <LoadingSpinner />}
                    {isLoading ? 'Extracting...' : 'Start AI Extraction'}
                </button>
            </div>

            {error && <div className={"mt-4 text-center text-red-600 bg-red-100 p-3 rounded-md"}>{error}</div>}

            {result && (
                <div className={"mt-8 border-t pt-6"}>
                    <h3 className={"text-xl font-semibold mb-4 text-gray-800"}>{"Extracted Data Result"}</h3>
                    <div className={"bg-green-50 border-l-4 border-green-500 p-4 rounded-lg"}>
                        <textarea 
                            value={result} 
                            readOnly 
                            rows={15} 
                            className={"mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-800 text-sm bg-white font-sans"}
                        ></textarea>
                        <button 
                            onClick={function() { navigator.clipboard.writeText(result); alert('Copied!'); }} 
                            className={"mt-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-200"}
                        >
                            {"Copy Extracted Data"}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ExtractionTab;