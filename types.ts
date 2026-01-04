
export enum Tab {
    Analysis = 'analysis',
    Delivery = 'delivery',
    Audit = 'audit',
    Menu = 'menu',
    Extraction = 'extraction',
    EmailAssistant = 'emailAssistant',
    Log = 'log'
}

export enum AuditType {
    PostLive = 'post-live',
    Cancellation = 'cancellation',
    GmbBulk = 'gmb-bulk'
}

export interface AnalysisResult {
    keyFindings: string;
    qualitativeAssessment: string;
    emailDraft: string;
}

export type AuditStatus = 'PASS' | 'FAIL' | 'WARN' | 'SUSPICIOUS';

export interface AuditResultItem {
    status: AuditStatus;
    title: string;
    detail: string;
}

export interface MenuDataItem {
    price: string;
    description: string;
}

export interface MenuCheckResultItem {
    itemName: string;
    status: 'PASS' | 'FAIL' | 'WARN';
    mismatchDetails: string;
    webData: MenuDataItem | null;
    fileData: MenuDataItem | null;
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface MenuCheckResult {
    items: MenuCheckResultItem[];
    sources: GroundingSource[];
}

export interface LogEntry {
    timestamp: Date;
    tool: string;
    input: any;
    output: string;
    userId: string;
}

export interface TabProps {
    addLog(tool: string, input: any, output: string): void;
}

export interface AIStudio {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<void>;
}
