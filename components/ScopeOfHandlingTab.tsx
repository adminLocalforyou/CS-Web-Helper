
import React, { useState, useEffect } from 'react';

interface ScopeCategory {
    title: string;
    subHeader: string;
    color: string;
    capable: string[];
    notCapable: string[];
}

const DEFAULT_SCOPE: ScopeCategory[] = [
    {
        title: "SHOPPING CART",
        subHeader: "OPENING HOURS",
        color: "bg-orange-400",
        capable: ["Turn on/off via system", "Update on website", "Update on GMB only on request", "Email once system updated"],
        notCapable: ["Auto-update via GMB", "Email twice after the web update"]
    },
    {
        title: "AMELIA",
        subHeader: "SYSTEM",
        color: "bg-sky-400",
        capable: ["Basic set-up according to Building Process", "Basic promotion set-up"],
        notCapable: ["Advance settings beyond our Trainal"]
    },
    {
        title: "STRIPE",
        subHeader: "STRIPE ACCOUNT",
        color: "bg-indigo-400",
        capable: ["Answer Payout question", "Export Report (1st time only)", "Capture missed order within 1-2 hours", "Dispute instruction following Trainal"],
        notCapable: ["Check Payout balance (only give instruction)", "Export the report monthly or often (give instruction)", "Change account details", "Partial refund & Full refund through Stripe (only give instruction)", "Reason of Payout Pause & Restrict Soon", "Full Dispute process"]
    },
    {
        title: "INHOUSE DELIVERY",
        subHeader: "SYSTEM",
        color: "bg-pink-400",
        capable: ["Give instructions", "Help Refund if it's a long time case or Error", "Walk them through the application to solve problems", "Call shop's customer"],
        notCapable: ["Call Doordash or Uber", "Redispatch or Refund", "Check refund status and process on trello", "Check IHD invoice", "Update shop's details", "Process the order setting (Auto dispatch) (prep time)"]
    },
    {
        title: "GOOGLE MY BUSINESS",
        subHeader: "GMB ACCOUNT",
        color: "bg-blue-500",
        capable: ["On request update only", "Digital footprint (sign-up)", "Send report to delete review (not promise the result)"],
        notCapable: ["Auto-update anything", "GMB post"]
    },
    {
        title: "FACEBOOK",
        subHeader: "FACEBOOK PAGE",
        color: "bg-blue-600",
        capable: ["Update opening hours on request only", "Transfer out (7-14 days)"],
        notCapable: ["Status or post update and Create content or caption"]
    },
    {
        title: "WEBSITE & DOMAIN",
        subHeader: "BACKEND SYSTEM",
        color: "bg-green-500",
        capable: ["Anything that SOW can do, can be done for website template too", "Transfer in by both get their domain access to get transfer code or waiting for the transfer code from customer", "Transfer out (7-14 days)", "Buy new domain for existing customer", "Email to customer's web developer if needed"],
        notCapable: ["AC website", "Buy new domain from new sign-up customer if they committed that will buy with sales"]
    },
    {
        title: "SMS MARKETING",
        subHeader: "BACKEND SYSTEM",
        color: "bg-yellow-500",
        capable: ["Set up and send out", "Export customer's data-base"],
        notCapable: ["Create SMS content and caption"]
    },
    {
        title: "EMAIL HOSTING",
        subHeader: "BACKEND SYSTEM",
        color: "bg-orange-500",
        capable: ["Transfer domain in and buy the hosting", "Create default password", "Basic set-up following Trainal"],
        notCapable: ["Restore previous emails", "Complicated technical settings out of trainal", "Email hosting connection set up"]
    },
    {
        title: "OWNERSHIP CHANGING",
        subHeader: "PROCESS",
        color: "bg-rose-500",
        capable: ["Basic set-up for the whole process"],
        notCapable: ["Separate the billing for previous and new owner", "Refund to previous owner if got charged - both owner need to deal this matters (CS need to beware on their billing date)"]
    },
    {
        title: "BILLING",
        subHeader: "SUBSCRIPTION PAYMENT",
        color: "bg-red-800",
        capable: ["Send update payment link", "Follow up arrears"],
        notCapable: ["Pay by invoice", "Update payment details for customer"]
    }
];

function ScopeOfHandlingTab() {
    const [searchTerm, setSearchTerm] = useState("");
    const [scopes, setScopes] = useState<ScopeCategory[]>([]);
    const [isManageMode, setIsManageMode] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('cs_scope_v2');
        if (saved) {
            setScopes(JSON.parse(saved));
        } else {
            setScopes(DEFAULT_SCOPE);
        }
    }, []);

    const saveScopes = (newScopes: ScopeCategory[]) => {
        setScopes(newScopes);
        localStorage.setItem('cs_scope_v2', JSON.stringify(newScopes));
    };

    const handleUpdateField = (index: number, field: keyof ScopeCategory, value: string) => {
        const updated = [...scopes];
        (updated[index] as any)[field] = value;
        saveScopes(updated);
    };

    const handleUpdateListItem = (scopeIndex: number, listField: 'capable' | 'notCapable', itemIndex: number, value: string) => {
        const updated = [...scopes];
        updated[scopeIndex][listField][itemIndex] = value;
        saveScopes(updated);
    };

    const handleAddItem = (scopeIndex: number, listField: 'capable' | 'notCapable') => {
        const updated = [...scopes];
        updated[scopeIndex][listField].push("New item...");
        saveScopes(updated);
    };

    const handleRemoveItem = (scopeIndex: number, listField: 'capable' | 'notCapable', itemIndex: number) => {
        const updated = [...scopes];
        updated[scopeIndex][listField] = updated[scopeIndex][listField].filter((_, i) => i !== itemIndex);
        saveScopes(updated);
    };

    const filteredData = scopes.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.subHeader.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section id="scope" className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Scope of Handling</h2>
                    <p className="text-gray-500">ขอบเขตความรับผิดชอบและขีดความสามารถในการช่วยเหลือลูกค้าของ CS Team</p>
                </div>
                
                <button 
                    onClick={() => setIsManageMode(!isManageMode)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-sm border ${
                        isManageMode 
                        ? 'bg-amber-500 text-white border-amber-600 shadow-amber-100' 
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                    }`}
                >
                    <span>{isManageMode ? '🔓 Manager Mode: On' : '🔒 Manager Mode: Off'}</span>
                </button>
            </div>

            <div className="mb-8 flex max-w-md">
                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
                    <input 
                        type="text" 
                        placeholder="ค้นหาหมวดหมู่ (เช่น Stripe, Billing...)" 
                        className="block w-full pl-10 pr-3 py-3 border border-gray-100 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((item, scopeIdx) => (
                    <div key={scopeIdx} className="flex flex-col bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow group/card">
                        <div className={`min-h-[4rem] flex flex-col justify-center px-5 py-3 ${item.color} relative`}>
                            {isManageMode ? (
                                <div className="space-y-1">
                                    <input 
                                        className="w-full bg-black/10 text-white font-black text-sm tracking-tighter uppercase px-2 py-0.5 rounded outline-none placeholder:text-white/50"
                                        value={item.title}
                                        onChange={(e) => handleUpdateField(scopeIdx, 'title', e.target.value)}
                                        placeholder="Title"
                                    />
                                    <input 
                                        className="w-full bg-black/10 text-white/80 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded outline-none placeholder:text-white/40"
                                        value={item.subHeader}
                                        onChange={(e) => handleUpdateField(scopeIdx, 'subHeader', e.target.value)}
                                        placeholder="Sub-Header"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-white font-black text-sm tracking-tighter uppercase">{item.title}</h3>
                                    <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{item.subHeader}</p>
                                </>
                            )}
                        </div>
                        
                        <div className="flex-1 p-6 space-y-6">
                            {/* Capable List */}
                            <div>
                                <h4 className="text-[11px] font-black text-green-600 uppercase mb-3 tracking-widest flex items-center justify-between">
                                    <span className="flex items-center"><span className="mr-2">✅</span> CAPABLE OF</span>
                                    {isManageMode && (
                                        <button 
                                            onClick={() => handleAddItem(scopeIdx, 'capable')}
                                            className="text-[10px] bg-green-50 px-2 py-0.5 rounded hover:bg-green-100 transition-colors"
                                        >
                                            + Add
                                        </button>
                                    )}
                                </h4>
                                <ul className="space-y-2.5">
                                    {item.capable.map((text, i) => (
                                        <li key={i} className="group/item relative pl-5">
                                            <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                            {isManageMode ? (
                                                <div className="flex gap-2">
                                                    <textarea 
                                                        className="flex-1 text-xs text-gray-700 leading-relaxed bg-slate-50 border border-slate-100 rounded px-2 py-1 outline-none focus:border-green-300 transition-all"
                                                        value={text}
                                                        onChange={(e) => handleUpdateListItem(scopeIdx, 'capable', i, e.target.value)}
                                                        rows={1}
                                                    />
                                                    <button 
                                                        onClick={() => handleRemoveItem(scopeIdx, 'capable', i)}
                                                        className="text-red-300 hover:text-red-500 font-bold px-1"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-700 leading-relaxed font-medium">{text}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Not Capable List */}
                            <div className="pt-5 border-t border-slate-50">
                                <h4 className="text-[11px] font-black text-red-600 uppercase mb-3 tracking-widest flex items-center justify-between">
                                    <span className="flex items-center"><span className="mr-2">❌</span> NOT CAPABLE OF</span>
                                    {isManageMode && (
                                        <button 
                                            onClick={() => handleAddItem(scopeIdx, 'notCapable')}
                                            className="text-[10px] bg-red-50 px-2 py-0.5 rounded hover:bg-red-100 transition-colors"
                                        >
                                            + Add
                                        </button>
                                    )}
                                </h4>
                                <ul className="space-y-2.5">
                                    {item.notCapable.map((text, i) => (
                                        <li key={i} className="group/item relative pl-5">
                                            <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-red-300 rounded-full"></span>
                                            {isManageMode ? (
                                                <div className="flex gap-2">
                                                    <textarea 
                                                        className="flex-1 text-xs text-gray-500 italic leading-relaxed bg-slate-50 border border-slate-100 rounded px-2 py-1 outline-none focus:border-red-200 transition-all"
                                                        value={text}
                                                        onChange={(e) => handleUpdateListItem(scopeIdx, 'notCapable', i, e.target.value)}
                                                        rows={1}
                                                    />
                                                    <button 
                                                        onClick={() => handleRemoveItem(scopeIdx, 'notCapable', i)}
                                                        className="text-red-200 hover:text-red-400 font-bold px-1"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-500 leading-relaxed font-medium italic">{text}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
                
                {filteredData.length === 0 && (
                    <div className="col-span-full py-24 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                        <p className="text-slate-400 font-black text-xl">ไม่พบหมวดหมู่ที่ต้องการค้นหา</p>
                        <button onClick={() => setSearchTerm("")} className="mt-4 text-indigo-600 font-bold underline">ล้างการค้นหา</button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default ScopeOfHandlingTab;
