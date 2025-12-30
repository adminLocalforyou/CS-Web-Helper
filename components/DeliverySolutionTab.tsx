import React, { useState, useCallback, Fragment } from 'react';
import { TabProps } from '../types';
import { generateCommunicationScript } from '../services/geminiService';
import { deliveryFlow, IHD_ADMIN_LINK } from '../constants';
import LoadingSpinner from './LoadingSpinner';

const DeliverySolutionTab: React.FC<TabProps> = ({ addLog }) => {
    const [path, setPath] = useState<string[]>([]);
    const [aiScript, setAiScript] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const getPathAsTitles = useCallback((currentPath: string[]) => {
        const titles: any[] = [];
        if (currentPath.length === 0) return titles;

        let currentNode: any = deliveryFlow[currentPath[0]];
        if (!currentNode) return currentPath;
        titles.push(currentNode.title);

        for (let i = 1; i < currentPath.length; i++) {
            const key = currentPath[i];
            if (currentNode.options && currentNode.options[key]) {
                currentNode = currentNode.options[key];
                titles.push(currentNode.title);
            } else {
                titles.push(key);
            }
        }
        return titles;
    }, []);

    const resetFlow = () => {
        setPath([]);
        setAiScript(null);
    };

    const stepBack = () => {
        setPath(prev => prev.slice(0, -1));
        setAiScript(null);
    };

    const handleOptionSelect = (option: string) => {
        setPath(prev => [...prev, option]);
        setAiScript(null);
    };

    const handleGenerateScript = useCallback(async () => {
        if (path.length === 0) return;
        setIsGenerating(true);
        setAiScript(null);
        const pathTitles = getPathAsTitles(path);
        // Use a safe separator string for non-JSX logging
        const logPath = pathTitles.map(t => typeof t === 'string' ? t : 'Manual Call').join(' -> ');
        try {
            const script = await generateCommunicationScript(logPath);
            setAiScript(script);
            addLog('Communication Script Generation', { path: logPath }, 'Success');
        } catch (error: any) {
            const errorMessage = 'Error generating script: ' + (error.message || String(error));
            setAiScript(errorMessage);
            addLog('Communication Script Generation', { path: logPath }, `Error: ${errorMessage}`);
        } finally {
            setIsGenerating(false);
        }
    }, [path, getPathAsTitles, addLog]);

    const copyToClipboard = () => {
        if (aiScript) {
            navigator.clipboard.writeText(aiScript);
            alert('Script copied to clipboard!');
        }
    };

    const getCurrentStep = () => {
        if (path.length === 0) return null;
        let current: any = deliveryFlow[path[0]];
        for (let i = 1; i < path.length; i++) {
            if (current && current.options) {
                current = current.options[path[i]];
            } else {
                return null;
            }
        }
        return current;
    };

    const currentStepData = getCurrentStep();
    const pathTitles = getPathAsTitles(path);

    // Explicit boolean variables to avoid comparison symbols in JSX
    const isPathEmpty = path.length === 0;
    const canStepBack = path.length >= 2;

    return (
        <section id="delivery">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">IHD Solution: เครื่องมือแก้ปัญหา</h2>
            <p className="text-gray-600 mb-4">เครื่องมือแก้ปัญหาด่วนเพื่อลดเวลาตัดสินใจและข้อผิดพลาดของทีม CS</p>

            {isPathEmpty ? (
                <div id="delivery-step-1">
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded-r-lg shadow-sm">
                        <p className="text-sm font-bold text-orange-700 mb-1">หมายเหตุ: ก่อนเริ่มดำเนินการด้านล่างทุกครั้ง</p>
                        <p className="text-sm text-orange-900">
                            โปรดตรวจสอบว่าคนขับอยู่สถานะไหนโดยการสอบถามทางร้าน หรือเข้าไปตรวจสอบที่:<br />
                            {IHD_ADMIN_LINK}
                        </p>
                    </div>

                    <h3 className="text-xl font-semibold mb-4 text-gray-800">ขั้นตอนที่ 1: เลือกประเภทปัญหาการจัดส่ง</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(deliveryFlow).map(([key, value]: [string, any]) => {
                            const isManualCall = key === 'manual-call';
                            const btnClass = isManualCall 
                                ? "bg-pink-100 text-pink-800 border-pink-300 hover:bg-pink-200" 
                                : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-indigo-600 hover:text-white";
                                
                            return (
                                <button 
                                    key={key} 
                                    onClick={() => handleOptionSelect(key)} 
                                    className={`${btnClass} py-3 px-4 rounded-lg font-medium border w-full text-left transition-all duration-200 h-full flex flex-col justify-center`}
                                >
                                    {value.title}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div id="delivery-flow-container" className="mt-8 pt-6 border-t">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-600">{deliveryFlow[path[0]]?.title}</h3>
                    <div className="flex flex-col space-y-2 mb-4">
                        <button onClick={resetFlow} className="text-sm text-red-500 hover:text-red-700 font-semibold w-fit p-1 -ml-1">&larr; กลับไปหน้าหลัก</button>
                        {canStepBack && <button onClick={stepBack} className="text-sm text-red-500 hover:text-red-700 font-semibold w-fit p-1 -ml-1">&larr; กลับขั้นตอนก่อนหน้า</button>}
                    </div>
                    <div className="text-sm text-gray-700 mb-4 font-semibold">
                        เส้นทางดำเนินการ: 
                        <span className="text-indigo-700 ml-1">
                            {pathTitles.map((t, i) => {
                                const isFirst = i === 0;
                                return (
                                    <Fragment key={i}>
                                        {!isFirst && <span className="mx-1">&rarr;</span>}
                                        {t}
                                    </Fragment>
                                );
                            })}
                        </span>
                    </div>

                    <div id="dynamic-steps" className="space-y-4">
                        {currentStepData?.content && <div className="mb-4">{currentStepData.content}</div>}
                        
                        {currentStepData?.options && (
                            <>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">เลือกการดำเนินการต่อไป:</h4>
                                <div className="space-y-3">
                                    {Object.entries(currentStepData.options).map(([key, value]: [string, any]) => (
                                        <button key={key} onClick={() => handleOptionSelect(key)} className="bg-indigo-100 text-indigo-700 py-3 px-4 rounded-lg font-medium border border-indigo-300 w-full text-left hover:bg-indigo-200">
                                            {value.title}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    
                    {currentStepData?.isFinal && (
                        <button onClick={handleGenerateScript} disabled={isGenerating} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md w-full disabled:bg-purple-400 flex justify-center items-center">
                            {isGenerating && <LoadingSpinner />}
                            {isGenerating ? 'Generating...' : '✨ สร้างข้อความสื่อสารอัตโนมัติ'}
                        </button>
                    )}

                    {aiScript && (
                        <div className="bg-blue-50 border border-dashed border-blue-300 p-4 mt-4 rounded-lg">
                            <h4 className="font-bold text-blue-800 mb-2">✨ สคริปต์การสื่อสารจาก AI (คัดลอกได้)</h4>
                            <textarea value={aiScript} readOnly rows={5} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-800 text-sm bg-white font-sans"></textarea>
                            <button onClick={copyToClipboard} className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-200">
                                คัดลอกข้อความ
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default DeliverySolutionTab;