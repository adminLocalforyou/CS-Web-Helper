
import { GoogleGenAI, Type } from "@google/genai";
import { AuditResultItem, AuditType, MenuCheckResultItem, AnalysisResult } from '../types';

function extractJsonFromString(text: string) {
    try {
        const match = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (match) {
            const potentialJson = match[0];
            JSON.parse(potentialJson);
            return potentialJson;
        }
    } catch (e) {
        // Fallback
    }
    
    let clean = text.trim();
    if (clean.startsWith('```json')) { clean = clean.substring(7); }
    if (clean.startsWith('```')) { clean = clean.substring(3); }
    if (clean.endsWith('```')) { clean = clean.substring(0, clean.length - 3); }
    return clean.trim();
}

export async function analyzeStorePresence(websiteUrl: string, gmbUrl: string, facebookUrl: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
        model,
        contents: `Analyze these URLs and return JSON:
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    let prompt = `Operations audit for ${auditType}. Data: ${JSON.stringify(auditData)}. Return an array of audit items.`;

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
                    required: ["status", "title", "detail"]
                }
            }
        }
    });

    return JSON.parse(extractJsonFromString(response.text)) as AuditResultItem[];
}

export async function generateRcaSummary(failures: AuditResultItem[]) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
        model,
        contents: `Audit failures: ${JSON.stringify(failures)}. Write RCA in Thai.`,
    });
    return response.text;
}

export async function extractMenuData(imageBase64: string, mimeType: string, shopType: 'restaurant' | 'massage' = 'restaurant') {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    const instructions = `Extract ${shopType} data precisely.`;
    const imagePart = { inlineData: { mimeType, data: imageBase64 } };
    const textPart = { text: instructions };
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, textPart] },
    });
    return response.text;
}

export async function crossCheckMenu(webMenuUrl: string, imageBase64: string, mimeType: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    const imagePart = { inlineData: { mimeType, data: imageBase64 } };
    const textPart = { text: `Compare menu image with ${webMenuUrl}. Return JSON array.` };

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        itemName: { type: Type.STRING },
                        status: { type: Type.STRING },
                        mismatchDetails: { type: Type.STRING },
                        webData: { type: Type.OBJECT, properties: { price: { type: Type.STRING }, description: { type: Type.STRING } } },
                        imageData: { type: Type.OBJECT, properties: { price: { type: Type.STRING }, description: { type: Type.STRING } } }
                    },
                    required: ["itemName", "status", "mismatchDetails"]
                }
            }
        }
    });

    return JSON.parse(extractJsonFromString(response.text)) as MenuCheckResultItem[];
}

export async function generateCommunicationScript(path: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
        model,
        contents: `Communication script in Thai for: ${path}`,
    });
    return response.text;
}

export async function generateEmailDraft(scenario: string, context: string, tone: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
        model,
        contents: `Draft Thai email for ${scenario} with tone ${tone}. Context: ${context}`,
    });
    return response.text;
}
