
import { GoogleGenAI, Type } from "@google/genai";
import { AuditResultItem, AuditType, MenuCheckResultItem, AnalysisResult, MenuCheckResult, GroundingSource } from '../types';

function getAIInstance() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API key is missing.");
    }
    return new GoogleGenAI({ apiKey });
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
    const ai = getAIInstance();
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
        model,
        contents: `Analyze these URLs and return JSON with keyFindings, qualitativeAssessment, and emailDraft:
- Website: ${websiteUrl}
- GMB: ${gmbUrl}
- Facebook: ${facebookUrl}`,
        config: {
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
    const ai = getAIInstance();
    const model = 'gemini-3-flash-preview';
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
    const ai = getAIInstance();
    const model = 'gemini-3-flash-preview';
    const prompt = `Perform a Root Cause Analysis (RCA) summary for the following audit failures: ${JSON.stringify(failedItems)}.`;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
}

export async function extractMenuData(imageBase64: string, mimeType: string, shopType: 'restaurant' | 'massage' = 'restaurant') {
    const ai = getAIInstance();
    const model = 'gemini-3-flash-preview';
    let instructions = `Format each item as: [Item Name] Price : [Price] Description [Description] ---`;
    const imagePart = { inlineData: { mimeType, data: imageBase64 } };
    const textPart = { text: instructions + "\n\nExtract all data from the image." };
    const response = await ai.models.generateContent({ model, contents: { parts: [imagePart, textPart] } });
    return response.text;
}

export async function crossCheckMenu(webMenuUrl: string, fileBase64: string, mimeType: string): Promise<MenuCheckResult> {
    const ai = getAIInstance();
    const model = 'gemini-3-flash-preview';
    
    let targetDomain = "";
    try {
        const urlObj = new URL(webMenuUrl);
        targetDomain = urlObj.hostname.replace('www.', '');
    } catch (e) {}

    const filePart = { inlineData: { mimeType, data: fileBase64 } };
    
    const systemPrompt = `ACT AS A HIGH-PRECISION FORENSIC AUDITOR.
    OBJECTIVE: Compare the items in the UPLOADED IMAGE with the LIVE menu at ${webMenuUrl}.

    STRICT RULES (CRITICAL):
    1. SOURCE LIMITATION: Use ONLY data found at ${webMenuUrl}. 
    2. ZERO HALLUCINATION: NEVER make up, guess, or assume a price. If an item or price is not explicitly visible at ${webMenuUrl}, set webData.price to null and report "Item not found on website".
    3. PRICE COMPARISON: Compare numerical values exactly. If image is 15 and web is 15, status is PASS. If image is 15 and web is 16, status is FAIL.
    4. NO EXTERNAL KNOWLEDGE: Do not use your internal knowledge of general restaurant prices. Only use what is on the screen/link.

    Output a JSON array of items from the IMAGE and their comparison with the WEBSITE.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: { parts: [filePart, { text: systemPrompt }] },
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
                            webData: {
                                type: Type.OBJECT,
                                properties: { price: { type: Type.STRING } }
                            },
                            fileData: {
                                type: Type.OBJECT,
                                properties: { price: { type: Type.STRING } }
                            }
                        },
                        required: ["itemName", "status", "mismatchDetails"]
                    }
                }
            }
        });

        const items = JSON.parse(extractJsonFromString(response.text)) as MenuCheckResultItem[];
        
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources: GroundingSource[] = chunks
            .filter((c: any) => c.web && (c.web.uri.includes(targetDomain) || c.web.uri === webMenuUrl))
            .map((c: any) => ({
                uri: c.web.uri,
                title: c.web.title
            }));

        if (sources.length === 0 && items.length > 0) {
            sources.push({ uri: webMenuUrl, title: "Official Audit Source" });
        }

        return { items, sources };
    } catch (err: any) {
        const errorMsg = err.toString();
        
        if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
            throw new Error("⚠️ โควตาการเรียกใช้งานชั่วคราวเต็ม (Rate Limit): มีการเรียกใช้ AI และการค้นหาพร้อมกันมากเกินไปในระยะเวลาสั้นๆ โปรดรอประมาณ 1 นาทีแล้วกด 'Start' ใหม่อีกครั้ง หรือสลับไปใช้เมนู 'AI Scan Text' แทนเพื่อความรวดเร็ว");
        }
        
        if (errorMsg.includes("403")) {
            throw new Error("⚠️ การเข้าถึงถูกปฏิเสธ (403): เว็บไซต์ปลายทางบล็อกการดึงข้อมูลอัตโนมัติ โปรดใช้การคัดลอกข้อความวางใน 'AI Scan Text' แทน");
        }
        
        throw err;
    }
}

export async function generateCommunicationScript(path: string) {
    const ai = getAIInstance();
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({ model, contents: `Generate a polite Thai support script for: ${path}` });
    return response.text;
}

export async function generateEmailDraft(scenario: string, context: string, tone: string) {
    const ai = getAIInstance();
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({ model, contents: `Draft a professional Thai email for "${scenario}" tone "${tone}". Context: ${context}` });
    return response.text;
}
