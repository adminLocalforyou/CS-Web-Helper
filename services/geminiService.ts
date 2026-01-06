
import { GoogleGenAI, Type } from "@google/genai";
import { AuditResultItem, AuditType, MenuCheckResultItem, AnalysisResult, MenuCheckResult, GroundingSource } from '../types';

function getAIInstance() {
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
    if (!apiKey) {
        throw new Error("API Key is not configured.");
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
    
    let instructions = "";
    if (shopType === 'massage') {
        instructions = `ACT AS A TEXT EXTRACTOR FOR MASSAGE SERVICES.
        
        FORMAT RULES:
        1. Category : [Category Name]
        2. Service : [Service Name]
        3. [Service Name] - [Duration][Price]
        4. STRICTLY NO PARENTHESES () OR BRACKETS [].
        5. STRICTLY NO MARKDOWN BOLDING (DO NOT USE **).
        6. OTHERS SECTION: ANY text that is NOT a service or category (e.g., Shop Name, Address, Phone, Opening Hours, T&C) MUST be grouped under the header "Others" at the VERY BOTTOM of the response.
        
        Example Output:
        Category : Thai Massage
        Service : Traditional Thai
        Traditional Thai - 60mins $70
        Traditional Thai - 90mins $100
        
        Others
        Sunshine Spa
        Address: 123 Main St
        Phone: 021234567`;
    } else {
        instructions = `ACT AS A TEXT EXTRACTOR FOR RESTAURANT MENUS.
        
        FORMAT RULES:
        1. Item : [Item Name]
        2. Price : [Price]
        3. Description : [Description]
        4. Use "---" as a separator ONLY between menu items.
        5. STRICTLY NO PARENTHESES () OR BRACKETS [].
        6. STRICTLY NO MARKDOWN BOLDING (DO NOT USE **).
        7. If no description, use "Description : -"
        8. OTHERS SECTION: ANY text that is NOT a menu item (e.g., Restaurant Name, Address, Website, Opening Hours, Surcharge info) MUST be grouped under the header "Others" at the VERY BOTTOM of the response.
        
        Example Output:
        Item : Pad Thai
        Price : $18.50
        Description : Stir-fried noodles with egg and sprouts.
        ---
        Item : Spring Rolls
        Price : $8.00
        Description : -
        ---
        
        Others
        Baan Thai Restaurant
        10% Surcharge on Sundays
        Open daily 11am - 10pm`;
    }

    const imagePart = { inlineData: { mimeType, data: imageBase64 } };
    const textPart = { text: instructions + "\n\nPlease extract all visible text from the image accurately." };
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
    const systemPrompt = `Compare menu items in IMAGE with LIVE menu at ${webMenuUrl}.`;

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
