
import React, { useState } from 'react';

interface ScopeCategory {
    title: string;
    subHeader: string;
    color: string;
    capable: string[];
    notCapable: string[];
}

const scopeData: ScopeCategory[] = [
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

    const filteredData = scopeData.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.subHeader.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section id="scope" className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Scope of Handling</h2>
                <p className="text-gray-500">ขอบเขตความรับผิดชอบและขีดความสามารถในการช่วยเหลือลูกค้าของ CS Team</p>
                
                <div className="mt-6 flex max-w-md">
                    <div className="relative w-full">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
                        <input 
                            type="text" 
                            placeholder="ค้นหาหมวดหมู่ (เช่น Stripe, Billing...)" 
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((item, index) => (
                    <div key={index} className="flex flex-col bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                        <div className={`h-12 flex flex-col justify-center px-4 ${item.color}`}>
                            <h3 className="text-white font-black text-sm tracking-tighter uppercase">{item.title}</h3>
                            <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{item.subHeader}</p>
                        </div>
                        
                        <div className="flex-1 p-5 space-y-4">
                            <div>
                                <h4 className="text-[11px] font-black text-green-600 uppercase mb-2 tracking-widest flex items-center">
                                    <span className="mr-2">✅</span> CAPABLE OF
                                </h4>
                                <ul className="space-y-2">
                                    {item.capable.map((text, i) => (
                                        <li key={i} className="text-xs text-gray-700 leading-relaxed pl-4 relative">
                                            <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-gray-50">
                                <h4 className="text-[11px] font-black text-red-600 uppercase mb-2 tracking-widest flex items-center">
                                    <span className="mr-2">❌</span> NOT CAPABLE OF
                                </h4>
                                <ul className="space-y-2">
                                    {item.notCapable.map((text, i) => (
                                        <li key={i} className="text-xs text-gray-500 leading-relaxed pl-4 relative italic">
                                            <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-red-300 rounded-full"></span>
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
                
                {filteredData.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold">ไม่พบหมวดหมู่ที่ต้องการค้นหา</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default ScopeOfHandlingTab;
