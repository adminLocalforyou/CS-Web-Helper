
import React, { useState, useEffect } from 'react';

interface LinkItem {
    label: string;
    url: string;
}

interface TemplateItem {
    label: string;
    content: string;
}

interface LinkCategory {
    id: string;
    title: string;
    type: 'link' | 'template';
    items: (LinkItem | TemplateItem)[];
}

const DEFAULT_DATA: LinkCategory[] = [
    {
        id: 'links-1',
        title: '🔥 Important Links',
        type: 'link',
        items: [
            { label: 'Slack Workspace', url: 'https://slack.com' },
            { label: 'CRM Dashboard', url: 'https://google.com' },
            { label: 'IHD Admin', url: 'https://app.inhousedelivery.com' }
        ]
    },
    {
        id: 'templates-1',
        title: '✉️ Common Response Templates',
        type: 'template',
        items: [
            { label: 'Greeting Thai', content: 'สวัสดีครับ/ค่ะ ทีมงาน Customer Support ยินดีให้บริการครับ มีอะไรให้เราช่วยดูแลในวันนี้ไหมครับ?' },
            { label: 'Pending Request', content: 'ขณะนี้ทางเราได้รับเรื่องของท่านเรียบร้อยแล้ว และกำลังอยู่ระหว่างการประสานงานกับทีมที่เกี่ยวข้อง จะรีบแจ้งความคืบหน้าให้ทราบโดยเร็วที่สุดครับ' }
        ]
    }
];

function LinksAndTemplatesTab() {
    const [categories, setCategories] = useState<LinkCategory[]>([]);
    const [isManageMode, setIsManageMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('cs_links_templates_v1');
        if (saved) {
            setCategories(JSON.parse(saved));
        } else {
            setCategories(DEFAULT_DATA);
        }
    }, []);

    const save = (newData: LinkCategory[]) => {
        setCategories(newData);
        localStorage.setItem('cs_links_templates_v1', JSON.stringify(newData));
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('คัดลอกลง Clipboard เรียบร้อย!');
    };

    const addCategory = (type: 'link' | 'template') => {
        const newCat: LinkCategory = {
            id: Date.now().toString(),
            title: `New ${type === 'link' ? 'Links' : 'Templates'} Group`,
            type,
            items: []
        };
        save([...categories, newCat]);
    };

    const addItem = (catId: string) => {
        const newData = categories.map(cat => {
            if (cat.id === catId) {
                const newItem = cat.type === 'link' 
                    ? { label: 'New Link', url: '#' } 
                    : { label: 'New Template', content: 'Type something...' };
                return { ...cat, items: [...cat.items, newItem] };
            }
            return cat;
        });
        save(newData);
    };

    const updateItem = (catId: string, itemIdx: number, field: string, value: string) => {
        const newData = categories.map(cat => {
            if (cat.id === catId) {
                const newItems = [...cat.items];
                (newItems[itemIdx] as any)[field] = value;
                return { ...cat, items: newItems };
            }
            return cat;
        });
        save(newData);
    };

    const removeItem = (catId: string, itemIdx: number) => {
        const newData = categories.map(cat => {
            if (cat.id === catId) {
                return { ...cat, items: cat.items.filter((_, i) => i !== itemIdx) };
            }
            return cat;
        });
        save(newData);
    };

    const updateCatTitle = (catId: string, title: string) => {
        const newData = categories.map(cat => cat.id === catId ? { ...cat, title } : cat);
        save(newData);
    };

    const removeCategory = (catId: string) => {
        if (confirm('ยืนยันการลบหมวดหมู่นี้?')) {
            save(categories.filter(cat => cat.id !== catId));
        }
    };

    const filtered = categories.filter(cat => 
        cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.items.some(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <section id="links-templates" className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">All Links & Templates</h2>
                    <p className="text-gray-500">ศูนย์รวมลิงก์สำคัญและข้อความเทมเพลตสำหรับใช้งานด่วน</p>
                </div>
                
                <div className="flex gap-2">
                    {isManageMode && (
                        <>
                            <button onClick={() => addCategory('link')} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all">+ Add Links Category</button>
                            <button onClick={() => addCategory('template')} className="px-4 py-2 bg-violet-50 text-violet-600 rounded-xl text-xs font-bold hover:bg-violet-100 transition-all">+ Add Templates Category</button>
                        </>
                    )}
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
            </div>

            <div className="mb-8 max-w-md">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
                    <input 
                        type="text" 
                        placeholder="ค้นหาลิงก์หรือเทมเพลต..." 
                        className="block w-full pl-10 pr-3 py-3 border border-gray-100 rounded-2xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filtered.map((cat) => (
                    <div key={cat.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all">
                        <div className={`p-5 flex justify-between items-center ${cat.type === 'link' ? 'bg-indigo-50 border-b border-indigo-100' : 'bg-violet-50 border-b border-violet-100'}`}>
                            {isManageMode ? (
                                <input 
                                    className="bg-white/50 rounded px-2 py-1 font-bold text-slate-800 outline-none focus:bg-white transition-all"
                                    value={cat.title}
                                    onChange={(e) => updateCatTitle(cat.id, e.target.value)}
                                />
                            ) : (
                                <h3 className={`font-black text-sm uppercase tracking-wider ${cat.type === 'link' ? 'text-indigo-600' : 'text-violet-600'}`}>{cat.title}</h3>
                            )}
                            
                            {isManageMode && (
                                <button onClick={() => removeCategory(cat.id)} className="text-red-400 hover:text-red-600 text-xs font-bold">Delete Cat</button>
                            )}
                        </div>

                        <div className="p-6 space-y-4 flex-1">
                            {cat.items.map((item, idx) => (
                                <div key={idx} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 group">
                                    {isManageMode ? (
                                        <div className="space-y-3">
                                            <input 
                                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:border-violet-400"
                                                value={item.label}
                                                onChange={(e) => updateItem(cat.id, idx, 'label', e.target.value)}
                                                placeholder="Label"
                                            />
                                            {cat.type === 'link' ? (
                                                <input 
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] outline-none focus:border-violet-400"
                                                    value={(item as LinkItem).url}
                                                    onChange={(e) => updateItem(cat.id, idx, 'url', e.target.value)}
                                                    placeholder="URL (https://...)"
                                                />
                                            ) : (
                                                <textarea 
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] outline-none focus:border-violet-400"
                                                    value={(item as TemplateItem).content}
                                                    onChange={(e) => updateItem(cat.id, idx, 'content', e.target.value)}
                                                    placeholder="Template Content"
                                                    rows={3}
                                                />
                                            )}
                                            <button onClick={() => removeItem(cat.id, idx)} className="text-[10px] text-red-500 font-bold uppercase tracking-tighter hover:underline">Remove Item</button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-black text-slate-700">{item.label}</span>
                                                <div className="flex gap-2">
                                                    {cat.type === 'link' ? (
                                                        <>
                                                            <a href={(item as LinkItem).url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 transition-all">Open</a>
                                                            <button onClick={() => handleCopy((item as LinkItem).url)} className="px-3 py-1.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-300 transition-all">Copy Link</button>
                                                        </>
                                                    ) : (
                                                        <button onClick={() => handleCopy((item as TemplateItem).content)} className="px-3 py-1.5 bg-violet-600 text-white text-[10px] font-bold rounded-lg hover:bg-violet-700 transition-all">Copy Text</button>
                                                    )}
                                                </div>
                                            </div>
                                            {cat.type === 'template' && (
                                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-white/50 p-3 rounded-xl border border-slate-100">
                                                    {(item as TemplateItem).content}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isManageMode && (
                                <button 
                                    onClick={() => addItem(cat.id)}
                                    className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold hover:bg-slate-50 transition-all"
                                >
                                    + Add Item to {cat.title}
                                </button>
                            )}

                            {cat.items.length === 0 && !isManageMode && (
                                <p className="text-center py-4 text-slate-400 text-xs italic">ไม่มีข้อมูลในหมวดหมู่นี้</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 font-black text-xl">ไม่พบข้อมูลที่ค้นหา</p>
                    <button onClick={() => setSearchTerm('')} className="mt-4 text-violet-600 font-bold underline">ล้างค่าการค้นหา</button>
                </div>
            )}
        </section>
    );
}

export default LinksAndTemplatesTab;
