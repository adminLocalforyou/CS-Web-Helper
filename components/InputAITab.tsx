
import React, { useState } from 'react';
import { TabProps } from '../types';
import LoadingSpinner from './LoadingSpinner';

type SubView = 'selection' | 'responseio' | 'chatbot';

function InputAITab({ addLog }: TabProps) {
    const [view, setView] = useState<SubView>('selection');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    const handleSend = async () => {
        if (!message.trim()) return;
        
        setIsSending(true);
        setStatus(null);

        // จำลองการส่งข้อมูล (User จะระบุปลายทางภายหลัง)
        try {
            const destination = view === 'responseio' ? 'Response.io' : 'Team Chat Bot';
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            addLog(`Input AI (${destination})`, { message }, 'Success');
            setStatus({ type: 'success', msg: `ส่งข้อมูลไปยัง ${destination} เรียบร้อยแล้ว!` });
            setMessage('');
        } catch (error) {
            setStatus({ type: 'error', msg: 'เกิดข้อผิดพลาดในการส่งข้อมูล' });
        } finally {
            setIsSending(false);
        }
    };

    const renderSelection = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
                onClick={() => setView('responseio')}
                className="group p-8 bg-white border-2 border-slate-100 rounded-3xl hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 text-left flex flex-col items-center justify-center gap-4 text-center"
            >
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                    💬
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">Input to Response.io</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">ส่งข้อมูลหรือคำถามไปยังระบบจัดการแชทลูกค้า</p>
                </div>
                <span className="mt-2 text-indigo-600 font-bold text-sm bg-indigo-50 px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    เลือกหัวข้อนี้ →
                </span>
            </button>

            <button 
                onClick={() => setView('chatbot')}
                className="group p-8 bg-white border-2 border-slate-100 rounded-3xl hover:border-emerald-500 hover:shadow-2xl transition-all duration-300 text-left flex flex-col items-center justify-center gap-4 text-center"
            >
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                    🤖
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">Input to Team Chat Bot</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">ประสานงานกับทีมผ่าน Chat Bot อัจฉริยะ</p>
                </div>
                <span className="mt-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    เลือกหัวข้อนี้ →
                </span>
            </button>
        </div>
    );

    const renderForm = (title: string, color: string) => (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={() => { setView('selection'); setStatus(null); }}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <span className="text-2xl">←</span>
                </button>
                <h3 className={`text-2xl font-black ${color}`}>
                    {title}
                </h3>
            </div>

            <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm">
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                    พิมพ์ข้อมูลหรือคำถามที่คุณต้องการส่ง:
                </label>
                <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="ใส่รายละเอียดที่นี่..."
                    className="w-full min-h-[200px] p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-medium text-slate-700 leading-relaxed"
                />

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {status && (
                        <div className={`text-sm font-bold px-4 py-2 rounded-xl ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {status.type === 'success' ? '✅ ' : '❌ '}{status.msg}
                        </div>
                    )}
                    <button 
                        onClick={handleSend}
                        disabled={isSending || !message.trim()}
                        className={`ml-auto w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:bg-slate-300 ${
                            view === 'responseio' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                    >
                        {isSending ? <LoadingSpinner /> : <span>🚀</span>}
                        {isSending ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูลทันที'}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <section id="input-ai">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">Input AI Tool</h2>
                <p className="text-gray-500 font-medium">ส่งข้อมูลหรือสอบถามปัญหาไปยังช่องทางต่างๆ ของทีม CS</p>
            </div>

            {view === 'selection' && renderSelection()}
            {view === 'responseio' && renderForm('Input to Response.io', 'text-indigo-600')}
            {view === 'chatbot' && renderForm('Input to Team Chat Bot', 'text-emerald-600')}
        </section>
    );
}

export default InputAITab;
