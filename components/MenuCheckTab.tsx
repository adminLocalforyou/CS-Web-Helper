
import React, { useState, useCallback } from 'react';
import { TabProps, MenuCheckResultItem, GroundingSource } from '../types';
import { crossCheckMenu } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface ResultItemCardProps {
    item: MenuCheckResultItem;
    key?: React.Key;
}

function ResultItemCard({ item }: ResultItemCardProps) {
    const statusStyles = {
        PASS: { card: 'border-green-500 bg-green-50', badge: 'bg-green-500', text: 'text-green-800' },
        FAIL: { card: 'border-red-600 bg-red-50', badge: 'bg-red-600', text: 'text-red-800' },
        WARN: { card: 'border-amber-500 bg-amber-50', badge: 'bg-amber-500', text: 'text-amber-800' }
    };
    const styles = (statusStyles as any)[item.status] || statusStyles.FAIL;
    const isPass = item.status === 'PASS';

    return (
        <div className={"p-4 rounded-xl shadow-sm border-l-8 transition-all mb-4 " + styles.card}>
            <div className={"flex justify-between items-start"}>
                <h4 className={"text-lg font-bold text-gray-900"}>{item.itemName}</h4>
                <div className={"flex items-center space-x-2"}>
                   {!isPass && <span className="animate-pulse text-red-600 text-[10px] font-black uppercase">{"⚠️ DISCREPANCY"}</span>}
                   <span className={"px-3 py-1 text-[10px] font-black text-white rounded-full uppercase " + styles.badge}>
                        {item.status}
                    </span>
                </div>
            </div>

            <div className={"mt-3 p-3 bg-white/60 rounded-lg border border-gray-100"}>
                <p className={"text-[10px] font-bold text-gray-400 uppercase mb-1"}>{"Reasoning (Data from URL)"}</p>
                <p className={"text-sm font-semibold " + styles.text}>{item.mismatchDetails}</p>
            </div>

            <div className={"mt-3 grid grid-cols-2 gap-3"}>
                <div className={"p-2 bg-white rounded border border-gray-100"}>
                    <p className={"text-[9px] font-bold text-gray-400 uppercase"}>{"Live Web Price"}</p>
                    <p className={"text-xs font-bold text-red-600"}>{item.webData?.price ? `$${item.webData.price}` : "NOT FOUND"}</p>
                </div>
                <div className={"p-2 bg-white rounded border border-gray-100"}>
                    <p className={"text-[9px] font-bold text-gray-400 uppercase"}>{"Image Price"}</p>
                    <p className={"text-xs font-bold text-indigo-600"}>{item.fileData?.price ? `$${item.fileData.price}` : "NOT FOUND"}</p>
                </div>
            </div>
        </div>
    );
}

function MenuCheckTab({ addLog }: TabProps) {
    const [webMenuUrl, setWebMenuUrl] = useState('');
    const [file, setFile] = useState(null);
    const [fileBase64, setFileBase64] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<MenuCheckResultItem[] | null>(null);
    const [sources, setSources] = useState<GroundingSource[] | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile) {
            setFile(selectedFile as any);
            const reader = new FileReader();
            reader.onloadend = () => {
                const res = String(reader.result);
                const parts = res.split(',');
                if (parts.length > 1) { setFileBase64(parts[1] as any); }
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const runCrossCheck = useCallback(async () => {
        if (!webMenuUrl || !fileBase64) {
            setError('โปรดระบุ URL ของหน้าเว็บและอัปโหลดรูปภาพเมนู');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResults(null);
        setSources(null);
        try {
            const checkResult = await crossCheckMenu(webMenuUrl, fileBase64, (file as any).type);
            setResults(checkResult.items);
            setSources(checkResult.sources);
            addLog('Menu Forensic Audit', { webMenuUrl }, 'Success');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [webMenuUrl, fileBase64, file, addLog]);

    return (
        <section id={"menu"}>
            <div className="mb-4">
                <h2 className={"text-2xl font-bold text-gray-800"}>{"Forensic Menu Audit 6.0"}</h2>
                <p className={"text-gray-600 mt-1"}>{"เปรียบเทียบรูปภาพเมนูกับข้อมูลบนเว็บไซต์แบบ Real-time"}</p>
            </div>

            <div className={"bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6 rounded-r-xl shadow-sm"}>
                <p className={"text-sm text-indigo-800 font-bold"}>{"🛡️ Strict Audit Protocol:"}</p>
                <p className={"text-xs text-indigo-700 mt-1 leading-relaxed"}>
                    {"1. AI จะดึงข้อมูลจาก URL ที่กำหนดเท่านั้น "}<br/>
                    {"2. ระบบจะรายงานค่าเป็น 'NOT FOUND' หากหาข้อมูลไม่เจอ โดยไม่มีการสุ่มตัวเลขเอง"}<br/>
                    {"3. "} <span className="font-bold underline">{"จำกัด 20-30 รายการต่อครั้ง"}</span> {" เพื่อความแม่นยำสูงสุด"}
                </p>
            </div>

            <div className={"space-y-4 mb-6"}>
                <div>
                    <label className={"block text-sm font-bold text-gray-700 mb-1"}>{"1. Live Menu URL (Link หน้าเมนูจริง)"}</label>
                    <input 
                        type={"url"} 
                        value={webMenuUrl} 
                        onChange={e => setWebMenuUrl(e.target.value)} 
                        placeholder={"เช่น https://www.restaurant.com.au/menu"} 
                        className={"mt-1 block w-full rounded-xl border-gray-300 shadow-sm p-3 border focus:ring-indigo-500"} 
                    />
                </div>
                <div>
                    <label className={"block text-sm font-bold text-gray-700 mb-1"}>{"2. Menu Photo (อัปโหลดรูปภาพเมนูเพื่อเปรียบเทียบ)"}</label>
                    <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-center">
                        <input type={"file"} onChange={handleFileChange} className={"text-sm text-gray-500 w-full cursor-pointer"} accept={"image/*"} />
                    </div>
                </div>
            </div>

            <button 
                onClick={runCrossCheck} 
                disabled={isLoading || !webMenuUrl || !file} 
                className={"w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg disabled:bg-gray-300 flex justify-center items-center transition-all active:scale-95"}
            >
                {isLoading && <LoadingSpinner />}
                {isLoading ? 'กำลังวิเคราะห์ข้อมูลจาก URL (ห้ามกุข้อมูล)...' : 'Start Forensic Audit'}
            </button>

            {error && (
                <div className={"mt-4 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200"}>
                    <p className="font-bold">{"⚠️ Audit Error"}</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            )}

            {results && (
                <div className={"mt-8 border-t pt-6"}>
                    <h3 className={"text-xl font-semibold text-gray-800 mb-4"}>{"Forensic Results (ผลการตรวจสอบ)"}</h3>
                    <div className={"space-y-0"}>
                        {results.length === 0 ? (
                            <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center">{"✅ ข้อมูลตรงกัน 100% (อ้างอิงจาก URL ที่ระบุ)"}</div>
                        ) : results.map((item, idx) => (
                            <ResultItemCard key={idx} item={item} />
                        ))}
                    </div>

                    {sources && sources.length > 0 && (
                        <div className="mt-8 p-4 bg-gray-50 rounded-xl border">
                            <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">{"Data Evidence Sources:"}</h4>
                            <ul className="space-y-1">
                                {sources.map((s, i) => (
                                    <li key={i}><a href={s.uri} target="_blank" className="text-xs text-indigo-600 font-bold underline break-all">{"🔗 "}{s.title || s.uri}</a></li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

export default MenuCheckTab;
