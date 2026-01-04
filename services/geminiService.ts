
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
    
    // คำสั่งที่เข้มงวดที่สุดเพื่อป้องกันการเดาราคา (Anti-Hallucination)
    const systemPrompt = `ACT AS A FORENSIC AUDITOR. 
    Compare the provided MENU IMAGE with the data from this SPECIFIC URL: ${webMenuUrl}

    STRICT RULES (RULES OF TRUTH):
    1. NEVER INVENT OR GUESS PRICES. If a price is not clearly stated on the website at ${webMenuUrl}, return null for webData.price.
    2. DATA INTEGRITY: Only report a FAIL if you find the same item name on the website but with a DIFFERENT price.
    3. IF YOU CANNOT ACCESS THE DATA: Do not make up fake data. Report that you couldn't find the item.
    4. CASE SENSITIVITY: "Pad Thai" and "PAD THAI" are the same item.
    5. STRUCTURAL AUDIT: 
       - If the Image groups items (e.g. "Prawn or Chicken $15") but the Web lists them as separate line items (e.g. "Prawn $15", "Chicken $15"), this is a PASS but note the structural difference.
       - If prices differ in this structure, it's a FAIL.

    OUTPUT: Return a JSON array of objects representing items extracted from the IMAGE.`;

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
                            status: { type: Type.STRING, description: "PASS, FAIL, or WARN" },
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
        
        // Extract grounding sources to prove where data came from
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources: GroundingSource[] = chunks
            .filter((c: any) => c.web && (c.web.uri.includes(targetDomain) || c.web.uri === webMenuUrl))
            .map((c: any) => ({
                uri: c.web.uri,
                title: c.web.title
            }));

        if (sources.length === 0 && items.length > 0) {
            sources.push({ uri: webMenuUrl, title: "Target Audit URL" });
        }

        return { items, sources };
    } catch (err: any) {
        if (err.message && err.message.includes("403")) {
            throw new Error("Audit Error: 403 Permission Denied. AI ไม่สามารถเข้าถึง URL นี้ได้ผ่าน Google Search แนะนำให้ใช้เครื่องมือ 'AI Scan Text' คัดลอกข้อความมาวางแทน");
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
