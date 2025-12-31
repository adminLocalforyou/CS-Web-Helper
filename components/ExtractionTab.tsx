
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
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = function() {
                const res = String(reader.result);
                const parts = res.split(',');
                if (parts.length > 1) {
                    setImageBase64(parts[1]);
                }
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const runExtraction = useCallback(async function() {
        if (!imageBase64 || !file) { return; }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const extractedData = await extractMenuData(imageBase64, file.type, shopType);
            setResult(extractedData);
            addLog('AI Scan Text', { fileName: file.name, shopType }, 'Success');
        } catch (err: any) {
            setError(err.message || 'Error');
        } finally {
            setIsLoading(false);
        }
    }, [imageBase64, file, shopType, addLog]);

    return (
        <section>
            <h2 className={"text-2xl font-bold mb-4"}>{"AI Scan Text"}</h2>
            <div className={"space-y-4"}>
                <input type={"file"} onChange={handleFileChange} />
                <button onClick={runExtraction} disabled={isLoading} className={"w-full bg-green-600 text-white p-3 rounded"}>
                    {isLoading ? 'Extracting...' : 'Start Extraction'}
                </button>
                {result && <textarea value={result} readOnly className={"w-full h-64 p-2 border"} />}
            </div>
        </section>
    );
}

export default ExtractionTab;
