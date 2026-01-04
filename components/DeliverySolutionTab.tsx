import React, { useState, useCallback } from 'react';
import { TabProps } from '../types';
import { generateCommunicationScript } from '../services/geminiService';
import { deliveryFlow, IHD_ADMIN_LINK } from '../constants';
import LoadingSpinner from './LoadingSpinner';

function DeliverySolutionTab({ addLog }: TabProps) {
    const [path, setPath] = useState<string[]>([]);
    const [aiScript, setAiScript] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const getPathAsTitles = useCallback(function(currentPath: string[]) {
        const titles: React.ReactNode[] = [];
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

    const resetFlow = function() {
        setPath([]);
        setAiScript(null);
    };

    const stepBack = function() {
        setPath(function(prev) { return prev.slice(0, -1); });
        setAiScript(null);
    };

    const handleOptionSelect = function(option: string) {
        setPath(function(prev) { return [...prev, option]; });
        setAiScript(null);
    };

    const handleGenerateScript = useCallback(async function() {
        if (path.length === 0) return;
        setIsGenerating(true);
        setAiScript(null);
        const pathTitles = getPathAsTitles(path);
        const logPath = pathTitles.map(function(t) { return typeof t === 'string' ? t : 'Action'; }).join(' \u2192 ');
        try {
            const script = await generateCommunicationScript(logPath);
            setAiScript(script);
            addLog('Communication Script Generation', { path: logPath }, 'Success');
        } catch (error: any) {
            const errorMessage = 'Error generating script: ' + (error.message || String(error));
            setAiScript(errorMessage);
            addLog('Communication Script Generation', { path: logPath }, 'Error: ' + errorMessage);
        } finally {
            setIsGenerating(false);
        }
    }, [path, getPathAsTitles, addLog]);

    const copyToClipboard = function() {
        if (aiScript) {
            navigator.clipboard.writeText(aiScript);
            alert('คัดลอกข้อความสำเร็จ!');
        }
    };

    const getCurrentStep = function() {
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

    const isPathEmpty = (path.length === 0);
    const canStepBack = (path.length !== 0 && path.length !== 1);

    return (
        <section id={"delivery"} className={"animate-in fade-in duration-500"}>
            <div className={"flex justify-between items-center mb-6"}>
                <div>
                    <h2 className={"text-2xl font-bold text-gray-800"}>{"IHD Solution: เครื่องมือแก้ปัญหา"}</h2>
                    <p className={"text-sm text-gray-500"}>{"คู่มือตัดสินใจและแก้ปัญหาการจัดส่งอัจฉริยะ"}</p>
                </div>
                {!isPathEmpty && (
                    <button onClick={resetFlow} className={"bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold transition"}>
                        {"เริ่มใหม่"}
                    </button>
                )}
            </div>

            {isPathEmpty ? (
                <div id={"delivery-step-1"}>
                    <div className={"bg-pink-600 text-white p-8 rounded-3xl mb-8 shadow-xl relative overflow-hidden"}>
                        <div className={"relative z-10"}>
                            <p className={"text-pink-100 text-xs font-bold uppercase tracking-wider mb-2 opacity-80"}>{"IHD Dashboard"}</p>
                            <h3 className={"text-2xl font-bold mb-6 max-w-md leading-tight"}>{"เข้า Dashboard เพื่อตรวจสอบสถานะออเดอร์ที่ทางร้านต้องการ"}</h3>
                            <div className={"inline-block"}>
                                {IHD_ADMIN_LINK}
                            </div>
                        </div>
                        <div className={"absolute top-0 right-0 p-4 opacity-10 text-9xl transform translate-x-4 -translate-y-4"}>{"🚚"}</div>
                    </div>

                    <h3 className={"text-lg font-bold mb-4 text-gray-700 flex items-center"}>
                        <span className={"w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3"}>{"1"}</span>
                        {"เลือกประเภทปัญหาที่พบ"}
                    </h3>
                    <div className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
                        {Object.entries(deliveryFlow).map(function([key, value]: [string, any]) {
                            const isCallNewDriver = key === 'call-new-driver';
                            return (
                                <button 
                                    key={key} 
                                    onClick={function() { handleOptionSelect(key); }} 
                                    className={
                                        isCallNewDriver
                                        ? "group bg-pink-50 p-5 rounded-2xl border-2 border-pink-200 hover:border-pink-500 hover:shadow-xl transition-all duration-300 text-left flex items-center justify-between"
                                        : "group bg-white p-5 rounded-2xl border-2 border-gray-100 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 text-left flex items-center justify-between"
                                    }
                                >
                                    <div className="flex flex-col text-left">
                                        <span className={
                                            isCallNewDriver 
                                            ? "font-bold text-pink-700 group-hover:text-pink-800" 
                                            : "font-bold text-gray-800 group-hover:text-indigo-600"
                                        }>
                                            {value.title}
                                        </span>
                                        {value.description && (
                                            <span className={"text-[11px] font-medium mt-1 whitespace-pre-line " + (isCallNewDriver ? "text-pink-600" : "text-gray-500")}>
                                                {value.description}
                                            </span>
                                        )}
                                    </div>
                                    <span className={
                                        isCallNewDriver 
                                        ? "text-pink-300 group-hover:text-pink-500 transition-transform group-hover:translate-x-1" 
                                        : "text-gray-300 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1"
                                    }>
                                        {"→"}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div id={"delivery-flow-container"} className={"space-y-6"}>
                    <div className={"bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"}>
                        <div className={"flex items-center text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4"}>
                            {pathTitles.map(function(t, i) {
                                return (
                                    <React.Fragment key={i}>
                                        {i > 0 && <span className={"mx-2 text-gray-300"}>{"/"}</span>}
                                        <span>{t}</span>
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {currentStepData && currentStepData.content && (
                            <div className={"mb-6 animate-in slide-in-from-bottom-4 duration-300"}>
                                {currentStepData.content}
                            </div>
                        )}
                        
                        {currentStepData && currentStepData.options && (
                            <div className={"space-y-3"}>
                                <h4 className={"text-sm font-bold text-gray-400 mb-2 uppercase"}>{"กรุณาเลือกทางออก:"}</h4>
                                {Object.entries(currentStepData.options).map(function([key, value]: [string, any]) {
                                    if (value.isDivider) {
                                        return (
                                            <div key={key} className={"py-4 flex items-center"}>
                                                <div className={"flex-grow border-t border-gray-100"}></div>
                                                <span className={"px-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em]"}>
                                                    {value.title}
                                                </span>
                                                <div className={"flex-grow border-t border-gray-100"}></div>
                                            </div>
                                        );
                                    }
                                    return (
                                        <button 
                                            key={key} 
                                            onClick={function() { handleOptionSelect(key); }} 
                                            className={"w-full bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white p-4 rounded-xl font-bold text-left transition-all flex justify-between items-center"}
                                        >
                                            {value.title}
                                            <span className={"opacity-50"}>{"→"}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {canStepBack && (
                            <button onClick={stepBack} className={"mt-6 text-gray-400 hover:text-gray-600 text-xs font-bold transition flex items-center"}>
                                <span className={"mr-1"}>{"←"}</span> {"ย้อนกลับ"}
                            </button>
                        )}
                    </div>
                    
                    {currentStepData && currentStepData.isFinal && (
                        <div className={"space-y-4 animate-in zoom-in-95 duration-500"}>
                            <button 
                                onClick={handleGenerateScript} 
                                disabled={isGenerating} 
                                className={"w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition shadow-lg flex justify-center items-center group"}
                            >
                                {isGenerating ? <LoadingSpinner /> : <span className={"mr-2 group-hover:scale-110 transition-transform"}>{"✨"}</span>}
                                {isGenerating ? "กำลังสร้างข้อความ..." : "สร้างสคริปต์ตอบลูกค้าอัตโนมัติ"}
                            </button>

                            {aiScript && (
                                <div className={"bg-white border-2 border-indigo-100 rounded-2xl p-6 shadow-xl"}>
                                    <div className={"flex justify-between items-center mb-3"}>
                                        <h4 className={"font-bold text-gray-800"}>{"สคริปต์จาก AI:"}</h4>
                                        <button onClick={copyToClipboard} className={"text-indigo-600 text-xs font-bold hover:underline"}>{"คัดลอก"}</button>
                                    </div>
                                    <textarea 
                                        value={aiScript} 
                                        readOnly 
                                        rows={5} 
                                        className={"w-full bg-gray-50 border-0 rounded-xl p-4 text-sm text-gray-700 focus:ring-0 font-sans leading-relaxed"}
                                    ></textarea>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

export default DeliverySolutionTab;