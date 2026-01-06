
import { GoogleGenAI, Type } from "@google/genai";
import { AuditResultItem, AuditType, MenuCheckResultItem, AnalysisResult, MenuCheckResult, GroundingSource } from '../types';

/**
 * ฟังก์ชันตรวจสอบและสร้าง AI Client
 */
function getAIClient() {
    // ดึงค่าที่ถูกฉีดเข้ามาตอน Build
    let apiKey = process.env.API_KEY;

    // ถ้าค่าที่ได้คือข้อความที่ยังไม่ได้ถูกแทนที่ หรือเป็นค่าว่าง
    if (!apiKey || apiKey === "" || apiKey === "undefined" || apiKey.includes("$API_KEY")) {
        console.error("DEBUG: API Key detection failed. Value is:", apiKey);
        throw new Error("⚠️ ไม่พบ API Key: โปรดตรวจสอบว่าใน Vercel ตั้งชื่อตัวแปรว่า 'API_KEY' (พิมพ์ใหญ่ทั้งหมด) และได้กด Redeploy หลังจากตั้งค่าแล้ว");
    }

    // ล้างเครื่องหมายคำพูดที่อาจหลุดมาจากการ Build script
    const cleanKey = apiKey.replace(/^['"]|['"]$/g, '');

    return new GoogleGenAI({ apiKey: cleanKey });
}

function extractJsonFromString(text: string) {
    try {
        const match = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (match) {
            const potentialJson = match[0];
            JSON.parse(potentialJson);
            return potentialJson;
        }
    } catch (e) {}
    
    let clean = text.trim();
    if (clean.startsWith('```json')) { clean = clean.substring(7); }
    if (clean.startsWith('```')) { clean = clean.substring(3); }
    if (clean.endsWith('```')) { clean = clean.substring(0, clean.length - 3); }
    return clean.trim();
}

export async function analyzeStorePresence(websiteUrl: string, gmbUrl: string, facebookUrl: string) {
    const ai = getAIClient();
    const model = 'gemini-3-pro-preview';
    const response = await ai.models.generateContent({
        model,
        contents: `Analyze these URLs and return JSON with keyFindings, qualitativeAssessment, and emailDraft:
- Website: ${websiteUrl}
- GMB: ${gmbUrl}
- Facebook: ${facebookUrl}`,
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    keyFindings: { type: Type.STRING },
                    qualitativeAssessment: { type: Type.STRING },
                    emailDraft: { type: Type.STRING }
                },
                required: ["keyFindings", "qualitativeAssessment", "emailDraft"]
            }
        }
    });

    return JSON.parse(extractJsonFromString(response.text)) as AnalysisResult;
}

export async function performAudit(auditType: AuditType, auditData: any) {
    const ai = getAIClient();
    const model = 'gemini-3-pro-preview';
    let prompt = `Operations audit for ${auditType}. Data: ${JSON.stringify(auditData)}.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        status: { type: Type.STRING },
                        title: { type: Type.STRING },
                        detail: { type: Type.STRING }
                    },
                    required: ["status", "detail"]
                }
            }
        }
    });

    return JSON.parse(extractJsonFromString(response.text)) as AuditResultItem[];
}

export async function generateRcaSummary(failedItems: AuditResultItem[]) {
    const ai = getAIClient();
    const model = 'gemini-3-pro-preview';
    const prompt = `Perform a Root Cause Analysis (RCA) summary: ${JSON.stringify(failedItems)}.`;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
}

export async function extractMenuData(imageBase64: string, mimeType: string, shopType: 'restaurant' | 'massage' = 'restaurant') {
    const ai = getAIClient();
    const model = 'gemini-3-flash-preview';
    
    let instructions = "";
    if (shopType === 'massage') {
        instructions = `ACT AS A TEXT EXTRACTOR FOR MASSAGE SERVICES.
        
        STRICT FORMAT RULES (MANDATORY):
        1. NO MARKDOWN BOLDING AT ALL. (Do NOT use ** anywhere in the response)
        2. NO PARENTHESES OR BRACKETS AT ALL.
        3. OTHERS SECTION: Put any text that is NOT a service or category under a single "Others" header at the VERY BOTTOM.
        
        Example Output Format:
        Category : Thai Massage
        Service : Traditional Thai
        Traditional Thai - 60mins $70
        
        Others
        Sunshine Spa`;
    } else {
        instructions = `ACT AS A TEXT EXTRACTOR FOR RESTAURANT MENUS.
        
        STRICT FORMAT RULES (MANDATORY):
        1. Item : [Item Name]
        2. Price : [Price]
        3. Description : [Description]
        4. Use "---" as a separator ONLY between menu items.
        5. NO MARKDOWN BOLDING AT ALL.
        6. NO PARENTHESES OR BRACKETS AT ALL.
        7. If no description, use "Description : -"
        8. OTHERS SECTION: Put any text that is NOT a menu item under a single "Others" header at the VERY BOTTOM.
        
        Example Output Format:
        Item : Pad Thai
        Price : $18.50
        Description : -
        ---
        
        Others
        Baan Thai Restaurant`;
    }

    const response = await ai.models.generateContent({ 
        model, 
        contents: { 
            parts: [
                { inlineData: { mimeType, data: imageBase64 } },
                { text: instructions + "\n\nPlease extract all text from this image following the strict formatting rules above." }
            ] 
        } 
    });
    return response.text;
}

export async function crossCheckMenu(webMenuUrl: string, fileBase64: string, mimeType: string): Promise<MenuCheckResult> {
    const ai = getAIClient();
    const model = 'gemini-3-pro-preview';
    
    let targetDomain = "";
    try {
        const urlObj = new URL(webMenuUrl);
        targetDomain = urlObj.hostname.replace('www.', '');
    } catch (e) {}

    const response = await ai.models.generateContent({
        model,
        contents: { 
            parts: [
                { inlineData: { mimeType, data: fileBase64 } },
                { text: `Compare menu in IMAGE with ${webMenuUrl}. Return JSON.` }
            ] 
        },
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        itemName: { type: Type.STRING },
                        status: { type: Type.STRING },
                        mismatchDetails: { type: Type.STRING },
                        webData: { type: Type.OBJECT, properties: { price: { type: Type.STRING } } },
                        fileData: { type: Type.OBJECT, properties: { price: { type: Type.STRING } } }
                    },
                    required: ["itemName", "status", "mismatchDetails"]
                }
            }
        }
    });

    const items = JSON.parse(extractJsonFromString(response.text)) as MenuCheckResultItem[];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
        .filter((c: any) => c.web && (c.web.uri.includes(targetDomain) || c.web.uri === webMenuUrl))
        .map((c: any) => ({ uri: c.web.uri, title: c.web.title }));

    return { items, sources };
}

export async function generateCommunicationScript(path: string) {
    const ai = getAIClient();
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({ model, contents: `Generate a polite Thai support script for: ${path}` });
    return response.text;
}

export async function generateEmailDraft(scenario: string, context: string, tone: string) {
    const ai = getAIClient();
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({ model, contents: `Draft a professional Thai email for "${scenario}" with tone "${tone}". Context: ${context}` });
    return response.text;
}
