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
                if (parts.length > 1) {
                    setImageBase64(parts[1] as any);
                }
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const runExtraction = useCallback(async function() {
        if (!imageBase64 || !file) { 
            setError('โปรดเลือกรูปภาพก่อนดำเนินการ' as any);
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
            setError((err.message || 'เกิดข้อผิดพลาดในการแสกนรูปภาพ') as any);
        } finally {
            setIsLoading(false);
        }
    }, [imageBase64, file, shopType, addLog]);

    return (
        <section id={"extraction"}>
            <h2 className={"text-2xl font-bold text-gray-800 mb-4"}>{"AI Scan Text"}</h2>
            <p className={"text-gray-600 mb-6"}>{"เครื่องมือช่วยดึงข้อมูลจากรูปภาพ (เมนูอาหาร หรือ รายการบริการ) ออกมาเป็นข้อความที่จัดระเบียบแล้ว"}</p>

            <div className={"mb-6"}>
                <label className={"block text-sm font-medium text-gray-700 mb-3"}>{"เลือกประเภทของร้าน"}</label>
                <div className={"flex space-x-3"}>
                    <button 
                        onClick={function() { setShopType('restaurant'); }}
                        className={"flex-1 py-4 px-4 rounded-xl font-bold border-2 transition-all duration-200 " + (shopType === 'restaurant' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300')}
                    >
                        {"\uD83C\uDF74 ร้านอาหาร (Menu)"}
                    </button>
                    <button 
                        onClick={function() { setShopType('massage'); }}
                        className={"flex-1 py-4 px-4 rounded-xl font-bold border-2 transition-all duration-200 " + (shopType === 'massage' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300')}
                    >
                        {"\uD83D\uDC86 ร้านนวด (Massage)"}
                    </button>
                </div>
            </div>

            <div className={"space-y-4 mb-6"}>
                <div className={"p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center"}>
                    <input 
                        type={"file"} 
                        onChange={handleFileChange} 
                        accept={"image/*"}
                        id={"file-upload"}
                        className={"hidden"}
                    />
                    <label htmlFor={"file-upload"} className={"cursor-pointer"}>
                        <div className={"text-4xl mb-2"}>{"\uD83D\uDCE4"}</div>
                        <p className={"text-indigo-600 font-semibold"}>{"คลิกเพื่อเลือกรูปภาพเมนู"}</p>
                        <p className={"text-xs text-gray-500 mt-1"}>{"(รองรับ .jpg, .png, .jpeg)"}</p>
                        {file && <p className={"mt-2 text-sm font-bold text-green-600"}>{"เลือกไฟล์แล้ว: "}{(file as any).name}</p>}
                    </label>
                </div>
                
                <button 
                    onClick={runExtraction} 
                    disabled={isLoading || !file} 
                    className={"w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-xl transition duration-200 shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center"}
                >
                    {isLoading && <LoadingSpinner />}
                    {isLoading ? 'กำลังวิเคราะห์ข้อมูล...' : 'เริ่มแสกนด้วย AI'}
                </button>
            </div>

            {error && <div className={"mt-4 text-center text-red-600 bg-red-100 p-4 rounded-xl border border-red-200"}>{error}</div>}

            {result && (
                <div className={"mt-8 border-t pt-6"}>
                    <div className={"flex justify-between items-center mb-4"}>
                        <h3 className={"text-xl font-semibold text-gray-800"}>{"ผลลัพธ์การแสกน"}</h3>
                        <button 
                            onClick={function() { navigator.clipboard.writeText(result); alert('คัดลอกแล้ว!'); }} 
                            className={"bg-indigo-100 text-indigo-700 text-sm font-bold py-2 px-4 rounded-lg hover:bg-indigo-200 transition"}
                        >
                            {"คัดลอกข้อความ"}
                        </button>
                    </div>
                    <div className={"bg-white border border-gray-200 p-4 rounded-xl shadow-inner"}>
                        <textarea 
                            value={result} 
                            readOnly 
                            rows={12} 
                            className={"block w-full border-0 focus:ring-0 text-gray-800 text-sm bg-transparent font-sans leading-relaxed"}
                        ></textarea>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ExtractionTab;