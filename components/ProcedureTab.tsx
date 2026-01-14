
import React, { useState, useEffect } from 'react';

interface Procedure {
    id: string;
    title: string;
    color: string;
    steps: string[];
}

const DEFAULT_PROCEDURES: Procedure[] = [
    {
        id: "unsub",
        title: "Unsubscription Request",
        color: "indigo",
        steps: [
            "Ask and investigate for a reason after get a request",
            "Try to solve their problem with our services. If it's about sales, recheck the digital footprints (GMB/FB/Website) or more",
            "If you give them an offer, please follow up their confirmation about receiving the offer",
            "If they insist to unsubscribe, ask again for a unsub confirmation and send the unsubscription form",
            "Label your name with AOM on the unsubscription form email",
            "Send that task to AOM with the reason, unsub form link, and details. Then put the unsubscription reason on CRM's note"
        ]
    },
    {
        id: "arrears",
        title: "Arrears",
        color: "emerald",
        steps: [
            "Check the reason of the arrears in task",
            "Contact and inform the restaurant",
            "Follow up and keep updating the task until the Manager's due date",
            "Once the payment is updated, task AOM back to recharge",
            "If the system was off, after customer updated payment to portal, CS staff and turn system back on immediately, then task AOM to recharge"
        ]
    },
    {
        id: "ownership",
        title: "Ownership Changing",
        color: "sky",
        steps: [
            "Request new owner contact info and settlement date from CURRENT OWNER",
            "Contact the new owner to gather information",
            "Update Payment and all, this includes: Menu, Payment, Services and Opening Hour etc.",
            "Update Username and Profile on SC on the SETTLEMENT DATE only",
            "Live Process > Test Order > Post Flyers > Request Dine-in QR Printing",
            "Update CRM and Task Supervisor after LIVE"
        ]
    },
    {
        id: "booking",
        title: "Booking System",
        color: "rose",
        steps: [
            "Gather the information on the first call with the Booking Sign Up Form",
            "Fill in the website template form that the customer choose",
            "Set up the system after IT notify about the website draft",
            "Final check with the owner. If confirms, task IT to LIVE the website",
            "Go LIVE with the owner and complete the CRM status",
            "Continue with the Post-LIVE process"
        ]
    },
    {
        id: "marketing-bundle",
        title: "Marketing Bundle Sign Up",
        color: "indigo",
        steps: [
            "Send task to BEE / NAN about a new sign up",
            "Building project as usual pro plan's customers",
            "Confirm the LIVE appointment date with customer & inform BEE / NAN a LIVE date",
            "Once LIVE, send SAN / NAN a task to inform the LIVE",
            "Send a task to Supervisor to inform the LIVE from customer support side"
        ]
    },
    {
        id: "sales-app",
        title: "Sales Appointment",
        color: "emerald",
        steps: [
            "Ask for their interests (system, marketing, etc)",
            "Ask their info to make an appointment (name, shop name, address, phone no. are a must)",
            "Make an appointment through bookmark link or https://localforyouweb.youcanbook.me/",
            "If the customer wants to talk now, transfer to sales team (EN 820 / TH 821) - Not hangup customer without geting shop's information",
            "After getting the appointment, submit the coin submission"
        ]
    },
    {
        id: "postlive",
        title: "Post-LIVE",
        color: "slate",
        steps: [
            "Update LIVE Date in CRM",
            "Post flyer on GMB and FB",
            "Change the FB & Website button link",
            "Post Digital Flyers for both GMB & FB",
            "Task supervisor on mentioned 'This restaurant is now LIVE from CS'"
        ]
    },
    {
        id: "materials",
        title: "Materials Order",
        color: "amber",
        steps: [
            "After getting the request, recheck the design with them (flyer)",
            "For magnet, send them the template in Trainual to choose",
            "Send a task to SAI to inform the order and design",
            "Once the order is ready, SAI will send a task back to you regards shipping details",
            "Inform the restaurant that the order is on the way"
        ]
    },
    {
        id: "solo-signup",
        title: "Solo Sign Up",
        color: "sky",
        steps: [
            "Forward the sign-up form to promotion@localforyou.com",
            "Access CRM and update project owner to be Account Manager"
        ]
    },
    {
        id: "ihd-reg",
        title: "Register IHD",
        color: "rose",
        steps: [
            "Go to IHD Register to create a new account",
            "Add a credit card payment on IHD and turn on Auto-dispatch",
            "Set up delivery area and fee on SC",
            "Connect integration to SC",
            "LIVE and do the test order"
        ]
    },
    {
        id: "post-live-ihd",
        title: "POST-LIVE IHD Delivery",
        color: "slate",
        steps: [
            "Go to CRM project > Delivery Section",
            "Complete every field as much as possible",
            "Create a task to TAN to inform the LIVE"
        ]
    },
    {
        id: "purchase-printer",
        title: "Purchase Printer",
        color: "amber",
        steps: [
            "Customer tells you they want to buy a printer with us",
            "Send THIS form to a customer to order",
            "Let the customer pay via email invoice after getting a purchase form",
            "Get a confirmation email after a payment",
            "The AussiePOS will take care of the rest, just let them wait"
        ]
    },
    {
        id: "sms-marketing",
        title: "SMS Marketing",
        color: "violet",
        steps: [
            "Go to transmitsms.com/resellers",
            "Add Client to create an account",
            "Export contact list from SC and add them to Contact List",
            "Connect integration to SC",
            "Add credit card payment and add credit",
            "Set up SMS and send out",
            "Send task to AOM that the SMS Marketing is LIVE"
        ]
    },
    {
        id: "autopilot",
        title: "Auto-pilot / AI Marketing",
        color: "indigo",
        steps: [
            "Set up promotions and enable all the campaign in SC",
            "If no specific request, use default discount 10%-20%",
            "For other promotion request, process accordingly",
            "Send a task to AOM when the Auto-pilot is LIVE"
        ]
    },
    {
        id: "email-host",
        title: "Email hosting",
        color: "emerald",
        steps: [
            "Check price on domain portal",
            "Purchase Email hosting under domain account",
            "Ask customer for credit card to charge on purchase",
            "Create 'Edit Website' card on website board",
            "Inform shop and give them the access",
            "Send webmail access details (User/Pass from IT)"
        ]
    },
    {
        id: "rebrand",
        title: "Rebrand Process",
        color: "sky",
        steps: [
            "Check SC / GMB information and confirmed domain name",
            "Confirm owner's name and payment information",
            "Change project name on CRM",
            "Task AOM for CRM name update (mention old & new name)"
        ]
    },
    {
        id: "inform-ac",
        title: "Task To Inform AC",
        color: "rose",
        steps: [
            "Create a task with (DONE) in the end of the name",
            "Add all of the details in the comment section",
            "Choose the PO name and set the task on their working day",
            "Let the task OPEN"
        ]
    },
    {
        id: "new-domain",
        title: "Purchase New Domain",
        color: "slate",
        steps: [
            "Go to Localforyoudomain and search domain name",
            "Recheck the year duration to buy",
            "Sign up by creating username & password",
            "Fill in business details",
            "Add credit cards details and click Pay & Activate"
        ]
    },
    {
        id: "verify-dream",
        title: "Verify Dreamscape Domain",
        color: "amber",
        steps: [
            "Go to Dreamscape and search domain name",
            "If Pending, ask customer for DL and Credit Card used for purchase",
            "Contact support chat on the right side",
            "Send them ID #24439 and ask to verify domain",
            "Send DL and CC pictures (cover all but last 4 digits)",
            "Once approved, refresh page to see 'Registered' status"
        ]
    },
    {
        id: "renew-domain",
        title: "Renew Domain Name",
        color: "violet",
        steps: [
            "Go to Dreamscape and search domain",
            "Login (will lead to localforyoudomain)",
            "Go to Domains > Renew > Click Renew button",
            "Make payment (same as purchase, may need CVC)",
            "Successful: receive notify email"
        ]
    },
    {
        id: "transfer-in",
        title: "Transfer Domain In",
        color: "indigo",
        steps: [
            "Go to Dreamscape > Transfer Domains",
            "Type domain name to transfer",
            "Ask customer for Auth Code / Registry Key",
            "Insert Auth Code to Domain Password box",
            "Follow usual purchase steps",
            "Domain will be charged based on extension and expiry"
        ]
    },
    {
        id: "change-email",
        title: "Change SC Email",
        color: "emerald",
        steps: [
            "Log in to restaurant's SC in new browser",
            "Click 'My Profile' (top right)",
            "Click 'Change email' and insert new email",
            "Customer needs to verify through old email",
            "Done once new email is verified"
        ]
    },
    {
        id: "advance-promo",
        title: "Purchase Advance Promo",
        color: "sky",
        steps: [
            "Get add-on and promotion details from customer",
            "Create promos > click Buy Advance Promo (SC 1st page)",
            "Activate the promotion",
            "Task AOM to bill customer with monthly subscription"
        ]
    },
    {
        id: "edit-web",
        title: "Edit Website (after live)",
        color: "rose",
        steps: [
            "Access Monday > Website task board",
            "Search shop name",
            "If card exists: add comment for inquiry",
            "If no card: duplicate 'Edit website' template",
            "Update status to 'need fix'"
        ]
    },
    {
        id: "ihd-refund",
        title: "IHD Request Refund",
        color: "slate",
        steps: [
            "Inform restaurant to submit refund themselves on app",
            "If shop insists, continue to process for them",
            "Go to IHD Board on Trello and create a card",
            "Inform restaurant via email once approved by Kevin"
        ]
    },
    {
        id: "force-live",
        title: "Fore live Force ($1)",
        color: "amber",
        steps: [
            "Trigger: uncontactable for 2 weeks or no info for 1 month",
            "Send task 'unable to get info - need force LIVE' to Manager",
            "Manager sends 30-day notice policy to shop",
            "If no contact within 30 days, account is canceled"
        ]
    },
    {
        id: "downgrade",
        title: "Downgrade (Maintain only)",
        color: "violet",
        steps: [
            "Confirm hosting fee with customer (see sheet)",
            "Task Manager for the downgrade"
        ]
    },
    {
        id: "holiday-break",
        title: "Discount for holiday break",
        color: "indigo",
        steps: [
            "Ask shop for duration (must be 1 billing+)",
            "Customer must specify exact start/end time",
            "Offer 50% discount (keep operational) or 100% (shutdown)",
            "Task Manager once agreed; discount applies during break"
        ]
    },
    {
        id: "domain-out",
        title: "Domain transfer out",
        color: "emerald",
        steps: [
            "Inform customer: takes 7-14 days",
            "** DO NOT give domain credentials yet",
            "Task Manager for transfer or credential request"
        ]
    },
    {
        id: "gloria",
        title: "Message from Gloria food",
        color: "sky",
        steps: [
            "Check CRM to confirm if existing customer",
            "Reach out to customer directly to address inquiries"
        ]
    }
];

function ProcedureTab() {
    const [procedures, setProcedures] = useState<Procedure[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isManageMode, setIsManageMode] = useState(false);
    const [viewMode, setViewMode] = useState<'cards' | 'grid'>('cards');

    useEffect(() => {
        // Changed key to v3 to force update from new DEFAULT_PROCEDURES
        const saved = localStorage.getItem('cs_procedures_v3');
        if (saved) {
            setProcedures(JSON.parse(saved));
        } else {
            setProcedures(DEFAULT_PROCEDURES);
        }
    }, []);

    const saveProcedures = (newProcedures: Procedure[]) => {
        setProcedures(newProcedures);
        localStorage.setItem('cs_procedures_v3', JSON.stringify(newProcedures));
    };

    const handleUpdateStep = (id: string, stepIndex: number, value: string) => {
        const updated = procedures.map(p => {
            if (p.id === id) {
                const newSteps = [...p.steps];
                newSteps[stepIndex] = value;
                return { ...p, steps: newSteps };
            }
            return p;
        });
        saveProcedures(updated);
    };

    const handleAddStep = (id: string) => {
        const updated = procedures.map(p => {
            if (p.id === id) {
                return { ...p, steps: [...p.steps, "New procedure step..."] };
            }
            return p;
        });
        saveProcedures(updated);
    };

    const handleDeleteStep = (id: string, stepIndex: number) => {
        const updated = procedures.map(p => {
            if (p.id === id) {
                const newSteps = p.steps.filter((_, i) => i !== stepIndex);
                return { ...p, steps: newSteps };
            }
            return p;
        });
        saveProcedures(updated);
    };

    const handleUpdateTitle = (id: string, newTitle: string) => {
        const updated = procedures.map(p => p.id === id ? { ...p, title: newTitle } : p);
        saveProcedures(updated);
    };

    const filteredProcedures = procedures.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.steps.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getColorClasses = (color: string) => {
        const map: Record<string, { bg: string, text: string, border: string, dot: string }> = {
            indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-600' },
            emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-600' },
            sky: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-600' },
            rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-600' },
            amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-600' },
            violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-600' },
            slate: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-600' }
        };
        return map[color] || map.slate;
    };

    return (
        <section className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        CS Procedure Hub
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        ✨ ขั้นตอนการทำงานมาตรฐานสำหรับทีม CS (ข้อมูลอัปเดตครบถ้วน)
                    </p>
                </div>
                
                <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                    <button 
                        onClick={() => setViewMode('cards')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'cards' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <span>🏙️ Smart Cards</span>
                    </button>
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <span>📊 Table Grid</span>
                    </button>
                    <div className="w-px h-6 bg-slate-200 mx-2"></div>
                    <button 
                        onClick={() => setIsManageMode(!isManageMode)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${isManageMode ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 border border-transparent hover:border-slate-200'}`}
                    >
                        <span>{isManageMode ? '🔓 Manager Mode' : '🔒 Manager Mode'}</span>
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mb-12">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <span className="text-xl">🔍</span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search for any process or step..." 
                        className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-lg shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] focus:shadow-[0_20px_50px_-15px_rgba(79,70,229,0.2)] focus:border-indigo-200 outline-none transition-all placeholder:text-slate-300 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProcedures.map((item) => {
                        const style = getColorClasses(item.color);
                        return (
                            <div key={item.id} className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col hover:shadow-2xl transition-all hover:-translate-y-1">
                                <div className={`p-6 border-b-2 ${style.bg} ${style.border}`}>
                                    {isManageMode ? (
                                        <input 
                                            className="w-full bg-transparent font-black text-xl outline-none focus:border-b border-indigo-300"
                                            value={item.title}
                                            onChange={(e) => handleUpdateTitle(item.id, e.target.value)}
                                        />
                                    ) : (
                                        <h3 className={`text-xl font-black ${style.text} tracking-tight`}>{item.title}</h3>
                                    )}
                                </div>
                                
                                <div className="p-8 flex-1 space-y-6 relative">
                                    <div className="absolute left-[3.1rem] top-12 bottom-12 w-0.5 bg-slate-100"></div>
                                    
                                    {item.steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-4 relative z-10 group/step">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-md group-hover/step:scale-110 transition-transform">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 pt-1.5">
                                                {isManageMode ? (
                                                    <div className="space-y-1">
                                                        <textarea 
                                                            className="w-full p-2 text-sm border border-amber-100 rounded-lg focus:border-amber-400 outline-none bg-amber-50/20"
                                                            value={step}
                                                            onChange={(e) => handleUpdateStep(item.id, idx, e.target.value)}
                                                            rows={2}
                                                        />
                                                        <button 
                                                            onClick={() => handleDeleteStep(item.id, idx)}
                                                            className="text-[9px] font-bold text-red-500 hover:text-red-700 uppercase"
                                                        >
                                                            [ Remove ]
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p className="text-[13px] font-semibold text-slate-600 leading-relaxed">
                                                        {step}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {isManageMode && (
                                        <button 
                                            onClick={() => handleAddStep(item.id)}
                                            className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:bg-slate-50 transition-colors"
                                        >
                                            + Add Step
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-amber-400 text-slate-900 font-black text-xs uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4 text-left border-r border-amber-500/20">STEPS / PROCESS</th>
                                    <th className="px-6 py-4 text-left border-r border-amber-500/20">STEP 1</th>
                                    <th className="px-6 py-4 text-left border-r border-amber-500/20">STEP 2</th>
                                    <th className="px-6 py-4 text-left border-r border-amber-500/20">STEP 3</th>
                                    <th className="px-6 py-4 text-left border-r border-amber-500/20">STEP 4</th>
                                    <th className="px-6 py-4 text-left">STEP 5+</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProcedures.map((item) => {
                                    const style = getColorClasses(item.color);
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className={`px-6 py-8 font-black text-sm border-r border-slate-100 ${style.bg} ${style.text} w-48`}>
                                                {item.title}
                                            </td>
                                            {[0, 1, 2, 3].map(i => (
                                                <td key={i} className="px-6 py-4 text-xs font-medium text-slate-600 border-r border-slate-100 align-top max-w-[200px]">
                                                    {item.steps[i] || "-"}
                                                </td>
                                            ))}
                                            <td className="px-6 py-4 text-xs font-medium text-slate-600 align-top">
                                                {item.steps.slice(4).map((s, i) => (
                                                    <div key={i} className="mb-2 last:mb-0">• {s}</div>
                                                )) || "-"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {filteredProcedures.length === 0 && (
                <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-black text-xl">No matching procedures found.</p>
                    <button onClick={() => setSearchTerm("")} className="mt-4 text-indigo-600 font-bold underline">Clear Search</button>
                </div>
            )}
        </section>
    );
}

export default ProcedureTab;
