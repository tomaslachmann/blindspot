export interface UsageAnalysis {
    filePath: string;
    exports: string[];
    usedHooks: string[];
    usedComponents: string[];
    conditions: string[];
}
export declare function analyzeUsages(code: string, filePath: string): UsageAnalysis;
