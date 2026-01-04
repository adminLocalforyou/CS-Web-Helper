import { GoogleGenAI, Type } from "@google/genai";
import { AuditResultItem, AuditType, MenuCheckResultItem, AnalysisResult } from '../types';

function getAIInstance() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API key is missing. Please add API_KEY to your environment.");
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
                    required: ["status", "title", "detail"]
                }
            }
        }
    });

    return JSON.parse(extractJsonFromString(response.text)) as AuditResultItem[];
}

export async function generateRcaSummary(failures: AuditResultItem[]) {
    const ai = getAIInstance();
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
        model,
        contents: `Audit failures: ${JSON.stringify(failures)}. Write a concise RCA in Thai.`,
    });
    return response.text;
}

export async function extractMenuData(imageBase64: string, mimeType: string, shopType: 'restaurant' | 'massage' = 'restaurant') {
    const ai = getAIInstance();
    const model = 'gemini-3-flash-preview';
    
    let instructions = '';
    if (shopType === 'restaurant') {
        instructions = `You are an expert menu extraction AI. 
STRICT RULES:
1. OUTPUT MUST BE 100% ENGLISH ONLY. Do not translate anything to Thai.
2. Format each item as:
[Item Name]
Price : [Price]
Description
[Description text]
---`;
    } else {
        instructions = `You are an expert service extraction AI for Massage & Wellness shops.
STRICT RULES:
1. OUTPUT MUST BE 100% ENGLISH ONLY. No Thai translations.
2. GROUP SERVICES BY CATEGORY.
3. FORMAT: Whenever you find a new category or when the service type changes, you MUST print:
Category : [Category Name]
4. List services under it as:
- [Service Name] [Duration] [Price]
5. When one category's services are finished and a new one starts, print the next "Category : [Name]" header immediately.

Example output:
Category : THERAPEUTIC (Remedial)
- Remedial Massage 60 mins $90
- Remedial Massage 90 mins $130
---
Category : THERAPEUTIC (Deep Tissue)
- Deep Tissue Massage 60 mins $85
---`;
    }

    const imagePart = { inlineData: { mimeType, data: imageBase64 } };
    const textPart = { text: instructions + "\n\nExtract all data from the image following these rules strictly." };
    
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, textPart] },
    });
    return response.text;
}

export async function crossCheckMenu(webMenuUrl: string, fileBase64: string, mimeType: string) {
    const ai = getAIInstance();
    const model = 'gemini-3-pro-preview';
    
    const filePart = { 
        inlineData: { 
            mimeType, 
            data: fileBase64 
        } 
    };

    const systemPrompt = `ACT AS A ROBOTIC FORENSIC AUDITOR WITH 100% CHARACTER MATCHING ACCURACY.

GOAL: Compare EVERY ITEM in the document against the website: ${webMenuUrl}. 

CRITICAL PROTOCOLS:
1. SCAN EVERYTHING: You MUST extract every single item from the document first. If you see 57 items, you report 57 items. DO NOT SUMMARIZE. DO NOT SKIP.
2. CHARACTER-BY-CHARACTER MATCHING:
   - Price: $12 (Doc) vs $13 (Web) is a FAIL.
   - Text: (5 PIECES) vs (4 PIECES) is a FAIL.
   - Price: $12.00 vs $12.50 is a FAIL.
3. INTERNAL VERIFICATION STEP:
   - Step 1: Transcribe the document item name and price exactly.
   - Step 2: Use Google Search/Maps to find THAT EXACT ITEM on the website URL.
   - Step 3: Compare. If they are not IDENTICAL characters, mark as "FAIL".
4. MANDATORY EVIDENCE: In 'mismatchDetails', you MUST show the difference like: "Mismatch: [Item Name] | Document says $12 | Web says $13".
5. NO ASSUMPTIONS: If you cannot find the item on the website, mark as FAIL.

OUTPUT: Return a JSON array of MenuCheckResultItem for every item detected.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: { parts: [filePart, { text: systemPrompt }] },
            config: {
                tools: [{ googleSearch: {} }],
                thinkingConfig: { thinkingBudget: 32768 },
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
                                properties: {
                                    price: { type: Type.STRING },
                                    description: { type: Type.STRING }
                                }
                            },
                            fileData: {
                                type: Type.OBJECT,
                                properties: {
                                    price: { type: Type.STRING },
                                    description: { type: Type.STRING }
                                }
                            }
                        },
                        required: ["itemName", "status", "mismatchDetails"]
                    }
                }
            }
        });

        const results = JSON.parse(extractJsonFromString(response.text)) as MenuCheckResultItem[];
        // Double check results locally to ensure Fail/Pass logic is respected by the developer logic if needed
        return results;
    } catch (err: any) {
        console.error("Gemini API Error:", err);
        if (err.message?.includes('500') || err.message?.includes('INTERNAL')) {
            throw new Error("AI Server Error: ข้อมูลมีขนาดใหญ่เกินไป หรือการประมวลผลลึกเกินขีดจำกัด โปรดลองอัปโหลดเป็นภาพแยกทีละส่วน หรือลองใหม่อีกครั้ง");
        }
        throw err;
    }
}

export async function generateCommunicationScript(path: string) {
    const ai = getAIInstance();
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
        model,
        contents: `Generate a polite Thai customer support script for this issue path: ${path}`,
    });
    return response.text;
}

export async function generateEmailDraft(scenario: string, context: string, tone: string) {
    const ai = getAIInstance();
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
        model,
        contents: `Draft a professional Thai email for scenario "${scenario}" using tone "${tone}". Context: ${context}`,
    });
    return response.text;
}
