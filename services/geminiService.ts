import { GoogleGenAI, Type } from "@google/genai";
import { AuditResultItem, AuditType, MenuCheckResultItem, AnalysisResult } from '../types';

/**
 * Utility to extract JSON from a string that might contain extra text or markdown.
 * Uses regex to find the first and last braces/brackets to isolate the JSON block.
 */
const extractJsonFromString = (text: string): string => {
    try {
        const match = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (match) {
            const potentialJson = match[0];
            // Simple validation: try parsing it
            JSON.parse(potentialJson);
            return potentialJson;
        }
    } catch (e) {
        // If regex fails or results in invalid JSON, fall back to stripping logic
    }
    
    let clean = text.trim();
    if (clean.startsWith('```json')) clean = clean.substring(7);
    if (clean.startsWith('```')) clean = clean.substring(3);
    if (clean.endsWith('```')) clean = clean.substring(0, clean.length - 3);
    return clean.trim();
};

export async function analyzeStorePresence(websiteUrl: string, gmbUrl: string, facebookUrl: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
        model,
        contents: `You are a digital marketing analyst. Your task is to analyze a restaurant's online presence and provide a structured report.

Analyze these URLs:
- Website: ${websiteUrl}
- GMB: ${gmbUrl}
- Facebook: ${facebookUrl}

Based on this information (or typical issues if you cannot access the URLs), provide the following in your JSON response:

1.  **keyFindings**: A summary of key issues and missing data. Structure your response with clear headings for each platform (Website, GMB, Facebook) and use line breaks to separate points for readability.
2.  **qualitativeAssessment**: A sentiment analysis of customer feedback. First, provide the full analysis in English. Then, on a new line, add the separator '---TH---'. Finally, on another new line, provide the full Thai translation of the entire analysis.
3.  **emailDraft**: A professional email draft in Thai to the store owner, clearly outlining the findings and recommended actions.`,
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
    let prompt = `You are an operations auditor. Perform an audit.`;

    if (auditType === AuditType.PostLive) {
        prompt += ` This is a 'POST LIVE' audit for a new store. Data: ${JSON.stringify(auditData)}. Check for LFY affiliation text on website, GMB link correctness, tax configuration based on 'otherData', and Facebook action button link.`;
    } else if (auditType === AuditType.Cancellation) {
        prompt += ` This is a 'Cancellation' audit. Data: ${JSON.stringify(auditData)}. Check for website deactivation (no LFY text), GMB link removal/redirection, and if the website is inaccessible (flag as SUSPICIOUS).`;
    } else { // GmbBulk
        prompt += ` This is a 'GMB Bulk Link' audit. Check if the GMB links in the following data correctly redirect to the specified website link. Data: ${auditData}`;
    }

    prompt += " Return an array of audit items. If all checks pass, return an empty array.";

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
        contents: `Based on these audit failures: ${JSON.stringify(failures)}, write a concise root cause analysis (RCA) summary in Thai to explain the core problem and suggest a solution.`,
    });
    return response.text;
}

export async function extractMenuData(imageBase64: string, mimeType: string, shopType: 'restaurant' | 'massage' = 'restaurant') {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    
    let instructions = '';
    
    if (shopType === 'restaurant') {
        instructions = `You are a highly precise menu data extraction specialist for restaurants.
1. Analyze the Image: Carefully identify all menu items.
2. Format: Exactly as follows:
   [Item Name]
   Price : [Price]
   Description
   [The full description of the item]
   (Blank line between items)
3. Others: Capture MISC text (hours, phone) at the end under \`Others\`.`;
    } else {
        instructions = `You are a highly precise service data extraction specialist for massage shops.
1. Analyze the Image: Identify service categories (headers), service names, durations, and prices.
2. Format: Output each service variation as follows:
   Category : [Header Name] ([Service Name])
   Duration :
   [Service Name] [Duration] [Price]
   [Service Name] [Duration] [Price]
   ...
   (Blank line between different services)

3. Rules for "Category" Line:
   - If a grouping header (e.g., "THERAPEUTIC") exists above the service (e.g., "Remedial"), write: Category : THERAPEUTIC (Remedial)
   - If no grouping header is explicitly stated, use only the Service Name: Category : Thai Massage
   - Capture all durations and prices from the table columns.

4. Others: Capture MISC text (hours, phone, address) at the end under \`Others\`.`;
    }

    const imagePart = {
        inlineData: {
            mimeType,
            data: imageBase64,
        },
    };
    const textPart = {
        text: `${instructions}\n\nIf the image is blurry or unreadable, respond with: "I cannot clearly analyze the provided image."`,
    };

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, textPart] },
    });
    return response.text;
}

export async function crossCheckMenu(webMenuUrl: string, imageBase64: string, mimeType: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    const imagePart = {
        inlineData: {
            mimeType,
            data: imageBase64,
        },
    };
    const textPart = {
        text: `You are a menu cross-check machine. Compare the menu items in the provided image with the items found at the URL: ${webMenuUrl}.

**CRITICAL RULES:**
1. **JSON Output Only:** Your entire response must be a valid JSON array. Do not include any text before or after the array.
2. **Price Comparison:** Use numeric equality. "$12" and "$12.00" (or "$12.00" formatted with colons sometimes like "$12:00" in messy text) are considered EQUAL (PASS). Only flag as FAIL if the actual price value is different (e.g., $12 vs $15).
3. **Structure:** Each item must be: { "itemName": "string", "status": "PASS|FAIL|WARN", "mismatchDetails": "string", "webData": { "price": "string", "description": "string" }, "imageData": { "price": "string", "description": "string" } }.
4. **URL Inaccessible:** If you cannot reach the URL, return [{ "itemName": "System", "status": "FAIL", "mismatchDetails": "URL inaccessible" }].

Analyze carefully.`,
    };

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
                        webData: {
                            type: Type.OBJECT,
                            properties: {
                                price: { type: Type.STRING },
                                description: { type: Type.STRING }
                            }
                        },
                        imageData: {
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

    const jsonText = extractJsonFromString(response.text);
    return JSON.parse(jsonText) as MenuCheckResultItem[];
}

export async function generateCommunicationScript(path: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
        model,
        contents: `Generate a polite and professional communication script in Thai for a customer support agent to send to a restaurant owner. The problem is: "${path}". The script should clearly state the recommended next step for the restaurant.`,
    });
    return response.text;
}

export async function generateEmailDraft(scenario: string, context: string, tone: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    const prompt = `You are an expert customer support agent for 'Local for you', a food delivery platform service. 
Your task is to write a professional and polite email in **Thai**.

**Scenario:** ${scenario}
**Desired Tone:** ${tone}
**Key Information to Include:** 
${context}

Please structure the email with a clear subject line, greeting, body, resolution, and closing.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });
    return response.text;
}
